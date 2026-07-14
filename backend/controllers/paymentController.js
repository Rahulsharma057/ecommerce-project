const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const PaymentSetting = require("../models/PaymentSetting");
const generateInvoiceNumber = require("../utils/invoiceNumber");

// Requires env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
// (Test mode keys are fine to start with — UPI works in test mode too,
// Razorpay simulates a success/failure screen instead of a real bank app.)
//
// IMPORTANT: this client is created LAZILY (only when a payment route is
// actually hit), not at file-load time. Building it eagerly at the top of
// the file means a missing/blank env var throws during `require()` —
// which crashes the ENTIRE server on startup, taking down every other
// route with it (that's what caused the "Failed to fetch" errors earlier).
let razorpayInstance = null;

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file",
    );
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

function calculateTotals(items, discountAmount = 0) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingFee = subtotal >= 2000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const discount = Math.min(Math.max(discountAmount, 0), subtotal);
  const discountPercent = subtotal > 0 ? (discount / subtotal) * 100 : 0;
  const totalAmount = Math.max(subtotal + shippingFee + tax - discount, 0);
  return { subtotal, shippingFee, tax, discount, discountPercent, totalAmount };
}

// =========================
// GET /payment/settings — lets the frontend check whether online payment
// is configured at all, BEFORE showing the "Pay with UPI" button or trying
// to create an order. Never exposes the secret key — only whether it's set
// up, and the public key_id needed by Razorpay's checkout.js.
// =========================

exports.getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSetting.findOne();

    if (!settings) {
      settings = await PaymentSetting.create({
        cod: {
          enabled: true,
        },
        razorpay: {
          enabled: false,
        },
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =========================
// STEP 1 — Create a Razorpay order + our own DB order (status: Pending,
// paymentStatus: Pending). Stock is NOT touched yet — it's only decremented
// once payment is actually verified, so an abandoned UPI attempt never
// locks up inventory.
// =========================
exports.createPaymentOrder = async (req, res) => {
  try {
    const { items, shippingAddress, coupon, discount = 0 } = req.body;
    const settings = await PaymentSetting.findOne();

    if (!settings) {
      return res.status(400).json({
        message: "Payment settings not configured",
      });
    }

    if (!settings.razorpay?.enabled) {
      return res.status(400).json({
        message: "Online payment is currently disabled",
      });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product)
        return res.status(404).json({
          message: "Product not found",
        });

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      item.category = product.category || "";
      item.subCategory = product.subCategory || "";
      item.brand = product.brand || "";
      item.fabric = product.fabric || "";
      item.sku = product.sku || "";
      item.color = item.color || "";
      item.size = item.size || "";
    }

    const totals = calculateTotals(items, discount);

    if (totals.totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    // Razorpay expects the amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(totals.totalAmount * 100);

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod: "RAZORPAY",
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date(),
      couponCode: coupon,
      discount: totals.discount,
      discountPercent: totals.discountPercent,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      tax: totals.tax,
      totalAmount: totals.totalAmount,
      status: "Pending",
      paymentStatus: "Pending",
    });

    const razorpayOrder = await getRazorpay().orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order._id.toString(),
      notes: { orderId: order._id.toString(), userId: req.user.id },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log("CREATE PAYMENT ERROR =>", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================
// STEP 2 — Verify the payment signature Razorpay's checkout handler gives
// us. This is the step that actually confirms money changed hands — never
// trust the frontend's "it succeeded" callback on its own.
// =========================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      orderId, // our Mongo _id
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res
        .status(400)
        .json({ message: "Missing payment verification details" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Order mismatch" });
    }

    if (order.paymentStatus === "Paid") {
      // Already verified earlier (e.g. duplicate callback) — just return it
      return res.json({ message: "Payment already verified", order });
    }

    // The actual proof: HMAC-SHA256 of "order_id|payment_id" signed with our
    // secret key must match what Razorpay sent — this can't be faked by a
    // tampered frontend request.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "Failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Signature is valid — payment is genuine. Now check stock again (in
    // case it sold out while the user was in the UPI app) and decrement it.
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        // Payment succeeded but we can't fulfill it — mark paid but flag
        // for manual admin attention rather than silently overselling.
        order.paymentStatus = "Paid";
        order.status = "Pending";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentVerifiedAt = new Date();
        await order.save();
        return res.json({
          message:
            "Payment verified, but stock is insufficient — our team will contact you about this order.",
          order,
        });
      }
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Fetch the actual payment method used (upi / card / netbanking / wallet)
    let paymentChannel = "";
    try {
      const payment = await getRazorpay().payments.fetch(razorpay_payment_id);
      paymentChannel = payment.method || "";
    } catch {
      // Non-critical — verification already succeeded via signature above
    }

    order.paymentStatus = "Paid";
    order.status = "Confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentVerifiedAt = new Date();
    order.paymentChannel = paymentChannel;
    order.invoiceNumber = order.invoiceNumber || generateInvoiceNumber();
    order.invoiceDate = order.invoiceDate || new Date();

    await order.save();
    await Cart.deleteMany({ userId: req.user.id });

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// Called when the user closes/dismisses the Razorpay checkout without
// completing payment — lets us mark it Failed instead of leaving it
// stuck at "Pending" forever with no signal.
// =========================
exports.markPaymentFailed = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "Pending") {
      order.paymentStatus = "Failed";
      await order.save();
    }

    res.json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePaymentSettings = async (req, res) => {
  try {
    const { cod, razorpay } = req.body;

    let settings = await PaymentSetting.findOne();

    const payload = {
      cod: {
        enabled: !!cod?.enabled,
      },

      razorpay: {
        enabled: !!razorpay?.enabled,
      },
    };

    if (!settings) {
      settings = await PaymentSetting.create(payload);
    } else {
      settings = await PaymentSetting.findByIdAndUpdate(settings._id, payload, {
        new: true,
        runValidators: true,
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

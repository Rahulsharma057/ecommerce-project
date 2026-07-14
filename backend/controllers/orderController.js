const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const generateInvoiceNumber = require("../utils/invoiceNumber");
const PaymentSetting = require("../models/PaymentSetting");
const crypto = require("crypto");
const Coupon = require("../models/Coupon");
const RETURN_WINDOW_DAYS = 7;

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

function getIneligibleReturnItemIds(order) {
  const cancelledIds = (order.cancelledItems || []).map((i) =>
    i.itemId.toString(),
  );

  const blockedByReturn = (order.returns || [])
    .filter((r) => r.status !== "Rejected")
    .flatMap((r) => r.items.map((i) => i.itemId.toString()));

  return new Set([...cancelledIds, ...blockedByReturn]);
}

// =========================
// PLACE ORDER (USER)
// =========================
exports.placeOrder = async (req, res) => {
 
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      coupon,
      discount = 0,
      transactionId = "",
      razorpayOrderId = "",
      razorpayPaymentId = "",
      razorpaySignature = "",
      paymentChannel = "",
    } = req.body;
 if (paymentMethod === "RAZORPAY") {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Payment verification data missing",
      });
    }
  }
    const paymentSettings = await PaymentSetting.findOne();
    if (paymentMethod === "RAZORPAY") {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({
          message: "Invalid payment signature",
        });
      }
    }

    if (paymentSettings) {
      if (paymentMethod === "COD" && !paymentSettings.cod.enabled) {
        return res.status(400).json({
          message: "COD is currently unavailable",
        });
      }

      if (paymentMethod === "RAZORPAY" && !paymentSettings.razorpay.enabled) {
        return res.status(400).json({
          message: "Online payment is currently unavailable",
        });
      }
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `${product.name} is out of stock` });
      }

      item.category = product.category || "";
      item.subCategory = product.subCategory || "";
      item.brand = product.brand || "";
      item.fabric = product.fabric || "";
      item.sku = item.sku || product.sku || "";
      item.color = item.color || "";
      item.size = item.size || "";
    }

    const {
      subtotal,
      shippingFee,
      tax,
      discount: appliedDiscount,
      discountPercent,
      totalAmount,
    } = calculateTotals(items, discount);

    // FIX: Razorpay order ka matlab payment already verify ho chuka hai
    // (RazorpayPayment handler signature check karta hai place karne se pehle),
    // isliye ye "Paid" mark hota hai; baaki methods "Pending" rehte hain.
    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "RAZORPAY" ? "Paid" : "Pending",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentChannel,
      paymentVerifiedAt: paymentMethod === "RAZORPAY" ? new Date() : null,
      couponCode: coupon,
      discount: appliedDiscount,
      discountPercent,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date(),
    });
if (coupon) {
  await Coupon.findByIdAndUpdate(coupon, {
    $inc: {
      usedCount: 1,
    },
  });
}
    await Cart.deleteMany({ userId: req.user.id });

    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* exports.verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const { paymentId, razorpay_order_id, razorpay_signature, orderData } =
      req.body;

    const body = razorpay_order_id + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }
    if(
!paymentId ||
!razorpay_order_id ||
!razorpay_signature ||
!orderData
){
return res.status(400).json({
message:"Invalid payment data"
});
}
for (let item of orderData.items) {

  const product = await Product.findById(item.productId);

  if (!product) {
    return res.status(404).json({
      message:"Product not found"
    });
  }

  item.category = product.category || "";
  item.subCategory = product.subCategory || "";
  item.brand = product.brand || "";
  item.fabric = product.fabric || "";
  item.sku = product.sku || "";

}
    // yaha razorpay verify already frontend se ho chuka hoga

    const order = await Order.create({
      userId: req.user.id,

      items: orderData.items,

      shippingAddress: orderData.shippingAddress,

      paymentMethod: "RAZORPAY",

      paymentStatus: "Paid",

      transactionId: paymentId,

      couponCode: orderData.coupon,

      discount: orderData.discount,

      subtotal: orderData.subtotal,

      shippingFee: orderData.shippingFee,

      tax: orderData.tax,

     totalAmount:
orderData.totalAmount,
      invoiceNumber: generateInvoiceNumber(),

      invoiceDate: new Date(),
    });

    await Cart.deleteMany({
      userId: req.user.id,
    });

    for (let item of orderData.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}; */
// =========================
// USER ORDERS
// =========================
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

// =========================
// CANCEL ORDER
// =========================
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }
    if (order.status === "Delivered") {
      return res.status(400).json({
        message:
          "Delivered orders cannot be cancelled. Please use the return option instead.",
      });
    }
    if (req.user.role !== "admin" && order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "You can only cancel pending orders" });
    }

    let selectedItemIds = req.body.items;
    if (typeof selectedItemIds === "string") {
      try {
        selectedItemIds = JSON.parse(selectedItemIds);
      } catch {
        selectedItemIds = [];
      }
    }
    if (!Array.isArray(selectedItemIds) || selectedItemIds.length === 0) {
      selectedItemIds = order.items.map((item) => item._id.toString());
    }

    const orderItemIds = order.items.map((item) => item._id.toString());
    const invalidIds = selectedItemIds.filter(
      (id) => !orderItemIds.includes(id),
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "One or more selected items do not belong to this order",
      });
    }

    const alreadyCancelledIds =
      order.cancelledItems?.map((item) => item.itemId.toString()) || [];
    const duplicateItems = selectedItemIds.filter((id) =>
      alreadyCancelledIds.includes(id),
    );
    if (duplicateItems.length > 0) {
      return res.status(400).json({
        message: "One or more selected items are already cancelled",
      });
    }

    const remainingItems = order.items.filter(
      (item) => !selectedItemIds.includes(item._id.toString()),
    );

    const isFullCancel = remainingItems.length === 0;
    const itemsToCancel = order.items.filter((item) =>
      selectedItemIds.includes(item._id.toString()),
    );

    for (const item of itemsToCancel) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.cancelledItems = [
      ...(order.cancelledItems || []),
      ...itemsToCancel.map((item) => ({
        itemId: item._id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        color: item.color || "",
        size: item.size || "",
        reason: req.user.role === "admin" ? "" : reason || "",
        adminNote: req.user.role === "admin" ? reason || "" : "",
        cancelledBy: req.user.role,
        cancelledAt: new Date(),
      })),
    ];

    if (isFullCancel) {
      order.status = "Cancelled";

      order.items = [];
      order.subtotal = 0;
      order.shippingFee = 0;
      order.tax = 0;
      order.discount = 0;
      order.discountPercent = 0;
      order.totalAmount = 0;

      if (req.user.role === "admin") {
        order.cancelReason = "";
        order.adminCancelNote = reason || "";
      } else {
        order.cancelReason = reason || "";
        order.adminCancelNote = "";
      }

      order.cancelledBy = req.user.role;
      order.cancelledAt = new Date();
    } else {
      order.items = remainingItems;

      const rawSubtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const proportionalDiscount = Math.round(
        (rawSubtotal * (order.discountPercent || 0)) / 100,
      );

      const { subtotal, shippingFee, tax, discount, totalAmount } =
        calculateTotals(order.items, proportionalDiscount);

      order.subtotal = subtotal;
      order.shippingFee = shippingFee;
      order.tax = tax;
      order.discount = discount;
      order.totalAmount = totalAmount;
    }

    await order.save();

    res.json({
      message: isFullCancel
        ? "Order cancelled successfully"
        : "Selected item(s) cancelled successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// SINGLE ORDER (USER)
// =========================
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId")
      .populate("couponCode", "code discountType discountValue");

    if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({
  ...order.toObject(),

  payment: {
    method: order.paymentMethod,
    status: order.paymentStatus,
    amount: order.totalAmount,

    paymentDate: order.paymentVerifiedAt,

    paymentId: order.razorpayPaymentId,

    orderId: order.razorpayOrderId,

    channel: order.paymentChannel,

    refundedAmount: order.refundedAmount || 0,
  },
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: ALL ORDERS
// =========================
exports.getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
};

// =========================
// ADMIN: SINGLE ORDER
// =========================
exports.getSingleOrderAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId")
      .populate("couponCode", "code discountType discountValue");

    if (!order) return res.status(404).json({ message: "Order not found" });
res.json({
  ...order.toObject(),

  payment: {
    method: order.paymentMethod,

    status: order.paymentStatus,

    amount: order.totalAmount,

    paymentDate: order.paymentVerifiedAt,

    paymentId: order.razorpayPaymentId,

    orderId: order.razorpayOrderId,

    channel: order.paymentChannel,

    refundedAmount: order.refundedAmount || 0,
  },
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: UPDATE STATUS
// =========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Cancelled") {
      return res
        .status(400)
        .json({ message: "Cancelled orders cannot change status" });
    }

    order.status = status;
if (status === "Delivered" && order.paymentMethod === "COD") {
  order.paymentStatus = "Paid";

  if (!order.paymentVerifiedAt) {
    order.paymentVerifiedAt = new Date();
  }
}
    if (status === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// USER: REQUEST RETURN
// =========================
exports.requestReturn = async (req, res) => {
  try {
    const { description } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Delivered") {
      return res
        .status(400)
        .json({ message: "Only delivered orders can be returned" });
    }

    if (order.deliveredAt) {
      const daysSince =
        (Date.now() - new Date(order.deliveredAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSince > RETURN_WINDOW_DAYS) {
        return res.status(400).json({
          message: `Return window has expired. Returns are only accepted within ${RETURN_WINDOW_DAYS} days of delivery.`,
        });
      }
    }

    let selectedItemIds = [];
    try {
      selectedItemIds = JSON.parse(req.body.items || "[]");
    } catch {
      selectedItemIds = [];
    }

    if (!Array.isArray(selectedItemIds) || selectedItemIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Select at least one item to return" });
    }

    const orderItemIds = order.items.map((item) => item._id.toString());
    const invalidIds = selectedItemIds.filter(
      (id) => !orderItemIds.includes(id),
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: "One or more selected items do not belong to this order",
      });
    }

    const ineligibleIds = getIneligibleReturnItemIds(order);
    const blocked = selectedItemIds.filter((id) => ineligibleIds.has(id));
    if (blocked.length > 0) {
      return res.status(400).json({
        message:
          "One or more selected items are already cancelled or part of an existing return",
      });
    }

    const selectedItems = order.items.filter((item) =>
      selectedItemIds.includes(item._id.toString()),
    );

    let images = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "returns" },
        );
        images.push(result.secure_url);
      }
    }

    const itemsSubtotal = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const discountShare =
      order.subtotal > 0
        ? Math.round((itemsSubtotal / order.subtotal) * (order.discount || 0))
        : 0;

    const taxShare =
      order.subtotal > 0
        ? Math.round((itemsSubtotal / order.subtotal) * (order.tax || 0))
        : 0;

    order.returns.push({
      items: selectedItems.map((item) => ({
        itemId: item._id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        color: item.color || "",
        size: item.size || "",
      })),
      reason: description || "",
      description: description || "",
      images,
      status: "Requested",
      pickupStatus: "NotPicked",
      refundStatus: "None",
      itemsSubtotal,
      discountAmount: discountShare,
      taxAmount: taxShare,
      refundTax: true,
      refundAmount: 0,
      requestedAt: new Date(),
      timeline: [
        {
          status: "Requested",
          message: `Return requested by user for ${selectedItemIds.length} item(s)`,
          date: new Date(),
        },
      ],
    });

    await order.save();

    res.json({ message: "Return requested", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: UPDATE RETURN STATUS (per batch)
// =========================
exports.updateReturnStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const { orderId, returnId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const returnBatch = order.returns.id(returnId);
    if (!returnBatch)
      return res.status(404).json({ message: "Return request not found" });

    const allowed = ["Requested", "Approved", "Rejected", "Refunded"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid return status" });
    }

    if (status === "Refunded" && returnBatch.pickupStatus !== "Received") {
      return res.status(400).json({
        message: "Cannot mark as refunded before the item is received",
      });
    }

    returnBatch.status = status;
    returnBatch.adminNote = adminNote || "";
    returnBatch.timeline.push({
      status,
      message: adminNote || `Return marked as ${status} by admin`,
      date: new Date(),
    });

    if (status === "Rejected") {
      returnBatch.pickupStatus = "NotPicked";
      returnBatch.refundStatus = "None";
      returnBatch.refundAmount = 0;
    }

    await order.save();
    res.json({ message: "Return status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: UPDATE PICKUP STATUS (per batch)
// =========================
exports.updatePickupStatus = async (req, res) => {
  try {
    const { pickupStatus } = req.body;
    const { orderId, returnId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const returnBatch = order.returns.id(returnId);
    if (!returnBatch)
      return res.status(404).json({ message: "Return request not found" });

    const allowed = [
      "NotPicked",
      "PickupScheduled",
      "Picked",
      "InTransit",
      "Received",
    ];
    if (!allowed.includes(pickupStatus)) {
      return res.status(400).json({ message: "Invalid pickup status" });
    }

    if (returnBatch.status !== "Approved") {
      return res.status(400).json({
        message: "Pickup can only be updated for an approved return",
      });
    }

    returnBatch.pickupStatus = pickupStatus;
    if (pickupStatus === "Received") {
      returnBatch.refundStatus = "Pending";
      returnBatch.refundAmount =
        returnBatch.itemsSubtotal -
        returnBatch.discountAmount +
        (returnBatch.refundTax ? returnBatch.taxAmount : 0);
    }

    await order.save();
    res.json({ message: "Pickup updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: UPDATE REFUND STATUS (per batch)
// =========================
exports.updateRefundStatus = async (req, res) => {
  try {
    const { refundStatus, refundAmount, refundTax } = req.body;
    const { orderId, returnId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const returnBatch = order.returns.id(returnId);
    if (!returnBatch)
      return res.status(404).json({ message: "Return request not found" });

    if (returnBatch.pickupStatus !== "Received") {
      return res
        .status(400)
        .json({ message: "Refund allowed only after item is received" });
    }

    const allowedStatus = ["None", "Pending", "Completed"];
    if (refundStatus && !allowedStatus.includes(refundStatus)) {
      return res.status(400).json({ message: "Invalid refund status" });
    }

    if (typeof refundTax === "boolean") {
      returnBatch.refundTax = refundTax;
    }

    const maxRefundable =
      returnBatch.itemsSubtotal -
      returnBatch.discountAmount +
      returnBatch.taxAmount;

    if (typeof refundAmount === "number" && !Number.isNaN(refundAmount)) {
      if (refundAmount < 0) {
        return res
          .status(400)
          .json({ message: "Refund amount cannot be negative" });
      }
      if (refundAmount > maxRefundable) {
        return res.status(400).json({
          message: `Refund amount cannot exceed ₹${maxRefundable} (item value${returnBatch.taxAmount ? " + tax" : ""})`,
        });
      }
      returnBatch.refundAmount = refundAmount;
    } else {
      returnBatch.refundAmount =
        returnBatch.itemsSubtotal -
        returnBatch.discountAmount +
        (returnBatch.refundTax ? returnBatch.taxAmount : 0);
    }

    if (refundStatus) {
      returnBatch.refundStatus = refundStatus;
    }
    const wasCompleted = returnBatch.refundStatus === "Completed";

    if (refundStatus) {
      returnBatch.refundStatus = refundStatus;
    }
    if (!wasCompleted && returnBatch.refundStatus === "Completed") {
      returnBatch.completedAt = new Date();
      returnBatch.status = "Refunded";
      returnBatch.timeline.push({
        status: "Refunded",
        message: `Refund of ₹${returnBatch.refundAmount} completed${
          returnBatch.refundTax ? " (incl. tax)" : " (tax excluded)"
        }`,
        date: new Date(),
      });
      for (const item of returnBatch.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: item.quantity,
          },
        });
      }
      // FIX: order-level running total was never being updated anywhere —
      // the frontend was already reading order.refundedAmount, but nothing
      // ever wrote to it. Now recalculated from all completed refunds.
      order.refundedAmount = (order.returns || [])
        .filter((r) => r.refundStatus === "Completed")
        .reduce((sum, r) => sum + (r.refundAmount || 0), 0);
    }

    await order.save();
    res.json({ message: "Refund updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "Paid") {
      order.paymentVerifiedAt = new Date();
    }

    if (paymentStatus === "Refunded") {
      order.refundedAmount = order.totalAmount;
    }

    await order.save();

    res.json({
      success: true,
      message: "Payment status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");


// =========================
// PLACE ORDER (USER)
// =========================
exports.placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      discount = 0,
      coupon,
    } = req.body;
const generateInvoiceNumber = require("../utils/invoiceNumber");
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }
    }

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shipping = subtotal >= 2000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);

    const totalAmount = subtotal + shipping + tax - discount;

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      couponCode: coupon,
      discount,
      totalAmount,
        invoiceNumber: generateInvoiceNumber(),
  invoiceDate: new Date(),

    });

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

// =========================
// USER ORDERS
// =========================
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(orders);
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // USER rule: only pending cancel
    if (req.user.role !== "admin" && order.status !== "Pending") {
      return res.status(400).json({ message: "You can only cancel pending orders" });
    }

    order.status = "Cancelled";
    order.cancelReason = reason;
    order.cancelledBy = req.user.role;
    order.cancelledAt = new Date();

    await order.save();

    res.json({ message: "Order cancelled", order });
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

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
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

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: UPDATE STATUS
// =========================
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.json({ message: "Status updated", order });
};

exports.requestReturn = async (req, res) => {
  try {
 const { description } = req.body;

    const order = await Order.findById(req.params.id);


    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }


    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned"
      });
    }



    let returnImages = [];



    // Upload return images to cloudinary
    if (req.files && req.files.length > 0) {


      for (let file of req.files) {


        const result =
          await cloudinary.uploader.upload(

            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

            {
              folder: "returns"
            }

          );


        returnImages.push(
          result.secure_url
        );


      }

    }



    order.returnStatus = "Requested";

    order.returnPickupStatus = "NotPicked";


    // description from frontend
    order.returnDescription =
      req.body.description || "";

order.returnReason =
      req.body.description || "";

    // images
    order.returnImages = returnImages || [];



    order.returnRequestedAt =
      new Date();



    order.returnTimeline = [
      ...(order.returnTimeline || []),
      {
        status: "Requested",
        message: "Return requested by user",
        date: new Date(),
      },
    ];



    await order.save();



    res.json({
      message:"Return requested",
      order
    });



  } catch(err){

    res.status(500).json({
      message:err.message
    });

  }
};
exports.updateReturnStatus = async (req, res) => {
  const { status, adminNote } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const allowed = ["Requested", "Approved", "Rejected", "Refunded"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid return status" });
  }

  order.returnStatus = status;
  order.adminNote = adminNote || "";

  await order.save();

  res.json({ message: "Return status updated", order });
};
exports.updatePickupStatus = async (req, res) => {
  const { pickupStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const allowed = ["NotPicked", "PickupScheduled", "Picked", "InTransit", "Received"];

  if (!allowed.includes(pickupStatus)) {
    return res.status(400).json({ message: "Invalid pickup status" });
  }

  order.returnPickupStatus = pickupStatus;
  if (pickupStatus === "Received") {
    order.refundStatus = "Pending";
  }
  await order.save();

  res.json({ message: "Pickup updated", order });
};

exports.updateRefundStatus = async (req, res) => {
  try {
    const { refundStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ONLY allow refund after pickup received
    if (order.returnPickupStatus !== "Received") {
      return res.status(400).json({
        message: "Refund allowed only after item is received"
      });
    }

    order.refundStatus = refundStatus;

    if (refundStatus === "Completed") {
      order.returnCompletedAt = new Date();
    }

    await order.save();

    res.json({ message: "Refund updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
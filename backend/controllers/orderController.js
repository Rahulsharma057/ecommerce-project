const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const generateInvoiceNumber = require("../utils/invoiceNumber");

const RETURN_WINDOW_DAYS = 7;

function calculateTotals(items, discountPercent = 0) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 2000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = Math.max(subtotal + shippingFee + tax - discount, 0);
  return { subtotal, shippingFee, tax, discount, totalAmount };
}

// Which item ids can NOT be returned right now — either cancelled,
// or already part of a return batch that's still active or completed
// (Requested / Approved / Refunded). Items from a REJECTED batch are
// excluded from this list, so they become returnable again.
function getIneligibleReturnItemIds(order) {
  const cancelledIds = (order.cancelledItems || []).map((i) => i.itemId.toString());

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
    const { items, shippingAddress, paymentMethod, coupon, discountPercent = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }
    }

    const { subtotal, shippingFee, tax, discount, totalAmount } = calculateTotals(items, discountPercent);

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      couponCode: coupon,
      discount,
      discountPercent,
      subtotal,
      shippingFee,
      tax,
      totalAmount,
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date(),
    });

    await Cart.deleteMany({ userId: req.user.id });

    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
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
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
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
        message: "Delivered orders cannot be cancelled. Please use the return option instead.",
      });
    }
    if (req.user.role !== "admin" && order.status !== "Pending") {
      return res.status(400).json({ message: "You can only cancel pending orders" });
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
    const invalidIds = selectedItemIds.filter((id) => !orderItemIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "One or more selected items do not belong to this order" });
    }

    const alreadyCancelledIds = order.cancelledItems?.map((item) => item.itemId.toString()) || [];
    const duplicateItems = selectedItemIds.filter((id) => alreadyCancelledIds.includes(id));
    if (duplicateItems.length > 0) {
      return res.status(400).json({ message: "One or more selected items are already cancelled" });
    }

    const isFullCancel = selectedItemIds.length === order.items.length;
    const itemsToCancel = order.items.filter((item) => selectedItemIds.includes(item._id.toString()));

    for (const item of itemsToCancel) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
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
        reason: reason || "",
        cancelledAt: new Date(),
      })),
    ];

    if (isFullCancel) {
      order.status = "Cancelled";
      order.cancelReason = reason || "";
      order.cancelledBy = req.user.role;
      order.cancelledAt = new Date();
    } else {
      order.items = order.items.filter((item) => !selectedItemIds.includes(item._id.toString()));

      const { subtotal, shippingFee, tax, discount, totalAmount } = calculateTotals(
        order.items,
        order.discountPercent || 0,
      );

      order.subtotal = subtotal;
      order.shippingFee = shippingFee;
      order.tax = tax;
      order.discount = discount;
      order.totalAmount = totalAmount;
    }

    await order.save();

    res.json({
      message: isFullCancel ? "Order cancelled successfully" : "Selected item(s) cancelled successfully",
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
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// ADMIN: ALL ORDERS
// =========================
exports.getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
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
    res.json(order);
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
    const allowed = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Cancelled orders cannot change status" });
    }

    order.status = status;

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
// FIX: creates a NEW independent batch each time — doesn't overwrite
// previous returns, and doesn't block returning OTHER eligible items
// just because an earlier return exists on this order.
// =========================
exports.requestReturn = async (req, res) => {
  try {
    const { description } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Delivered") {
      return res.status(400).json({ message: "Only delivered orders can be returned" });
    }

    if (order.deliveredAt) {
      const daysSince = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
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
      return res.status(400).json({ message: "Select at least one item to return" });
    }

    const orderItemIds = order.items.map((item) => item._id.toString());
    const invalidIds = selectedItemIds.filter((id) => !orderItemIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "One or more selected items do not belong to this order" });
    }

    // THE ACTUAL FIX: only block items that are individually already
    // cancelled or in an active/completed return — not the whole order.
    const ineligibleIds = getIneligibleReturnItemIds(order);
    const blocked = selectedItemIds.filter((id) => ineligibleIds.has(id));
    if (blocked.length > 0) {
      return res.status(400).json({
        message: "One or more selected items are already cancelled or part of an existing return",
      });
    }

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

    const selectedItems = order.items.filter((item) => selectedItemIds.includes(item._id.toString()));

    order.returns.push({
      items: selectedItems.map((item) => ({
        itemId: item._id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      reason: description || "",
      description: description || "",
      images,
      status: "Requested",
      pickupStatus: "NotPicked",
      refundStatus: "None",
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
    if (!returnBatch) return res.status(404).json({ message: "Return request not found" });

    const allowed = ["Requested", "Approved", "Rejected", "Refunded"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid return status" });
    }

    if (status === "Refunded" && returnBatch.pickupStatus !== "Received") {
      return res.status(400).json({ message: "Cannot mark as refunded before the item is received" });
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
    if (!returnBatch) return res.status(404).json({ message: "Return request not found" });

    const allowed = ["NotPicked", "PickupScheduled", "Picked", "InTransit", "Received"];
    if (!allowed.includes(pickupStatus)) {
      return res.status(400).json({ message: "Invalid pickup status" });
    }

    if (returnBatch.status !== "Approved") {
      return res.status(400).json({ message: "Pickup can only be updated for an approved return" });
    }

    returnBatch.pickupStatus = pickupStatus;

    if (pickupStatus === "Received") {
      returnBatch.refundStatus = "Pending";
      returnBatch.refundAmount = returnBatch.items.reduce((acc, i) => acc + i.total, 0);
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
    const { refundStatus } = req.body;
    const { orderId, returnId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const returnBatch = order.returns.id(returnId);
    if (!returnBatch) return res.status(404).json({ message: "Return request not found" });

    if (returnBatch.pickupStatus !== "Received") {
      return res.status(400).json({ message: "Refund allowed only after item is received" });
    }

    const allowed = ["None", "Pending", "Completed"];
    if (!allowed.includes(refundStatus)) {
      return res.status(400).json({ message: "Invalid refund status" });
    }

    returnBatch.refundStatus = refundStatus;

    if (refundStatus === "Completed") {
      returnBatch.completedAt = new Date();
      returnBatch.status = "Refunded";
    }

    await order.save();
    res.json({ message: "Refund updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
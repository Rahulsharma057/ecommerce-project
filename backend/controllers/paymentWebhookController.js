const crypto = require("crypto");
const Order = require("../models/Order");

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }

    const event = req.body.event;

    // PAYMENT SUCCESS

    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      const razorpayOrderId = payment.order_id;

      const order = await Order.findOne({
        razorpayOrderId,
      });

      if (order) {
        order.paymentStatus = "Paid";

        order.status = "Confirmed";

        order.razorpayPaymentId = payment.id;

        order.paymentVerifiedAt = new Date();

        await order.save();
      }
    }

    // PAYMENT FAILED

    if (event === "payment.failed") {
      const payment = req.body.payload.payment.entity;

      const order = await Order.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (order) {
        order.paymentStatus = "Failed";

        await order.save();
      }
    }

    res.json({
      status: "ok",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

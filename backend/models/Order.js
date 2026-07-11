const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,
      house: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },

    paymentMethod: { type: String, default: "COD" },
    couponCode: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    discount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },

    subtotal: Number,
    shippingFee: Number,
    tax: Number,
    totalAmount: Number,

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    deliveredAt: { type: Date },

    cancelledItems: [
      {
        itemId: mongoose.Schema.Types.ObjectId,
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        image: String,
        quantity: Number,
        price: Number,
        total: Number,
        reason: String,
        cancelledAt: Date,
      },
    ],
    cancelReason: { type: String, default: "" },
    cancelledBy: { type: String, default: "" },
    cancelledAt: { type: Date },

    // ── FIX: returns is now an ARRAY of independent return batches.
    // Each item can only belong to ONE active batch at a time, but once
    // a batch is Rejected/Refunded, the customer can still start a NEW
    // batch for other (or even the same, if rejected) items — and old
    // batches are never overwritten, they just stay in this array.
    returns: [
      {
        items: [
          {
            itemId: mongoose.Schema.Types.ObjectId,
            productId: mongoose.Schema.Types.ObjectId,
            name: String,
            image: String,
            quantity: Number,
            price: Number,
            total: Number,
          },
        ],
        reason: { type: String, default: "" },
        description: { type: String, default: "" },
        images: [{ type: String }],
        status: {
          type: String,
          enum: ["Requested", "Approved", "Rejected", "Refunded"],
          default: "Requested",
        },
        pickupStatus: {
          type: String,
          enum: ["NotPicked", "PickupScheduled", "Picked", "InTransit", "Received"],
          default: "NotPicked",
        },
        refundStatus: {
          type: String,
          enum: ["None", "Pending", "Completed"],
          default: "None",
        },
        refundAmount: { type: Number, default: 0 },
        adminNote: { type: String, default: "" },
        timeline: [{ status: String, message: String, date: Date }],
        requestedAt: { type: Date, default: Date.now },
        completedAt: Date,
      },
    ],

    invoiceNumber: { type: String, unique: true },
    invoiceDate: Date,
    invoiceSent: { type: Boolean, default: false },
    invoiceGenerated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
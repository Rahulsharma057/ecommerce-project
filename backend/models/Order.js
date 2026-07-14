const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        image: String,

        price: Number,

        quantity: Number,

        color: String,

        size: String,

        sku: String,

        category: String,

        subCategory: String,

        brand: String,

        fabric: String,
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
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },
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

    // ── Online payment tracking (Razorpay) ──
    // For COD orders these all stay at their defaults and are simply
    // ignored — nothing else in the app needs to special-case COD here.
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "Partially Refunded"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paymentVerifiedAt: { type: Date },
    paidAmount: {
      type: Number,
      default: 0,
    },
    // "upi" | "card" | "netbanking" | "wallet" — whatever Razorpay reports
    // the payment was actually made with, for your own records/analytics.
    paymentChannel: { type: String, default: "" },

    deliveredAt: { type: Date },

    cancelledItems: [
      {
        itemId: mongoose.Schema.Types.ObjectId,
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        image: String,
        quantity: Number,
        price: Number,
        color: String,
        size: String,
        sku: String,
        category: String,
        subCategory: String,
        brand: String,
        fabric: String,
        reason: String,
        adminNote: String,
        cancelledBy: { type: String, enum: ["user", "admin"] },
        total: Number,
        cancelledAt: Date,
      },
    ],
    cancelReason: { type: String, default: "" },
    cancelledBy: { type: String, enum: ["user", "admin"], default: null },
    cancelledAt: { type: Date },
    adminCancelNote: { type: String, default: "" },

    returns: [
      {
        items: [
          {
            itemId: mongoose.Schema.Types.ObjectId,
            productId: mongoose.Schema.Types.ObjectId,
            name: String,
            image: String,
            price: Number,
            quantity: Number,
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
          enum: [
            "NotPicked",
            "PickupScheduled",
            "Picked",
            "InTransit",
            "Received",
          ],
          default: "NotPicked",
        },
        refundStatus: {
          type: String,
          enum: ["None", "Pending", "Completed"],
          default: "None",
        },

        itemsSubtotal: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        refundTax: { type: Boolean, default: true },
        refundAmount: { type: Number, default: 0 },

        adminNote: { type: String, default: "" },
        timeline: [{ status: String, message: String, date: Date }],
        requestedAt: { type: Date, default: Date.now },
        completedAt: Date,
      },
    ],
    refundedAmount: {
      type: Number,
      default: 0,
    },

    refundedAt: {
      type: Date,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    invoiceDate: Date,
    invoiceSent: { type: Boolean, default: false },
    invoiceGenerated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);

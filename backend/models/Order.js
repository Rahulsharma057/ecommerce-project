const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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
      default: "COD",
    },
  couponCode: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coupon",
},
    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: Number,

    status: {
  type: String,
  enum: [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    
  ],
  default: "Pending",
},
    cancelReason: {
      type: String,
      default: "",
    },


    cancelledBy: {
      type: String, // "user" | "admin"
      default: "",
    },

    cancelledAt: {
      type: Date,
    },
   returnReason: {
  type: String,
  default: "",
},
    returnDescription: {
  type: String,
  default: "",
},

returnImages: [
  {
    type: String,
  }
],
returnTimeline: [
  {
    status: String,
    message: String,
    date: Date,
  },
],
adminNote: {
  type: String,
  default: "",
},
 returnStatus: {
  type: String,
  enum: [
    "None",
    "Requested",
    "Approved",
    "Rejected",
    "Returned",
    "Refunded",
  ],
  default: "None",
},

returnPickupStatus: {
  type: String,
  enum: ["NotPicked", "Picked", "InTransit", "Received"],
  default: "NotPicked",
},

refundStatus: {
  type: String,
  enum: ["None", "Pending", "Completed"],
  default: "None",
},


returnRequestedAt: {
  type: Date,
},
returnCompletedAt: {
  type: Date,
},
invoiceNumber: {
  type: String,
  unique: true,
},

invoiceDate: Date,

invoiceSent: {
   type:Boolean,
   default:false
},
invoiceGenerated: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);

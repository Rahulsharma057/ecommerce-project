const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    // FIX: color/size were never stored, so whatever the customer picked
    // on the product page silently vanished the moment it hit the cart.
    color: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// A user can have the SAME product in cart multiple times only if the
// variant (color/size) differs — e.g. same shirt in "Red/M" and "Blue/L"
// should be two separate cart rows, not merged into one.
cartSchema.index({ userId: 1, productId: 1, color: 1, size: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
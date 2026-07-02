const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    reviews: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

numReviews: {
  type: Number,
  default: 0,
},

ratings: {
  type: Number,
  default: 0,
},

stock: {
  type: Number,
  required: true,
  default: 0,
},

    category: {
      type: String,
      required: true,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isSale: {
      type: Boolean,
      default: false,
    },

    images: [
      {
        type: String,
      },
    ],
      isFeatured: {
    type: Boolean,
    default: false,
  },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
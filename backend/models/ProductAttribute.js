const mongoose = require("mongoose");

// One collection for every admin-customizable dropdown/suggestion list
// used in the Add/Edit Product form — avoids making a separate model
// for each field.
const productAttributeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "category",
        "subCategory",
        "collection",
        "brand",
        "fabric",
        "fit",
        "pattern",
        "neckType",
        "sleeveType",
        "occasion",
        "careInstructions",
        "countryOfOrigin",
        "tags",
        "shippingClass",
      ],
    },
    value: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Same value can't be added twice under the same type
productAttributeSchema.index({ type: 1, value: 1 }, { unique: true });

module.exports = mongoose.model("ProductAttribute", productAttributeSchema);
const mongoose = require("mongoose");

// One stock entry per size+color combination. Optional — a product
// can be sold without variants too (flat stock field is always used then).
const variantSchema = new mongoose.Schema(
  {
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    // ── Identity ──
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, default: "Veloura", trim: true },
    sku: { type: String, unique: true, sparse: true, trim: true },
    barcode: { type: String, default: "", trim: true },

    // ── Categorization ──
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, default: "", trim: true },
    collection: { type: String, default: "", trim: true },
    tags: [{ type: String, trim: true }],
    searchKeywords: [{ type: String, trim: true }],

    // ── Pricing ──
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0 }, // auto-calculated, never set manually
    costPrice: { type: Number, default: 0, min: 0 }, // internal only, never sent to storefront
    taxPercent: { type: Number, default: 5, min: 0, max: 100 },

    // ── Inventory ──
    stock: { type: Number, required: true, default: 0, min: 0 },
    variants: [variantSchema],

    // ── Apparel details ──
    fabric: { type: String, default: "", trim: true },
    fit: { type: String, default: "", trim: true },
    pattern: { type: String, default: "", trim: true },
    neckType: { type: String, default: "", trim: true },
    sleeveType: { type: String, default: "", trim: true },
    occasion: { type: String, default: "", trim: true },
    careInstructions: { type: String, default: "", trim: true },
    countryOfOrigin: { type: String, default: "India", trim: true },
    colors: [{ type: String, trim: true }],
    sizes: [{ type: String, trim: true }],

    // ── Shipping ──
    weight: { type: Number, default: 0 }, // grams
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    shippingClass: { type: String, default: "Standard", trim: true },
    freeShipping: { type: Boolean, default: false },
    estimatedDeliveryDays: { type: Number, default: 5 },

    // ── Media ──
    images: [{ type: String }],
    frontImage: { type: String, default: "" },
    backImage: { type: String, default: "" },
    zoomImages: [{ type: String }],

    // ── Content ──
    description: { type: String, default: "" },

    // ── Flags ──
    isNewArrival: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Draft", "Active", "Archived"],
      default: "Draft",
    },

    // ── Reviews ──
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    numReviews: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },

    // ── Metrics ──
    soldCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },

    // ── SEO ──
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: [{ type: String }],

    // ── Audit ──
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Simple slug generator — no external package needed
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Keeps discount %, slug, and stock (when variants are used) always in sync.
// Runs on every .save() call.
productSchema.pre("save", async function () {
  // Discount auto-derived from price vs originalPrice
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
    this.isSale = true;
  } else {
    this.discount = 0;
  }

  // If variants exist, stock + colors + sizes always derive from them
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    this.colors = [...new Set(this.variants.map((v) => v.color).filter(Boolean))];
    this.sizes = [...new Set(this.variants.map((v) => v.size).filter(Boolean))];
  }

  // Auto-generate a unique slug when name changes or slug is missing
  if (this.isModified("name") || !this.slug) {
    const base = slugify(this.name);
    let candidate = base;
    let counter = 2;

    const Product = this.constructor;
    while (await Product.exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${base}-${counter}`;
      counter++;
    }
    this.slug = candidate;
  }

  // Auto-generate SKU if not provided
  if (!this.sku) {
    const catCode = (this.category || "GEN").slice(0, 3).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.sku = `VEL-${catCode}-${rand}`;
  }

  // no next() — just let the async function return
});
// Reduce stock for a specific variant (or flat stock if no variant match).
// Always keeps the parent `stock` total correct. Throws if not enough stock.
productSchema.statics.decrementStock = async function (productId, quantity, { color, size } = {}) {
  const product = await this.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product.variants?.length > 0 && (color || size)) {
    const variant = product.variants.find(
      (v) => (!color || v.color === color) && (!size || v.size === size)
    );
    if (variant) {
      if (variant.stock < quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      variant.stock -= quantity;
    }
  }

  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for ${product.name}`);
  }
  product.stock -= quantity;

  await product.save();
  return product;
};

// Add stock back (cancel/return flows)
productSchema.statics.restoreStock = async function (productId, quantity, { color, size } = {}) {
  const product = await this.findById(productId);
  if (!product) return null;

  if (product.variants?.length > 0 && (color || size)) {
    const variant = product.variants.find(
      (v) => (!color || v.color === color) && (!size || v.size === size)
    );
    if (variant) variant.stock += quantity;
  }

  product.stock += quantity;
  await product.save();
  return product;
};

module.exports = mongoose.model("Product", productSchema);
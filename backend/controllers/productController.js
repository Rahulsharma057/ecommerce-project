const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Accepts a real array, a JSON-stringified array, or a plain string —
// always returns a clean string[].
function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [value];
  } catch {
    return [value];
  }
}

function toBool(value) {
  return value === "true" || value === true;
}

// Builds every non-pricing, non-image field shared by add & update.
// Missing fields default to safe values so nothing crashes.
function buildProductFields(body) {
  return {
    brand: body.brand || "Veloura",
    subCategory: body.subCategory || "",
    collection: body.collection || "",
    tags: parseArrayField(body.tags),
    searchKeywords: parseArrayField(body.searchKeywords),
    costPrice: Number(body.costPrice) || 0,
    taxPercent: body.taxPercent !== undefined ? Number(body.taxPercent) : 5,
    barcode: body.barcode || "",
    fabric: body.fabric || "",
    fit: body.fit || "",
    pattern: body.pattern || "",
    neckType: body.neckType || "",
    sleeveType: body.sleeveType || "",
    occasion: body.occasion || "",
    careInstructions: body.careInstructions || "",
    countryOfOrigin: body.countryOfOrigin || "India",
    colors: parseArrayField(body.colors),
    sizes: parseArrayField(body.sizes),
    weight: Number(body.weight) || 0,
    dimensions: {
      length: Number(body.dimensionLength) || 0,
      width: Number(body.dimensionWidth) || 0,
      height: Number(body.dimensionHeight) || 0,
    },
    shippingClass: body.shippingClass || "Standard",
    freeShipping: toBool(body.freeShipping),
    estimatedDeliveryDays: Number(body.estimatedDeliveryDays) || 5,
    description: body.description || "",
    isNewArrival: toBool(body.isNewArrival),
    isFeatured: toBool(body.isFeatured),
    status: ["Draft", "Active", "Archived"].includes(body.status) ? body.status : "Draft",
    metaTitle: body.metaTitle || "",
    metaDescription: body.metaDescription || "",
    metaKeywords: parseArrayField(body.metaKeywords),
    ...(body.sku ? { sku: body.sku } : {}),
  };
}

function computePricing(body) {
  const price = Number(body.price) || 0;
  const originalPrice = Number(body.originalPrice) || 0;
  return { price, originalPrice };
}

function parseVariants(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── ADD PRODUCT ──
exports.addProduct = async (req, res) => {
  try {
    if (!req.body.name?.trim()) {
      return res.status(400).json({ error: "Product name is required" });
    }
    if (!req.body.category?.trim()) {
      return res.status(400).json({ error: "Category is required" });
    }

    let imageUrls = [];

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        imageUrls.push(result.secure_url);
      }
    }

    if (req.body.imageUrls) {
      imageUrls = imageUrls.concat(
        Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls]
      );
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ error: "At least one product image is required" });
    }

    const variants = parseVariants(req.body.variants);
    const pricing = computePricing(req.body);
    const extraFields = buildProductFields(req.body);

    const product = new Product({
      name: req.body.name.trim(),
      category: req.body.category.trim(),
      stock: variants.length ? 0 : Number(req.body.stock) || 0,
      variants,
      ...pricing,
      ...extraFields,
      images: imageUrls,
      frontImage: req.body.frontImage || imageUrls[0] || "",
      backImage: req.body.backImage || "",
      zoomImages: parseArrayField(req.body.zoomImages),
      createdBy: req.user?.id,
      updatedBy: req.user?.id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A product with this SKU already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ── GET ALL PRODUCTS (storefront + admin) ──
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = "", category = "", subCategory = "", type = "", status = "", admin,sort = "", } = req.query;

    let query = {};

    if (search) {
      const words = search.trim().split(" ").filter(Boolean);
      query.$and = words.map((word) => ({
        $or: [
          { name: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
          { subCategory: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } },
          { tags: { $regex: word, $options: "i" } },
        ],
      }));
    }

    if (category) query.category = { $regex: category, $options: "i" };
    if (subCategory) query.subCategory = { $regex: subCategory, $options: "i" };

    if (type === "new-arrivals") query.isNewArrival = true;
    if (type === "sale") query.isSale = true;

    // Storefront only ever sees Active products. Admin panel (passes ?admin=true)
    // can filter by any status, or see all statuses if none specified.
    if (admin) {
      if (status) query.status = status;
    } else {
      query.status = "Active";
    }
let sortOption = { createdAt: -1 };

switch (sort) {
  case "priceLow":
    sortOption = { price: 1 };
    break;

  case "priceHigh":
    sortOption = { price: -1 };
    break;

  case "name":
    sortOption = { name: 1 };
    break;

  default:
    sortOption = { createdAt: -1 };
}
    const products = await Product.find(query)
      .select("-costPrice")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({ products, totalPages: Math.ceil(total / limit), total, currentPage: page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── ATTRIBUTE OPTIONS (existing category/subCategory values in use) ──
exports.getCategoryOptions = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const subCategories = await Product.distinct("subCategory");
    res.json({
      categories: categories.filter(Boolean).sort(),
      subCategories: subCategories.filter(Boolean).sort(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE PRODUCT ──
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET SINGLE PRODUCT (storefront — by id or slug, hides cost price) ──
exports.getSingleProduct = async (req, res) => {
  try {
    const isId = mongoose.isValidObjectId(req.params.id);

    const product = await Product.findOne(
      isId ? { _id: req.params.id } : { slug: req.params.id }
    ).select("-costPrice");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

    // Fire-and-forget — don't let a slow write delay the response
    Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } }).catch(() => {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET SINGLE PRODUCT (admin — includes cost price) ──
exports.getSingleProductAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── UPDATE PRODUCT ──
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imageUrls = [];

    if (req.body.imageUrls) {
      imageUrls = Array.isArray(req.body.imageUrls) ? [...req.body.imageUrls] : [req.body.imageUrls];
    }

    if (req.files?.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );
        imageUrls.push(result.secure_url);
      }
    }

    imageUrls = [...new Set(imageUrls)];

    if (imageUrls.length === 0) {
      return res.status(400).json({ error: "At least one product image is required" });
    }

    const variants = req.body.variants ? parseVariants(req.body.variants) : product.variants;
    const pricing = computePricing(req.body);
    const extraFields = buildProductFields(req.body);

    product.set({
      name: req.body.name?.trim() || product.name,
      category: req.body.category?.trim() || product.category,
      stock: variants.length ? product.stock : Number(req.body.stock) || 0,
      variants,
      ...pricing,
      ...extraFields,
      images: imageUrls,
      updatedBy: req.user?.id,
    });

    // .save() (not findByIdAndUpdate) so the pre-save hook recalculates
    // discount/slug/stock-from-variants correctly.
    await product.save();
    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "A product with this SKU already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ── REVIEWS ──
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find((r) => r.userId.toString() === req.user.id);
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    product.reviews.push({ userId: req.user.id, name: user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.find((r) => r.userId.toString() === req.user.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.rating = Number(rating);
    review.comment = comment;
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.find((r) => r.userId.toString() === req.user.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    product.reviews = product.reviews.filter((r) => r.userId.toString() !== req.user.id);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0;

    await product.save();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── RELATED / FEATURED / NEW ARRIVALS ──
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const products = await Product.find({
      category: product.category,
      status: "Active",
      _id: { $ne: product._id },
    })
      .select("-costPrice")
      .limit(4);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isFeatured: true, status: "Active" };
    const products = await Product.find(query).select("-costPrice").skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Product.countDocuments(query);

    res.json({ products, total, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true, status: "Active" })
      .select("-costPrice")
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 20);

    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
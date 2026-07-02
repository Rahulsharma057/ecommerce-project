const Product = require("../models/Product");

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search = "", category = "", type = "" } = req.query;

    let query = {};

    // SEARCH
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // CATEGORY (case-insensitive)
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // TYPE FILTER
    if (type === "new") {
      query.isNewArrival = true;
    } else if (type === "sale") {
      query.isSale = true;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return res.json({
      products,
      totalPages: Math.ceil(total / limit),
      total,
      currentPage: page,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (r) =>
          r.userId.toString() ===
          req.user.id
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You already reviewed this product",
      });
    }

    const review = {
      userId: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.ratings =
      product.reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) /
      product.reviews.length;

    await product.save();

    res.json({
      message:
        "Review added successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const products = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json(products);
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isFeatured: true };

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,          // ⭐ MUST be array
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
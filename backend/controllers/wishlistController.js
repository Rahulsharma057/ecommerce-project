const Wishlist = require("../models/Wishlist");

// ADD
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.create({ userId, productId });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id }).populate("productId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
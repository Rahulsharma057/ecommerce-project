const ProductAttribute = require("../models/ProductAttribute");

// Returns every attribute type grouped together in one response —
// the Add Product form needs all lists at once.
exports.getAllAttributes = async (req, res) => {
  try {
    const all = await ProductAttribute.find().sort({ type: 1, value: 1 });

    const grouped = {};
    for (const item of all) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push({ _id: item._id, value: item.value });
    }

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAttribute = async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value?.trim()) {
      return res.status(400).json({ message: "Type and value are required" });
    }

    const existing = await ProductAttribute.findOne({ type, value: value.trim() });
    if (existing) {
      return res.status(400).json({ message: "This value already exists" });
    }

    const attr = await ProductAttribute.create({ type, value: value.trim() });
    res.status(201).json(attr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAttribute = async (req, res) => {
  try {
    const deleted = await ProductAttribute.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Attribute not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const CategoryHighlight = require("../models/CategoryHighlight");

exports.getCategories = async (req, res) => {
  try {
    const data = await CategoryHighlight.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getVisibleCategories = async (req, res) => {
  try {
    const data = await CategoryHighlight.find({
      isVisible: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const item = await CategoryHighlight.create(req.body);

    res.json({
      success: true,
      message: "Category Created Successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const item = await CategoryHighlight.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Category Updated Successfully",
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await CategoryHighlight.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.toggleVisibility = async (req, res) => {
  try {
    const item = await CategoryHighlight.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    item.isVisible = !item.isVisible;

    await item.save();

    res.json({
      success: true,
      message: "Visibility Updated",
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
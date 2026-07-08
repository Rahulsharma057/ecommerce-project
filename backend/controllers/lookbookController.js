const Lookbook = require("../models/Lookbook");

exports.getLookbook = async (req, res) => {
  try {
    const data = await Lookbook.find({ active: true }).sort({
      order: 1,
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

exports.createLookbook = async (req, res) => {
  try {
    const item = await Lookbook.create(req.body);

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateLookbook = async (req, res) => {
  try {
    const item = await Lookbook.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteLookbook = async (req, res) => {
  try {
    await Lookbook.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
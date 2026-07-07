const Press = require("../models/Press");


// CREATE PRESS ENQUIRY
exports.createPress = async (req, res) => {
  try {

    const press = await Press.create(req.body);

    res.status(201).json({
      success: true,
      message: "Press enquiry submitted successfully.",
      data: press,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// GET ALL PRESS ENQUIRIES (ADMIN)
exports.getAllPress = async (req, res) => {
  try {

    const data = await Press.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// GET SINGLE PRESS ENQUIRY
exports.getPressById = async (req, res) => {
  try {

    const press = await Press.findById(req.params.id);

    if (!press) {
      return res.status(404).json({
        success: false,
        message: "Press enquiry not found",
      });
    }

    res.json({
      success: true,
      data: press,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// UPDATE STATUS
exports.updatePressStatus = async (req, res) => {
  try {

    const press = await Press.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!press) {
      return res.status(404).json({
        success: false,
        message: "Press enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully.",
      data: press,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// DELETE
exports.deletePress = async (req, res) => {
  try {

    const press = await Press.findByIdAndDelete(req.params.id);

    if (!press) {
      return res.status(404).json({
        success: false,
        message: "Press enquiry not found",
      });
    }

    res.json({
      success: true,
      message: "Press enquiry deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
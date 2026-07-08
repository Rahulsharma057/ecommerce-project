const HomeCollection = require("../models/HomeCollection");
const cloudinary = require("../config/cloudinary");
// ==============================
// Get All Visible Collections (Frontend)
// ==============================
exports.getCollections = async (req, res) => {
  try {
    const data = await HomeCollection.find({
      visible: true,
    }).sort({ order: 1 });

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


// ==============================
// Get All Collections (Admin)
// ==============================
exports.getAdminCollections = async (req, res) => {
  try {
    const data = await HomeCollection.find().sort({
      order: 1,
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


// ==============================
// Create Collection
// ==============================
exports.createCollection = async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: "home-collections",
      });

      image = uploadResponse.secure_url;
    }

    const collection = await HomeCollection.create({
      title: req.body.title,
      description: req.body.description,
      searchKeyword: req.body.searchKeyword,
      visible: req.body.visible === "true" || req.body.visible === true,
      order: Number(req.body.order) || 1,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Collection Added Successfully",
      data: collection,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Collection
// ==============================
exports.updateCollection = async (req, res) => {
  try {
    const collection = await HomeCollection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection Not Found",
      });
    }

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: "home-collections",
      });

      collection.image = uploadResponse.secure_url;
    }

    collection.title = req.body.title ?? collection.title;
    collection.description =
      req.body.description ?? collection.description;
    collection.searchKeyword =
      req.body.searchKeyword ?? collection.searchKeyword;

    if (req.body.visible !== undefined) {
      collection.visible =
        req.body.visible === "true" || req.body.visible === true;
    }

    if (req.body.order !== undefined) {
      collection.order = Number(req.body.order);
    }

    await collection.save();

    res.json({
      success: true,
      message: "Collection Updated Successfully",
      data: collection,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Delete Collection
// ==============================
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await HomeCollection.findByIdAndDelete(
      req.params.id
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// Toggle Visibility
// ==============================
exports.toggleVisibility = async (req, res) => {
  try {
    const collection = await HomeCollection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection Not Found",
      });
    }

    collection.visible = !collection.visible;

    await collection.save();

    res.status(200).json({
      success: true,
      message: "Visibility Updated",
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
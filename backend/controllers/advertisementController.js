const fs = require("fs");
const path = require("path");

const Advertisement = require("../models/Advertisement");
const cloudinary = require("../config/cloudinary");
// ===============================
// CREATE
// ===============================

exports.createAdvertisement = async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: "advertisements",
      });

      image = uploadResponse.secure_url;
    }

    const advertisement = await Advertisement.create({
      title: req.body.title,
      subtitle: req.body.subtitle || "",
      description: req.body.description || "",
      discount: req.body.discount || "",
      buttonText: req.body.buttonText || "",
      buttonLink: req.body.buttonLink || "",
      status: req.body.status === "true" || req.body.status === true,
      image,
    });

    res.status(201).json({
      success: true,
      data: advertisement,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// GET ALL
// ===============================

exports.getAdvertisements = async (req, res) => {
  try {
    const data = await Advertisement.find().sort({
      createdAt: -1,
    });

    res.json({
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

// ===============================
// GET ACTIVE
// ===============================

exports.getActiveAdvertisements = async (req, res) => {
  try {
    const data = await Advertisement.find({
      status: true,
    }).sort({
      createdAt: -1,
    });

    res.json({
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

// ===============================
// GET SINGLE
// ===============================

exports.getAdvertisement = async (req, res) => {
  try {
    const data = await Advertisement.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,

        message: "Advertisement not found",
      });
    }

    res.json({
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

// ===============================
// UPDATE
// ===============================

exports.updateAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,

        message: "Advertisement not found",
      });
    }

    // IMAGE UPDATE

    if (req.file) {
      if (advertisement.image && advertisement.image.startsWith("/uploads")) {
        const oldImage = path.join(__dirname, "..", advertisement.image);

        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      //   advertisement.image = `/uploads/advertisements/${req.file.filename}`;
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.uploader.upload(base64, {
        folder: "advertisements",
      });

      advertisement.image = uploadResponse.secure_url;
    }

    advertisement.title = req.body.title ?? advertisement.title;

    advertisement.subtitle = req.body.subtitle ?? advertisement.subtitle;
    advertisement.description =
      req.body.description ?? advertisement.description;
    advertisement.discount = req.body.discount ?? advertisement.discount;

    advertisement.buttonText = req.body.buttonText ?? advertisement.buttonText;

    advertisement.buttonLink = req.body.buttonLink ?? advertisement.buttonLink;

    if (req.body.status !== undefined) {
      advertisement.status =
        req.body.status === "true" || req.body.status === true;
    }
    console.log(req.body);
    await advertisement.save();

    res.json({
      success: true,

      data: advertisement,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// DELETE
// ===============================

exports.deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,

        message: "Advertisement not found",
      });
    }

    if (advertisement.image && advertisement.image.startsWith("/uploads")) {
      const imagePath = path.join(__dirname, "..", advertisement.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Advertisement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,

      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

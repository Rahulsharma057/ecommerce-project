const FashionSection = require("../models/FashionSection");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../config/cloudinary");
// ==========================
// CREATE
// ==========================

exports.createFashionSection = async (req, res) => {
  try {
    const {
      category,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      order,
      visible,
    } = req.body;

    if (!category || !title) {
      return res.status(400).json({
        success: false,
        message: "Category and Title are required.",
      });
    }
let image = "";
let imagePublicId = "";

let video = "";
let videoPublicId = "";

    if (req.files?.image?.[0]) {
     const uploadedImage = await uploadToCloudinary(
  req.files.image[0],
  "image"
);

image = uploadedImage.secure_url;
 imagePublicId = uploadedImage.public_id;
    }

    if (req.files?.video?.[0]) {
  const uploadedVideo = await uploadToCloudinary(
  req.files.video[0],
  "video"
);

video = uploadedVideo.secure_url;
videoPublicId = uploadedVideo.public_id;
    }

const section = await FashionSection.create({
  category,
  title,
  subtitle,
  description,

  image,
  imagePublicId,

  video,
  videoPublicId,

  buttonText,
  buttonLink,
  order: Number(order) || 1,
  visible: visible === "true" || visible === true,
});

    return res.status(201).json({
      success: true,
      message: "Fashion section created successfully.",
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET ADMIN
// ==========================

exports.getAdminFashionSections = async (req, res) => {
  try {
    const data = await FashionSection.find().sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET FRONTEND
// ==========================

exports.getAllFashionSections = async (req, res) => {
  try {
    const data = await FashionSection.find({
      visible: true,
    }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// GET SINGLE
// ==========================

exports.getFashionSection = async (req, res) => {
  try {
    const data = await FashionSection.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Fashion section not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// UPDATE
// ==========================

exports.updateFashionSection = async (req, res) => {
  try {
    const {
      category,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      order,
      visible,
    } = req.body;

    const section = await FashionSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Fashion section not found.",
      });
    }

    // Upload New Image
 if (req.files?.image?.[0]) {

  if (section.imagePublicId) {
    await cloudinary.uploader.destroy(section.imagePublicId);
  }

  const uploadedImage = await uploadToCloudinary(
    req.files.image[0],
    "image"
  );

  section.image = uploadedImage.secure_url;
  section.imagePublicId = uploadedImage.public_id;
}
    // Upload New Video
if (req.files?.video?.[0]) {

  if (section.videoPublicId) {
    await cloudinary.uploader.destroy(
      section.videoPublicId,
      {
        resource_type: "video",
      }
    );
  }

  const uploadedVideo = await uploadToCloudinary(
    req.files.video[0],
    "video"
  );

  section.video = uploadedVideo.secure_url;
  section.videoPublicId = uploadedVideo.public_id;
}

    section.category = category || section.category;
    section.title = title || section.title;
    section.subtitle = subtitle || section.subtitle;
    section.description = description || section.description;
    section.buttonText = buttonText || section.buttonText;
    section.buttonLink = buttonLink || section.buttonLink;
    section.order = Number(order) || section.order;

    if (visible !== undefined) {
      section.visible =
        visible === true || visible === "true";
    }

    await section.save();

    return res.status(200).json({
      success: true,
      message: "Fashion section updated successfully.",
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================
// DELETE
// ==========================

exports.deleteFashionSection = async (req, res) => {
  try {
    const section = await FashionSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Fashion section not found.",
      });
    }
    if (section.imagePublicId) {
    await cloudinary.uploader.destroy(section.imagePublicId);
}

if (section.videoPublicId) {
    await cloudinary.uploader.destroy(
        section.videoPublicId,
        {
            resource_type: "video",
        }
    );
}

    await section.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Fashion section deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ==========================
// TOGGLE VISIBILITY
// ==========================

exports.toggleVisibility = async (req, res) => {
  try {
    const section = await FashionSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Fashion section not found.",
      });
    }

    section.visible = !section.visible;

    await section.save();

    return res.status(200).json({
      success: true,
      message: `Section ${
        section.visible ? "Enabled" : "Disabled"
      } Successfully.`,
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
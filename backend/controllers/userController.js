const User = require("../models/User");
const cloudinary = require("../config/cloudinary");


// ── Address validation ──
function validateAddress(body) {
  const errors = [];

  if (!body.fullName?.trim() || body.fullName.trim().length < 2) {
    errors.push("Full name is required");
  }

  if (!body.phone?.trim() || !/^[6-9]\d{9}$/.test(body.phone.trim())) {
    errors.push("Enter a valid 10-digit phone number");
  }

  if (!body.house?.trim()) {
    errors.push("House / Flat / Building is required");
  }

  if (!body.area?.trim()) {
    errors.push("Area / Street is required");
  }

  if (!body.city?.trim()) {
    errors.push("City is required");
  }

  if (!body.state?.trim()) {
    errors.push("State is required");
  }

  if (!body.pincode?.trim() || !/^\d{6}$/.test(body.pincode.trim())) {
    errors.push("Enter a valid 6-digit pincode");
  }

  if (body.type && !["Home", "Office", "Other"].includes(body.type)) {
    errors.push("Invalid address type");
  }

  return errors;
}

exports.getProfile = async (req, res) => {
  try {
    console.log("req.user =", req.user);

    const user = await User.findById(req.user.id).select("-password");

    console.log("user =", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dob, removeProfilePic } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updateData = {
      name,
      phone,
      gender,
      dob,
    };

    // Remove Profile Photo
    if (removeProfilePic === "true") {
      if (user.profilePicId) {
        await cloudinary.uploader.destroy(user.profilePicId);
      }

      updateData.profilePic = "";
      updateData.profilePicId = "";
    }

    // Upload New Profile Photo
    if (req.file) {
      // Delete old image if exists
      if (user.profilePicId) {
        await cloudinary.uploader.destroy(user.profilePicId);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile-images",
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      updateData.profilePic = result.secure_url;
      updateData.profilePicId = result.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAddresses = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json(user.addresses);
};

exports.addAddress = async (req, res) => {
  try {
    const errors = validateAddress(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If this is marked default, unset default on all existing addresses
    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    // First address ever added becomes default automatically
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const errors = validateAddress(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.addresses.id(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    address.deleteOne();

    await user.save();

    res.json({
      message: "Address deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const User = require("../models/User");
//const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendOtpEmail = require("../utils/sendOtpEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    await sendOtpEmail(email, otp);

    return res.json({
      message: "OTP sent to your email",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Account is blocked",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    console.log("BODY:", req.body);

    const query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    if (user.email) {
      await sendOtpEmail(user.email, otp);
    }

    res.json({
      message: "OTP sent successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  console.log("OTP:", otp);

  res.json({ message: "OTP Sent" });
}; */

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isVerified = true;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, phone, otp, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (
      !user ||
      !user.otp ||
      String(user.otp) !== String(otp) ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // hash new password
    user.password = await bcrypt.hash(password, 10);

    // clear OTP (IMPORTANT)
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

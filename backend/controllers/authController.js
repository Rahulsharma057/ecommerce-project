const User = require("../models/User");
//const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
  /*   if (!user.isPhoneVerified) {
      return res.status(400).json({
        message: "Please verify phone number",
      });
    } */

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User Registered",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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
  const { email, phone } = req.body;

  const user = await User.findOne({
    $or: [
      { email },
      { phone }
    ],
  });

  

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.otp = otp;
  user.otpExpire =
    Date.now() + 5 * 60 * 1000;

  await user.save();

  console.log("OTP:", otp);
console.log("OTP SENT:", otp);
console.log("USER IN DB:", user);
  res.json({
    message: "OTP Sent",
  });
};

exports.sendOtp = async (req, res) => {
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
};

exports.verifyOtp = async (
  req,
  res
) => {
  const {
    email,
    phone,
    otp,
  } = req.body;

  const user =
    await User.findOne({
      $or: [
        { email },
        { phone },
      ],
    });

 if (
  !user ||
  !user.otp ||
  String(user.otp) !== String(otp) ||
  user.otpExpire < Date.now()
) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  res.json({
    message: "OTP Verified",
  });
};

exports.resetPassword = async (
  req,
  res
) => {
  const {
    email,
    phone,
    otp,
    password,
  } = req.body;

  const user =
    await User.findOne({
      $or: [
        { email },
        { phone },
      ],
    });

 if (
  !user ||
  !user.otp ||
  String(user.otp) !== String(otp) ||
  user.otpExpire < Date.now()
) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  user.password =
    await bcrypt.hash(
      password,
      10
    );

  user.otp = undefined;
  user.otpExpire = undefined;

  await user.save();

  res.json({
    message:
      "Password Reset Successful",
  });
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

const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.role =
    user.role === "admin"
      ? "user"
      : "admin";

  await user.save();

  res.json({
    message: "Role updated",
    user,
  });
};

exports.blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.isBlocked = !user.isBlocked;

  await user.save();

  res.json({
    message: user.isBlocked
      ? "User Blocked"
      : "User Unblocked",
  });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    message: "User deleted",
  });
};




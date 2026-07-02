const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    console.log("req.user =", req.user);

    const user = await User.findById(
      req.user.id
    ).select("-password");

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
    const {
      name,
      phone,
      gender,
      dob,
      profilePic,
    } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          name,
          phone,
          gender,
          dob,
          profilePic,
        },
        {
          new: true,
        }
      ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAddresses = async (
  req,
  res
) => {
  const user = await User.findById(
    req.user.id
  );

  res.json(user.addresses);
};

exports.addAddress = async (
  req,
  res
) => {
  const user = await User.findById(
    req.user.id
  );

  user.addresses.push(req.body);

  await user.save();

  res.json(user.addresses);
};

exports.updateAddress = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    const address =
      user.addresses.id(
        req.params.id
      );

    if (!address) {
      return res.status(404).json({
        message:
          "Address not found",
      });
    }

    Object.assign(
      address,
      req.body
    );

    await user.save();

    res.json(address);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteAddress = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    const address =
      user.addresses.id(
        req.params.id
      );

    if (!address) {
      return res.status(404).json({
        message:
          "Address not found",
      });
    }

    address.deleteOne();

    await user.save();

    res.json({
      message:
        "Address deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


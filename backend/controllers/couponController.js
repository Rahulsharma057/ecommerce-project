const Coupon = require("../models/Coupon");

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({
    createdAt: -1,
  });

  res.json(coupons);
};

exports.getCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  res.json(coupon);
};

exports.updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.json(coupon);
};

exports.deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);

  res.json({
    message: "Coupon deleted",
  });
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(400).json({
        message: "Invalid coupon",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        message: "Coupon disabled",
      });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        message: "Coupon expired",
      });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order ₹${coupon.minOrderAmount}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (subtotal * coupon.discountValue) / 100;

      if (
        coupon.maxDiscount > 0 &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon,
      discount,
      finalTotal: subtotal - discount,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
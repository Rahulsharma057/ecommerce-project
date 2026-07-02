const router = require("express").Router();

const {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/couponController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCoupon
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getCoupons
);

router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getCoupon
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCoupon
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCoupon
);

router.post(
  "/apply",
  authMiddleware,
  applyCoupon
);

module.exports = router;
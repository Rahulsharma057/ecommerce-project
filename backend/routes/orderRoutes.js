const express = require("express");
const router = express.Router();
const uploadImage = require("../middleware/uploadImage");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrdersAdmin,
  getSingleOrderAdmin,
  updateOrderStatus,
  requestReturn,
  updateReturnStatus,
  updatePickupStatus,
  updateRefundStatus,
} = require("../controllers/orderController");

// ================= USER =================

router.post("/place", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/cancel/:id", authMiddleware, cancelOrder);
router.put(
  "/return/:id",
  authMiddleware,
  uploadImage.array("images", 5),
  requestReturn,
);

// ================= ADMIN =================
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrdersAdmin);

router.get("/admin/:id", authMiddleware, adminMiddleware, getSingleOrderAdmin);

router.put("/admin/:id", authMiddleware, adminMiddleware, updateOrderStatus);
router.put(
  "/admin/return/:id",
  authMiddleware,
  adminMiddleware,
  updateReturnStatus,
);

router.put(
  "/admin/return/pickup/:id",
  authMiddleware,
  adminMiddleware,
  updatePickupStatus,
);

router.put(
  "/admin/refund/:id",
  authMiddleware,
  adminMiddleware,
  updateRefundStatus,
);
module.exports = router;

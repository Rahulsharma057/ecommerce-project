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
  updateRefundStatus,verifyPaymentAndPlaceOrder,updatePaymentStatus
} = require("../controllers/orderController");

// ================= USER =================
router.post("/place", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/cancel/:id", authMiddleware, cancelOrder);
router.put("/return/:id", authMiddleware, uploadImage.array("images", 5), requestReturn);
/* router.post(
"/place-online",
authMiddleware,
verifyPaymentAndPlaceOrder
); */

// ================= ADMIN =================
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrdersAdmin);
router.put(
  "/admin/payment/:id",
authMiddleware, adminMiddleware,
  updatePaymentStatus
);
router.get("/admin/:id", authMiddleware, adminMiddleware, getSingleOrderAdmin);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateOrderStatus);

// FIX: returnId added — each return batch is updated independently now
router.put("/admin/return/:orderId/:returnId", authMiddleware, adminMiddleware, updateReturnStatus);
router.put("/admin/return/pickup/:orderId/:returnId", authMiddleware, adminMiddleware, updatePickupStatus);
router.put("/admin/refund/:orderId/:returnId", authMiddleware, adminMiddleware, updateRefundStatus);

module.exports = router;
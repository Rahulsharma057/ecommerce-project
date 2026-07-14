const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getPaymentSettings,
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed,updatePaymentSettings
} = require("../controllers/paymentController");

// Public — no login required, just tells the frontend whether online
// payment is available so it can decide whether to render the button.
router.get("/settings", getPaymentSettings);

router.post("/create", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.post("/failed", authMiddleware, markPaymentFailed);
router.put(
"/settings",
authMiddleware,
updatePaymentSettings
);
module.exports = router;

// Wire this up in your main app file, e.g.:
//   const paymentRoutes = require("./routes/paymentRoutes");
//   app.use("/api/payment", paymentRoutes);

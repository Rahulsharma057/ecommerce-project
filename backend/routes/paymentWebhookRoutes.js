const express = require("express");

const router = express.Router();

const { razorpayWebhook } = require("../controllers/paymentWebhookController");

// IMPORTANT
// webhook me json middleware nahi chalega

router.post(
  "/",
  express.raw({
    type: "application/json",
  }),
  razorpayWebhook,
);

module.exports = router;

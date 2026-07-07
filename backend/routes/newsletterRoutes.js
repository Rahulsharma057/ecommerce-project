const express = require("express");
const router = express.Router();

const {
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber,
} = require("../controllers/newsletterController");

// Subscribe
router.post("/subscribe", subscribeNewsletter);

// Admin - Get all subscribers
router.get("/", getAllSubscribers);

// Admin - Delete subscriber
router.delete("/:id", deleteSubscriber);

module.exports = router;
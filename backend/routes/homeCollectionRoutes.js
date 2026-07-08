const express = require("express");
const router = express.Router();

const uploadImage = require("../middleware/uploadImage");

const {
  getCollections,
  getAdminCollections,
  createCollection,
  updateCollection,
  deleteCollection,
  toggleVisibility,
} = require("../controllers/homeCollectionController");

// Frontend
router.get("/", getCollections);

// Admin
router.get("/admin", getAdminCollections);

// Create
router.post("/", uploadImage.single("image"), createCollection);

// Update
router.put("/:id", uploadImage.single("image"), updateCollection);

// Delete
router.delete("/:id", deleteCollection);

// Toggle
router.patch("/toggle/:id", toggleVisibility);

module.exports = router;

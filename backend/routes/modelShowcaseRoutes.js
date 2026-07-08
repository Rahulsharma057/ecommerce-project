const express = require("express");

const router = express.Router();

const uploadImage = require("../middleware/uploadImage");

const {
  getModels,

  getAdminModels,

  createModel,

  updateModel,

  deleteModel,

  toggleVisibility,
} = require("../controllers/modelShowcaseController");

// Frontend

router.get("/", getModels);

// Admin

router.get("/admin", getAdminModels);

// Create

router.post("/", uploadImage.single("image"), createModel);

// Update

router.put("/:id", uploadImage.single("image"), updateModel);

// Delete

router.delete("/:id", deleteModel);

// Toggle

router.patch("/toggle/:id", toggleVisibility);

module.exports = router;

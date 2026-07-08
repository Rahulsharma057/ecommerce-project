const express = require("express");
const router = express.Router();

const uploadImage = require("../middleware/uploadImage");

const {
  createAdvertisement,
  updateAdvertisement,
  getAdvertisements,
  getAdvertisement,
  deleteAdvertisement,
  getActiveAdvertisements,
} = require("../controllers/advertisementController");

// CREATE
router.post("/", uploadImage.single("image"), createAdvertisement);

// ACTIVE FOR USER HOME
router.get("/active", getActiveAdvertisements);

// ADMIN ALL DATA
router.get("/admin", getAdvertisements);

// SINGLE DATA
router.get("/:id", getAdvertisement);

// UPDATE
router.put("/:id", uploadImage.single("image"), updateAdvertisement);

// DELETE
router.delete("/:id", deleteAdvertisement);

module.exports = router;

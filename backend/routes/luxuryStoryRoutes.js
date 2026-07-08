const express = require("express");
const router = express.Router();

const uploadImage = require("../middleware/uploadImage");

const {
  getLuxuryStory,
  updateLuxuryStory,
  upload,deleteLuxuryStory,
toggleLuxuryStoryStatus
} = require("../controllers/luxuryStoryController");

router.get("/", getLuxuryStory);

// image + data update
router.put("/", uploadImage.single("image"), updateLuxuryStory);

// only image upload
router.post("/upload", uploadImage.single("image"), upload);
router.delete(
"/",
deleteLuxuryStory
);


// VISIBILITY

router.patch(
"/status",
toggleLuxuryStoryStatus
);
module.exports = router;

const express = require("express");

const router = express.Router();

const uploadImage = require("../middleware/uploadImage");
const uploadVideo = require("../middleware/uploadVideo");
const uploadMedia = require("../middleware/uploadMedia");
const controller = require("../controllers/fashionSectionController");

router.get("/", controller.getAllFashionSections);

router.get("/admin", controller.getAdminFashionSections);

router.get("/:id", controller.getFashionSection);

router.post(
  "/",
  uploadMedia.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  controller.createFashionSection
);

router.put(
  "/:id",
  uploadMedia.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  controller.updateFashionSection
);

router.delete("/:id", controller.deleteFashionSection);

router.patch(
  "/toggle/:id",
  controller.toggleVisibility
);

module.exports = router;
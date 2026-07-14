const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const attributeController = require("../controllers/attributeController");

router.get("/", attributeController.getAllAttributes);
router.post("/", authMiddleware, adminMiddleware, attributeController.addAttribute);
router.delete("/:id", authMiddleware, adminMiddleware, attributeController.deleteAttribute);

module.exports = router;
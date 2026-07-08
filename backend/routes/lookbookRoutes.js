const express = require("express");

const router = express.Router();

const controller = require("../controllers/lookbookController");

router.get("/", controller.getLookbook);

router.post("/", controller.createLookbook);

router.put("/:id", controller.updateLookbook);

router.delete("/:id", controller.deleteLookbook);

module.exports = router;
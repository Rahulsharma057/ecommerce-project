const express = require("express");

const router = express.Router();

const {
  createPress,
  getAllPress,
  getPressById,
  updatePressStatus,
  deletePress,
} = require("../controllers/pressController");


// PUBLIC
router.post("/", createPress);


// ADMIN
router.get("/admin", getAllPress);

router.get("/admin/:id", getPressById);

router.put("/admin/:id", updatePressStatus);

router.delete("/admin/:id", deletePress);


module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,

} = require("../controllers/userController");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  blockUser,
} = require("../controllers/userAdminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);

router.get("/admin/all", protect, admin, getAllUsers);
router.put("/admin/role/:id", protect, admin, updateUserRole);
router.put("/admin/block/:id", protect, admin, blockUser);
router.delete("/admin/:id", protect, admin, deleteUser);

module.exports = router;

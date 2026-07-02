const router = require("express").Router();

const {
  register,
  login,sendOtp,verifyOtp,
  forgotPassword,
  resetPassword,
  getUsers,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/users", getUsers);

module.exports = router;

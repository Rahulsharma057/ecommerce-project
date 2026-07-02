const router = require("express").Router();

const {
  validateCartStock,
  addToCart,
  getCart,
  removeFromCart,updateCart
} = require("../controllers/cartController");

const auth = require("../middleware/authMiddleware");

router.get("/validate-stock", auth, validateCartStock);
router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/:id", auth, removeFromCart);
router.put("/update/:id", auth, updateCart);

module.exports = router;
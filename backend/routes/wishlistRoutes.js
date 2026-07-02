const router = require("express").Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const auth = require("../middleware/authMiddleware");

router.post("/add", auth, addToWishlist);
router.get("/", auth, getWishlist);
router.delete("/:id", auth, removeFromWishlist);

module.exports = router;
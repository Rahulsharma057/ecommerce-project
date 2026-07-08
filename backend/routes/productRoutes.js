const router = require("express").Router();

const {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,createProductReview,getRelatedProducts,getFeaturedProducts,getNewArrivals
} = require("../controllers/productController");
console.log({
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getRelatedProducts,
  getFeaturedProducts,
});
const authMiddleware = require("../middleware/authMiddleware");
router.get("/featured", getFeaturedProducts);
router.post("/add", addProduct);
router.get("/", getProducts);
router.get("/related/:id", getRelatedProducts);
router.post(
  "/:id/review",
  authMiddleware,
  createProductReview
);
router.get(
  "/new-arrivals",
  getNewArrivals
);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

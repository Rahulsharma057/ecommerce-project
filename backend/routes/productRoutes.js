const router = require("express").Router();
const uploadImage = require("../middleware/uploadImage");
const {
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,createProductReview,getRelatedProducts,getFeaturedProducts,getNewArrivals,updateProductReview,  deleteProductReview
} = require("../controllers/productController");
/* console.log({
  addProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getRelatedProducts,
  getFeaturedProducts,
}); */
const authMiddleware = require("../middleware/authMiddleware");
router.get("/featured", getFeaturedProducts);
router.post(
  "/add",
  uploadImage.array("images",10),
  addProduct
);
router.get("/", getProducts);
router.get("/related/:id", getRelatedProducts);
router.post(
  "/:id/review",
  authMiddleware,
  createProductReview
);
router.put(
  "/:id/review",
  authMiddleware,
  updateProductReview
);

router.delete(
  "/:id/review",
  authMiddleware,
  deleteProductReview
);
router.get(
  "/new-arrivals",
  getNewArrivals
);
router.get("/:id", getSingleProduct);
router.put(
  "/:id",
  uploadImage.array("images",10),
  updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;

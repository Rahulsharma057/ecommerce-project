const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const productController = require("../controllers/productController");

// ================= PUBLIC =================
router.get("/", productController.getProducts);
router.get("/categories/options", productController.getCategoryOptions);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/:id/related", productController.getRelatedProducts);
router.get("/:id", productController.getSingleProduct);

// ================= REVIEWS (logged-in users) =================
router.post("/:id/review", authMiddleware, productController.createProductReview);
router.put("/:id/review", authMiddleware, productController.updateProductReview);
router.delete("/:id/review", authMiddleware, productController.deleteProductReview);

// ================= ADMIN =================
router.get("/admin/:id", authMiddleware, adminMiddleware, productController.getSingleProductAdmin);
router.post("/add", authMiddleware, adminMiddleware, upload.array("images", 8), productController.addProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 8), productController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
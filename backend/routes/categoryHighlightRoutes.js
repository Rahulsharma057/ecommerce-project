const express = require("express");

const router = express.Router();

const {
  getCategories,
  getVisibleCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleVisibility,
} = require("../controllers/categoryHighlightController");


// ---------- Frontend ----------

// Only Visible Categories
router.get("/", getVisibleCategories);


// ---------- Admin ----------

// Get All Categories
router.get("/admin", getCategories);

// Add Category
router.post("/", createCategory);

// Update Category
router.put("/:id", updateCategory);

// Delete Category
router.delete("/:id", deleteCategory);

// Toggle Visible
router.patch("/toggle/:id", toggleVisibility);

module.exports = router;
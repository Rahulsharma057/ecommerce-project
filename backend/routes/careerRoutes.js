const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/careerController");

// Apply Job (with resume upload)
router.post("/apply", upload.single("resume"), applyJob);

// Get All Applications
router.get("/applications", getApplications);

// Get Single Application
router.get("/application/:id", getApplicationById);

// Update Application
router.put("/application/:id", upload.single("resume"), updateApplication);

// Delete Application
router.delete("/application/:id", deleteApplication);

module.exports = router;
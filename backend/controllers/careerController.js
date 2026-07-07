const JobApplication = require("../models/JobApplication");
// APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const data = {
      ...req.body,
      resume: req.file ? req.file.filename : "",
    };

    const application = await JobApplication.create(data);

    return res.status(201).json({
      status: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// GET ALL APPLICATIONS (ADMIN)
exports.getApplications = async (req, res) => {
  try {
    const data = await JobApplication.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// GET SINGLE APPLICATION
exports.getApplicationById = async (req, res) => {
  try {
    const data = await JobApplication.findById(req.params.id);

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// UPDATE STATUS
exports.updateApplication = async (req, res) => {
  try {
    const data = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ status: true, data });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
  try {
    await JobApplication.findByIdAndDelete(req.params.id);

    res.json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
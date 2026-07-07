const Newsletter = require("../models/Newsletter");

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // validation
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    // email format
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email address",
      });
    }

    // already subscribed?
    const exists = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Email already subscribed",
      });
    }

    const subscriber = await Newsletter.create({
      email: email.toLowerCase(),
    });

    return res.status(201).json({
      status: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Get all subscribers (Admin)

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find()
      .sort({ createdAt: -1 });

    return res.json({
      status: true,
      total: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Delete subscriber

exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    await Newsletter.findByIdAndDelete(id);

    return res.json({
      status: true,
      message: "Subscriber deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
const mongoose = require("mongoose");

const pressSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    organization: String,
    message: String,
    status: {
      type: String,
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Press", pressSchema);
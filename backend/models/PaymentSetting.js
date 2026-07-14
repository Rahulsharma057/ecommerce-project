const mongoose = require("mongoose");

const PaymentSettingSchema = new mongoose.Schema(
  {
    cod: {
      enabled: {
        type: Boolean,
        default: true,
      },
    },

    razorpay: {
      enabled: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PaymentSetting",
  PaymentSettingSchema
);
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    house: String,
    area: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      default: "",
    },

    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBlocked: {
  type: Boolean,
  default: false,
},
isVerified: {
  type: Boolean,
  default: false,
},


    password: {
      type: String,
      required: true,
    },

    

    profilePic: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    dob: {
      type: Date,
    },
   otp: {
  type: String,
},

otpExpire: {
  type: Date,
},
    addresses: [
      {
        fullName: String,
        phone: String,
        pincode: String,
        state: String,
        city: String,
        house: String,
        area: String,
        landmark: String,

        type: {
          type: String,
          enum: ["Home", "Office", "Other"],
          default: "Home",
        },

     

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

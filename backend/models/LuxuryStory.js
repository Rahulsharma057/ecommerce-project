const mongoose = require("mongoose");

const luxuryStorySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
    },

    tagline: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    established: {
      type: String,
      default: "",
    },

    floatingTitle: {
      type: String,
      default: "",
    },

    floatingDescription: {
      type: String,
      default: "",
    },

    statOne: {
      number: String,
      title: String,
    },

    statTwo: {
      number: String,
      title: String,
    },

    statThree: {
      number: String,
      title: String,
    },
status:{
  type:Boolean,
  default:true
},
    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LuxuryStory",
  luxuryStorySchema
);
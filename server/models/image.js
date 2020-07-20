const { Schema, model } = require("mongoose");

const ImageSchema = new Schema(
  {
    imageName: {
      type: String,
      default: "none",
      required: true,
    },
    imageData: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Images", ImageSchema);

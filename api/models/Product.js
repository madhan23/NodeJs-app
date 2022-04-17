const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      id: { type: Number, unique: true, required: true },
      title: {
        type: String,
        required: true,
      },
      desc: { type: String, required: true },

      images: {
        type: String,
        required: true,
      },
      categories: {
        type: Array,
      },
      size: {
        type: Array,
      },
      color: {
        type: Array,
      },
      price: {
        type: Number,
        required: true,
      },

      instock: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  ),
  "products"
);

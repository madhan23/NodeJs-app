const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Cart",
  new mongoose.Schema(
    {
      userId: { type: String, required: true },
      products: [{ type: Array }],
    },
    {
      timestamps: true,
    }
  ),
  "cart"
);

const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Orders",
  new mongoose.Schema(
    {
      userId: { type: String, required: true },
      products: [{ type: Array }],
      amount: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        default: "PENDING",
      },
    },
    {
      timestamps: true,
    }
  ),
  "orders"
);

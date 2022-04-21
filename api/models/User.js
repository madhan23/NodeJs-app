const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Users",
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: { type: String, required: true, unique: true },
      password: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  ),
  "users"
);

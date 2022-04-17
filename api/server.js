const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api/auth/users", require("./routes/User"));
app.use("/api/products", require("./routes/Product"));
app.use("/api/cart", require("./routes/Product"));
app.use("/api/orders", require("./routes/Product"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server start running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

const express = require("express");
const morgan = require("morgan");
const app = express();
const CustomError = require("http-errors");
const logger = require("winston");
var cors = require("cors");
require("dotenv").config();
//DB Connection
require("./db")();

//Middlewares;
app.use(cors());
app.use(express.json());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}
app.use("/api/users", require("./routes/User"));
app.use("/api/products", require("./routes/Product"));
app.use("/api/cart", require("./routes/Cart"));
app.use("/api/orders", require("./routes/Order"));

app.use(async (req, res, next) => {
  next(CustomError(404, "Not Found"));
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500).json({
    errors: {
      dateTime: new Date(),
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`server start running on port ${PORT}`);
});

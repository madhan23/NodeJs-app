const mongoose = require("mongoose");
const logger = require("winston");
module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      logger.info("Connected to DB");
    })
    .catch((err) => logger.error(err));
};

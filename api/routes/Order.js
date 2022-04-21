const router = require("express").Router();
const Order = require("../models/Order");
const CustomError = require("http-errors");
const logger = require("winston");
const { authentication } = require("../middleware/user");

router.get("/", authentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching Order Details for userId :: ${userId}`);
    const orderDetails = await Order.findOne({ userId });
    if (!orderDetails) {
      throw CustomError(404, "No Order Details Found");
    }
    return res.status(200).json(orderDetails);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post("/", authentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const order = req.body;
    logger.info(`Creating Order Details for userId :: ${userId}`);
    const orderDetails = await new Order({
      ...order,
      userId,
      status: "CREATED",
    }).save();
    return res.status(201).json(orderDetails);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

module.exports = router;

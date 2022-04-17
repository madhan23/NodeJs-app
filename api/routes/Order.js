const router = require("express").Router();
const Order = require("../models/Order");
router.get("/", async (req, res) => {
  try {
    const cart = await Order.find();
    if (!cart) {
      return res.status(200).json("No Orders Available");
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(200).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const order = await new Order(req.body).save();
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json(error);
  }
});

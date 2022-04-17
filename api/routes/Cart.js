const router = require("express").Router();
const Cart = require("../models/Cart");
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.find();
    if (!cart) {
      return res.status(200).json("No cart Items Available");
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(200).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await new Cart(req.body).save();
    return res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json(error);
  }
});

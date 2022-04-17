const router = require("express").Router();
const Product = require("../models/Product");
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(200).json("No products Available");
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await new Product(req.body).save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;

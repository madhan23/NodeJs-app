const router = require("express").Router();
const Product = require("../models/Product");
const CustomError = require("http-errors");
const mongoose = require("mongoose");
const logger = require("winston");
const { authentication, authorization } = require("../middleware/user");

router.get("/", authentication, async (req, res, next) => {
  try {
    logger.info(`Fetching all product Details`);
    const products = await Product.find();
    if (products.length === 0) {
      throw CustomError(404, "No products Available");
    }
    return res.status(200).json(products);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.get("/:id", authentication, async (req, res, next) => {
  const productId = req.params.id;
  try {
    logger.info(`Fetching product Details for productId :: ${productId}`);
    const product = await Product.findOne({ id: productId });
    if (!product) {
      throw CustomError(404, "Product does not exist");
    }
    return res.status(200).json(product);
  } catch (error) {
    logger.error(error);
    if (error instanceof mongoose.CastError) {
      next(CustomError(400, "Invalid Product Id"));
    }
    next(error);
  }
});
router.post("/", authorization, async (req, res, next) => {
  try {
    logger.info(`Saving product Details into DB`);
    const product = await new Product(req.body).save();
    return res.status(201).json(product);
  } catch (error) {
    logger.error(error);
    if (error.name === "ValidationError") {
      next(CustomError(422, error.message));
    }
    next(error);
  }
});

router.put("/:id", authorization, async (req, res, next) => {
  const productId = req.params.id;
  try {
    logger.info(`Updating product Details for productId :: ${productId}`);
    const product = await Product.findOne({ id: productId });
    if (!product) {
      throw CustomError(404, "Product does not exist");
    }
    const response = await Product.findOneAndUpdate(
      { id: productId },
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    if (error instanceof mongoose.CastError) {
      next(CustomError(400, "Invalid Product Id"));
    }
    next(error);
  }
});

router.delete("/:id", authorization, async (req, res, next) => {
  const productId = req.params.id;
  try {
    logger.info(`Deleting product  for product ID :: ${productId}`);
    const product = await Product.deleteOne({ id: productId });
    if (!product) {
      throw CustomError(404, "Product does not exist");
    }
    return res.status(204).json("Product Deleted Successfully");
  } catch (error) {
    logger.error(error);
    if (error instanceof mongoose.CastError) {
      next(CustomError(400, "Invalid Product Id"));
    }
    next(error);
  }
});

module.exports = router;

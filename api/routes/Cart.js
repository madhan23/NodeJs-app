const router = require("express").Router();
const Cart = require("../models/Cart");
const CustomError = require("http-errors");
const logger = require("winston");
const { authentication } = require("../middleware/user");

router.get("/", authentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartResponse = await Cart.findOne({ userId });
    logger.info(`Fetching Cart Details for UserId :: ${userId}`);
    if (!cartResponse) {
      throw CustomError(404, "No Cart Details Found");
    }
    return res.status(200).json(cartResponse);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post("/", authentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = req.body;
    const price = calculateTotal(products);
    logger.info(`Adding Cart Details for UserId :: ${userId}`);
    const cartResponse = await Cart.findOne({ userId });
    if (!cartResponse) {
      const cart = await new Cart({
        userId,
        ...req.body,
        price: price,
      }).save();
      return res.status(201).json(cart);
    } else {
      logger.info(`Updating Cart Details for UserId :: ${userId}`);
      const cart = await Cart.findOneAndUpdate(
        { userId },
        {
          $set: { price: price, ...req.body },
        },
        {
          new: true,
        }
      );

      return res.status(200).json(cart);
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.delete("/:productId", authentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pid = req.params.productId;
    logger.info(`Deleting product ID ${pid} for UserId :: ${userId}`);
    let cart = await Cart.findOne({
      $and: [{ userId }, { "products.id": pid }],
    });
    if (!cart) {
      throw CustomError(404, "No Product Details Found");
    }
    cart = {
      ...cart,
      products: cart.products.filter((product) => product.id !== pid),
    };
    const price = calculateTotal(cart);
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: { price: price, products: cart.products },
      }
    );
    return res.status(204).json("Product Removed Successfully ");
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

const calculateTotal = ({ products }) => {
  return products.reduce(
    (acc, { discount, price, quantity }) => {
      acc.amount = acc.amount + (price * quantity - discount);
      return acc;
    },
    {
      amount: 0,
      currency: "INR",
    }
  );
};
module.exports = router;

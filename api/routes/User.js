const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const CustomError = require("http-errors");
const { validate } = require("../middleware/user");
const logger = require("winston");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}, { username: 1, email: 1, isAdmin: 1 });
    if (!users) {
      throw CustomError(404, "No Users Details Found");
    }
    logger.info(`Fetched all Users Details from DB`);
    return res.status(200).json(users);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});
router.post("/signup", validate, async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const dbUser = await User.findOne({ email: email });
    const dbUsername = await User.findOne({ username: username });
    if (dbUser !== null) {
      throw CustomError(400, "email ID already in use");
    }
    if (dbUsername !== null) {
      throw CustomError(400, "username already in use");
    }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY),
      isAdmin: req.body.isAdmin,
    });

    await newUser.save();
    logger.info(`Saved User Details into DB`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(error);
    next(error);
  }
});
router.post("/login", validate, async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw CustomError(401, "emailId does not exists");
    }
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );

    const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password)
      throw CustomError(401, "Invalid Credentials");

    //   removing password field value from User Object
    const { password, ...userDetails } = user._doc;
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },

      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    logger.info(`Logged In Successfully`);
    res.status(200).json({ userDetails, accessToken });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});
module.exports = router;

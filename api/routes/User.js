const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  //validation
  console.log(req.body);
  const user = await User.findOne({ email: email });
  console.log(user);
  if (user) {
    if (email === user.email)
      return res.status(400).json("email ID already in use");
    if (username === user.username)
      return res.status(400).json("username  already in use");
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY),
    isAdmin: req.body.isAdmin,
  });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    //const user = await User.findOne().or([{username: req.body},{}]);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Invalid email");
    }
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );

    const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password)
      return res.status(401).json("Invalid Credentials");

    //   removing password filed value from user object
    const { password, ...userDetails } = user._doc;
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },

      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.status(200).json({ userDetails, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json("Oops something error occurred");
  }
});
module.exports = router;

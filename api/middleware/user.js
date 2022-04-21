const jwt = require("jsonwebtoken");
const ErrorMsg = require("http-errors");

const authentication = (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (accessToken) {
    const token = accessToken.split(" ");
    jwt.verify(token[1], process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        throw ErrorMsg(401, "JSON Token is Invalid or Expired");
      }
      req.user = user;
      next();
    });
  } else {
    throw ErrorMsg(400, "Missing Authoriztion Header");
  }
};

const authorization = (req, res, next) => {
  authentication(req, res, () => {
    if (req.user.isAdmin) {
      next();
      return;
    }
    throw ErrorMsg(403, "You are not Authorized");
  });
};

const validate = (req, res, next) => {
  const user = req.body;
  Object.keys(user).forEach((key) => {
    if (user[key] === null || user[key] === "") {
      throw ErrorMsg(400, `${key} should be null or empty`);
    }
    if (key === "email") {
      const EMAIL_REGREX =
        /^(([^<>()[\]\\.,;*&%:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!EMAIL_REGREX.test(user[key])) {
        throw ErrorMsg(400, `Invalid ${key} field value`);
      }
    }
  });
  next();
};
module.exports = { authentication, authorization, validate };

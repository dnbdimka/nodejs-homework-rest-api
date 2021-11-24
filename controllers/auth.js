const service = require("../service/model/auth.js");
const jwt = require("jsonwebtoken");
// const path = require("path");
// const fs = require("fs").promises;
// const multer = require("multer");
const {
  schemaSignUp,
  schemaSignIn,
  // schemaUpdateSubscription,
} = require("../service/schemasJoi/users");

require("dotenv").config();

const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const validationResult = schemaSignUp.validate(req.body);

  if (validationResult.error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: validationResult.error.details[0].message,
    });
    return;
  }

  const user = await service.findUser(email);
  if (user) {
    return res.status(409).json({
      status: "fail",
      code: 409,
      message: "Email in use",
    });
  }

  try {
    const newUser = await service.createUser(username, email, password);

    res.status(201).json({
      status: "success",
      code: 201,
      user: { email, subscription: newUser.subscription },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const validationResult = schemaSignIn.validate(req.body);

  if (validationResult.error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationResult.error.details[0].message,
    });
  }

  const user = await service.findUser(email);

  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "fail",
      code: 401,
      message: "Email or password is wrong",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await service.updateToken(user.id, token);
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: { email, subscription: user.subscription },
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  try {
    await service.updateToken(id, null);
    return res.status(200).json({
      status: "success",
      code: 200,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};

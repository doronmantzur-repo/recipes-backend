const authModel = require("../models/authModel.js");
require("dotenv").config();

const jwt = require("jsonwebtoken");

async function login(req, res, next) {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      throw { status: 400, message: "email or password missing" };
    }

    const user = await authModel.login(email, password);

    if (!user) {
      throw { status: 401, message: "invalid email or password" };
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
    //json is like send function
    res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    console.log(req.body);
    const { user_name, email, password, first_name, last_name } = req.body;

    if (!email || !password) {
      throw { status: 400, message: "email or password missing" };
    }

    const user = await authModel.register({ user_name, email, password, first_name, last_name: last_name });
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function profile(req, res, next) {
  try {
    const user = await authModel.getProfile(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, profile };

const express = require("express");
const { login, register, profile } = require("../controllers/authController");
const {authenticate} = require("../middlewares/authenticate.js");

const router = express.Router();

router.post("/login", login);
router.get("/profile", authenticate, profile);
router.post("/register", register);

module.exports = router;

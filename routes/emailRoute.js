const express = require("express");

const emailController = require("../controllers/emailController.js");

const router = express.Router();

router.post("/send", emailController.sendEmail);

module.exports = router;

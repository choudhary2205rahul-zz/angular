const express = require('express');
const {signUp, login} = require("../service/user.service");

const router = express.Router();

// SIGNUP
router.post("/signup", signUp);

// LOGIN
router.post('/login', login);

module.exports = router;
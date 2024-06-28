const User = require('../models/user');
const express = require('express');
const router = express.Router();
const createTokenForUser = require('../helpers/createToken');

router.post('/register', async function(req, res, next) {
  try {
    const { username, password, first_name, last_name, email, phone } = req.body;
    let user = await User.register({ username, password, first_name, last_name, email, phone });
    const token = createTokenForUser(username, user.admin);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body;
    let user = await User.authenticate(username, password);
    const token = createTokenForUser(username, user.admin);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helper/validation_schema');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authSchema.validateAsync(req.body);
    console.log(result);

    if (!email || !password) {
      throw createError.BadRequest();
    }
    const doseExist = await User.findOne({ email: email });
    if (doseExist) {
      throw createError.Conflict(`${email} is already registered`);
    }
    const user = new User({ email, password });
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    if (error.isJoi) {
      error.status = 422;
    }
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  res.send('login Router');
});

router.post('/refresh-token', (req, res, next) => {
  res.send('refresh-token Router');
});

router.delete('/logout', (req, res, next) => {
  res.send('logout Router');
});

module.exports = router;

const createError = require('http-errors');
const User = require('../Models/User.model');
const { authSchema } = require('../helper/validation_schema');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helper/jwt_helper');
const client = require('../helper/init_redis');

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      if (!result.email || !result.password) {
        throw createError.BadRequest();
      }
      const doseExist = await User.findOne({ email: result.email });
      if (doseExist) {
        throw createError.Conflict(`${result.email} is already registered`);
      }
      const user = new User(result);
      const savedUser = await user.save();

      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 422;
      }
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });

      if (!user) {
        throw createError.NotFound('This User is not Registered');
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) {
        throw createError.Unauthorized('Email/Password not Valid');
      }

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        return next(createError.BadRequest('Invalid Email/Password'));
      }
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }
      const userId = await verifyRefreshToken(refreshToken);
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
};

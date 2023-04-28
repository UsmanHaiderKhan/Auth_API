const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
require('./helper/init_mongodb');
const AuthRoute = require('./Routes/Auth.route');
const { verifyAccessToken } = require('./helper/jwt_helper');
require('./helper/init_redis');
// client.SET('foo', 'bar');
// client.GET('foo', (err, value) => {
//   if (err) {
//     console.log(err.message);
//   }
//   console.log(value);
// });

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', verifyAccessToken, async (req, res, next) => {
  //   console.log(req.headers['authorization']);
  res.send('Hello from express');
});
app.use('/auth', AuthRoute);
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
  next(createError.NotFound());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running port : ${PORT}`);
});

const express = require('express');
const morgan = require('morgan');
const createError= require('http-errors');
require('dotenv').config();
require('./helper/init_mongodb');
const AuthRoute = require('./Routes/Auth.route');

const app = express();

app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
    res.send("Hello from express"); 
});
app.use('/auth', AuthRoute);
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((err, req, res, next)=>{
//    res.status(err.status || 500);
//    res.send({
//     error:{
//     status: err.status || 500,
//     message: err.message
//     }
//    });
      next(createError.NotFound())
});


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
   console.log(`Server is running port : ${PORT}`);
});

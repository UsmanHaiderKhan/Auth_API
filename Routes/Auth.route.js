const express = require('express');
const router = express.Router();

router.post('/register', (req,res,next)=>{
     res.send('register Router');
});

router.post('/login', (req,res,next)=>{
    res.send('login Router');
});

router.post('/refresh-token', (req,res,next)=>{
    res.send('refresh-token Router');
});

router.delete('/logout', (req,res,next)=>{
    res.send('logout Router');
});



module.exports = router;
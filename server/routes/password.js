const express = require('express');
const route = express.Router();
const { forgotPassword } = require('../controllers/user');


route.post('/forgotpassword', forgotPassword);

module.exports = route; 
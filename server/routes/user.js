const express = require('express');
const route = express.Router();
const { signup, login } = require('../controllers/user');




route.post('/signup', signup);
route.post('/login', login);


module.exports = route; 
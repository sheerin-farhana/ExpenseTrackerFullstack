const express = require('express');
const route = express.Router();

const { authenticate: userAuthentication } = require('../middleware/auth');
const { insertExpense,getExpenses,deleteExpense} = require('../controllers/expense');

 
route.get('/getExpense',userAuthentication,getExpenses);
route.post('/insertExpense',userAuthentication ,insertExpense);
route.post('/deleteExpense/:id', userAuthentication,deleteExpense);

module.exports = route;

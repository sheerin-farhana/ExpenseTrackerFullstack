const express = require('express');
const route = express.Router();

const { insertExpense,getExpenses,deleteExpense} = require('../controllers/expense');


route.get('/getExpense',getExpenses);
route.post('/insertExpense', insertExpense);
route.post('/deleteExpense/:id', deleteExpense);

module.exports = route;

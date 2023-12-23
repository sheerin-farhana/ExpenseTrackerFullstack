const express = require('express');
const route = express.Router();

const { authenticate: userAuthentication } = require('../middleware/auth');
const { insertExpense,getExpenses,deleteExpense,downloadExpense,getDownloadedExpenses} = require('../controllers/expense');

route.get('/download',userAuthentication,downloadExpense); 
route.get('/getExpense',userAuthentication,getExpenses);
route.post('/insertExpense',userAuthentication ,insertExpense);
route.post('/deleteExpense/:id', userAuthentication, deleteExpense);
route.get('/filesdownloaded',userAuthentication,getDownloadedExpenses)

module.exports = route;

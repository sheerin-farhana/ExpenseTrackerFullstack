const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Expense = sequelize.define('Expense', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    ExpenseAmt: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    Category: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    Description: {
        type: Sequelize.TEXT,
        allowNull:false,
    },
});




module.exports = { Expense };
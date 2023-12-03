const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Paymentid: Sequelize.STRING,
    Orderid: Sequelize.STRING,
    Status: Sequelize.STRING
});



module.exports = { Order };
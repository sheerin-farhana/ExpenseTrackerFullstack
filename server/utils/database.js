const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config()

const sequelize = new Sequelize('expensetrackerdb', 'root', process.env.PASSWORD, {
    dialect: 'mysql',
    host:'localhost'
});


module.exports = sequelize;
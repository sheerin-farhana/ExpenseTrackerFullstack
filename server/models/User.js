const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    Name: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    Email: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    Phone: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    Password: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    Ispremiumuser: Sequelize.BOOLEAN,
});




module.exports = { User };
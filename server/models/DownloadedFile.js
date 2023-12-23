const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const DownloadedFile = sequelize.define('DownloadedFiles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    },
    fileURL: {
        type: Sequelize.STRING,
    },

});




module.exports = { DownloadedFile };
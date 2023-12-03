// /premium/showLeaderboard

const express = require('express');
const route = express.Router();


const { showLeaderboard } = require('../controllers/premium');

route.get('/showLeaderboard', showLeaderboard);

module.exports = route;
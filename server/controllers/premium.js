const { User } = require('../models/User');
const { Expense } = require('../models/Expense');
const sequelize = require('../utils/database');
const e = require('cors');


const showLeaderboard = async (req, res, next) =>  {
    try {
        const users =await User.findAll();
        const expenses = await Expense.findAll();
        const userExpenses = {};
         

        expenses.forEach(expense => {
            const userId = expense.UserId;
            const expenseAmt = Number(expense.ExpenseAmt);

            if (userExpenses[userId]) {
                userExpenses[userId] += expenseAmt;
            } else {
                userExpenses[userId] = expenseAmt;
            }
        });

        console.log(userExpenses);

        var userLeaderboardDetails = [];

        users.forEach((user) => {
            userLeaderboardDetails.push({ name: user.Name, totalCost: userExpenses[user.id] || 0});
        })

        // console.log(userLeaderboardDetails);
        userLeaderboardDetails.sort((a, b) => b.totalCost - a.totalCost);

        res.status(200).json(userLeaderboardDetails);
    }
    catch (err) {
        console.log(err);
    }
}



module.exports = { showLeaderboard };
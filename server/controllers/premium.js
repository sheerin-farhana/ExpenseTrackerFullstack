const { User } = require('../models/User');
const { Expense } = require('../models/Expense');
const sequelize = require('../utils/database');
const e = require('cors');


const showLeaderboard = async (req, res, next) =>  {
    try {
        const userAndExpenses = await User.findAll({
            attributes: ['id', 'Name', [sequelize.fn('sum', sequelize.col('expenses.ExpenseAmt')), 'totalCost']],
            include: [
                {
                    model: Expense,
                    attributes:[]
                }
            ],
            group: ['users.id', 'users.Name'],
            order: [["totalCost","Desc"]]
           
        });
        // const userExpenses = await Expense.findAll({
        //     attributes: ['UserId', [sequelize.fn('sum', sequelize.col('ExpenseAmt')), 'totalCost']],
        //     group: ['UserId'],
        // });
        // console.log(userAndExpenses);
        res.status(200).json(userAndExpenses);
        // console.log(userLeaderboardDetails);
    }
    catch (err) {
        console.log(err);
    }
}



module.exports = { showLeaderboard };
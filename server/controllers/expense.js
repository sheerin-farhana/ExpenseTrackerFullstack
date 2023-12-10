const { Expense } = require('../models/Expense');

const { User } = require('../models/User');
const sequelize = require('../utils/database');

const insertExpense = async (req, res, next) => {
    const transaction =await sequelize.transaction();
    const { amount, category, description } = req.body;
    

    try {
        const expense = await Expense.create({
            ExpenseAmt: amount,
            Category: category,
            Description: description,
            UserId: req.user.id,
        },
            {
            transaction:transaction
        });
        

        const user = await User.findOne({
            where: { id: req.user.id },
            transaction:transaction,
        });

        if (user) {
            const newTotalExpenses = (parseFloat(user.TotalExpenses) || 0) + parseFloat(amount);
            await user.update({ TotalExpenses: newTotalExpenses },{transaction:transaction});
        }
        await transaction.commit();
        res.status(200).json({ success: true, data:expense.dataValues});
    }
     catch (err) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log(err);
    }
}

const getExpenses = async (req, res, next) => {

    try {
        const expenses = await Expense.findAll({where : {UserId : req.user.id}});
        res.status(200).json({ success: true, expense: expenses }); 
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log(err);
    }
}

const deleteExpense = async (req, res, next) => {
    const { id } = req.params;
    const transaction =await sequelize.transaction();

    try {
        const expense = await Expense.findOne({
            where: {
                id: id,
                UserId:req.user.id,
            }
        });

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        const user = await User.findOne({
            where: { id: req.user.id },
            transaction:transaction,
        });

        console.log("The User",user);

        if (user) {
            const expenseAmt = !isNaN(parseFloat(expense.ExpenseAmt)) ? parseFloat(expense.ExpenseAmt) : 0;
            const newTotalExpenses = user.TotalExpenses - expenseAmt;
            console.log(expenseAmt, "EXPENSE AMOUNT ");
            console.log(user.TotalExpenses,"TotalExpense ");
            
            await user.update({ TotalExpenses: newTotalExpenses },{transaction:transaction});
        } 

        await expense.destroy();

        await transaction.commit();
        res.status(200).json({ success: true, message: "Expense is deleted" });

    }
    catch (err) {
        await transaction.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = { insertExpense, getExpenses,deleteExpense };
const { Expense } = require('../models/Expense');

const {User } = require('../models/User');


const insertExpense = async (req, res, next) => {
    const { amount, category, description } = req.body;
    

    try {
        const expense = await Expense.create({
            ExpenseAmt: amount,
            Category: category,
            Description: description,
            UserId: req.user.id,
        });
        

        const user = await User.findOne({
            where: { id: req.user.id },
        });

        if (user) {
            const newTotalExpenses = (parseFloat(user.TotalExpenses) || 0) + parseFloat(amount);
            await user.update({ TotalExpenses: newTotalExpenses });
        }
        res.status(200).json({ success: true, data:expense.dataValues});
    }
    catch (err) {
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

        await expense.destroy();

        res.status(200).json({ success: true, message: "Expense is deleted" });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = { insertExpense, getExpenses,deleteExpense };
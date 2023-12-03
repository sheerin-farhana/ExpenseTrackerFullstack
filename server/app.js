const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./utils/database');

const {User} = require('./models/User');
const { Expense } = require('./models/Expense');
const { Order } = require('./models/Order');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        app.listen(process.env.PORT);
        console.log("app is running");
    })
    .catch(err => console.log(err));
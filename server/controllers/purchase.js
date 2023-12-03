const dotenv = require('dotenv');
dotenv.config();
const Razorpay = require('razorpay');
const { Order } = require('../models/Order');


const purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {

            if (err) {
                console.error('Error creating Razorpay order:', err);
                return res.status(500).json({ success: false, message: 'Error creating order' });
            }

            req.user.createOrder({ Orderid: order.id, Status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err });
    }
}



const updateTransactionStatus = async (req, res) => {

    try {
        const { payment_id, order_id } = req.body;

        const order = await Order.findOne({ where: { Orderid: order_id } });

        if (payment_id == null) {

            await order.update({ Paymentid: payment_id, Status: 'FAILED' });
            return res.status(202).json({ success: false, message: "Payment failed" });
        }
            const promise1 = order.update({ Paymentid: payment_id, Status: 'SUCCESSFUL' });
 
            const promise2 = req.user.update({ Ispremiumuser: true });
            
            Promise.all([promise1, promise2]).then(() => {
                return res.status(202).json({ success: true, message: " transaction successful" });
            }).catch(err => {
                throw new Error(err);
            });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = { purchasePremium,updateTransactionStatus };
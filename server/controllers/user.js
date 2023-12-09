const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();





const signup = async (req, res, next) => {
    const { name, email, phone, password } = req.body;

    try {

        //Check if the email already exists
        const existingUser = await User.findOne({
            where: {
                Email: email,
            }
        });

        if (existingUser) {
            //throw error , if email exixts
            res.status(403).json({ data: true });
            return;
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            // create new user if email is unique
            const newUserData = await User.create({
                "Name": name,
                "Email": email,
                "Phone": phone,
                "Password": hash,
            });
            res.status(200).json({ data: newUserData.dataValues });
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

function generateAccessToken(id,name) {
    return jwt.sign({ userId: id ,name:name}, process.env.TOKEN);
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (isStringValid(email) || isStringValid(password)) {
        return res.status(400).json({ success: false, message: 'Email or password is missing' });
    }

    try {
        const user = await User.findOne({
            where: {
                Email: email,
            }
        });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.Password);

            if (isMatch) {
                res.status(200).json({ success: true, message: "User login successful" ,token:generateAccessToken(user.id,user.Name),isPremiumUser:user.Ispremiumuser});
            } else {
                res.status(400).json({ success: false, message: "Password  does not match" });
            }
        }
        else {
            res.status(404).json({ success: false, message: "Emaild does not exist" });
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

function isStringValid(data) {
    if (data == undefined || data.length === 0) {
        return true;
    }
    else {
        return false;
    }
}


const forgotPassword =async (req, res, next) => {
    try {
        const { email } = req.body;
        
            const sender = {
                email: 'sheerinfarhana25@gmail.com',
                name: 'From Expense tracker app'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            
        const mailresponse = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Reset Your password",
            htmlContent: `<h3>You forgot password</h3>`
        });
        console.log("email sent");
            res.status(200).json({ message: 'Password reset email sent' });
        
    
    
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Interenal Server Error' });
    }
}





module.exports = { signup, login , forgotPassword };
const { User } = require('../models/User');



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
            // create new user if email is unique
        const newUserData = await User.create({
            "Name": name,
            "Email": email,
            "Phone": phone,
            "Password": password,
        });
        res.status(200).json({ data:newUserData.dataValues });
        

        
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

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
            const isMatch = password === user.Password;

            if (isMatch) {
                res.status(200).json({ success: true, message: "User login successful" });
            } else {
                res.status(200).json({ success: false, message: "User  not authorized" });
            }
        }
        else {
            res.status(404).json({ success: false, message: "User not found" });
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

module.exports = { signup,login };
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

module.exports = { signup };
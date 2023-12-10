const uuid = require('uuid');
const sgmail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');


const { User } = require('../models/User');
const { ForgotPassword } = require('../models/ForgotPassword');

// const forgotpassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({
//             where: {
//                 Email: email
//             }
//         });

//         if (user) {
//             const id = uuid.v4;
//             await ForgotPassword.create({
//                 id,
//                 UserId: user.id,
//                 active: true,
//             });

//             sgmail.setApiKey(process.env.SENDGRID_API_KEY)
//             const msg = {
//                 to: email, // Change to your recipient
//                 from: 'sheerinfarhana25@gmail.com', // Change to your verified sender
//                 subject: 'Sending with SendGrid is Fun',
//                 text: 'and easy to do anywhere, even with Node.js',
//                 html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
//             }
//             sgMail
//                 .send(msg)
//                 .then((response) => {
//                     console.log('Email sent')
//                     return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})
                    
//                 })
//                 .catch((error) => {
//                     console.error(error)
//                     throw new Error(error);
//                 })

//         }
//         else {
//             throw new Error('User doesnt exist')
//         }
//     }
//     catch (err) {
//         console.error(err)
//         return res.json({ message: err, sucess: false });
//     }
// }

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: {
                Email: email
            }
        });

        if (user) {
            const id = uuid.v4(); // Corrected line: Call the function to get the UUID string
            await ForgotPassword.create({
                id,
                UserId: user.id,
                active: true,
            });

            sgmail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: email,
                from: 'sheerinfarhana25@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/reset/${id}">Reset password</a>`,
            }
            sgmail
                .send(msg)
                .then((response) => {
                    console.log('Email sent')
                    return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your mail ', success: true })
                })
                .catch((error) => {
                    console.error(error)
                    throw new Error(error);
                });
        } else {
            throw new Error('User doesn\'t exist')
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, success: false });
    }
}


const resetpassword = (req, res) => {
    const id =  req.params.id;
    ForgotPassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

// const updatepassword = (req, res) => {

//     try {
//         const { newpassword } = req.query;
//         const { resetpasswordid } = req.params;
//         console.log(newpassword);
//         console.log(resetpasswordid);
//         ForgotPassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
//             User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
//                 // console.log('userDetails', user)
//                 if(user) {
//                     //encrypt the password

//                     const saltRounds = 10;
//                     bcrypt.genSalt(saltRounds, function(err, salt) {
//                         if(err){
//                             console.log(err);
//                             throw new Error(err);
//                         }
//                         bcrypt.hash(newpassword, salt, function(err, hash) {
//                             // Store hash in your password DB.
//                             if(err){
//                                 console.log(err);
//                                 throw new Error(err);
//                             }
//                             user.update({ password: hash }).then(() => {
//                                 res.status(201).json({message: 'Successfuly update the new password'})
//                             })
//                         });
//                     });
//                     console.log("password updated");
//             } else{
//                 return res.status(404).json({ error: 'No user Exists', success: false})
//             }
//             })
//         })
//     } catch(error){
//         return res.status(403).json({ error, success: false } )
//     }

// }

const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        console.log(newpassword);
        console.log(resetpasswordid);

        const resetpasswordrequest = await ForgotPassword.findOne({
            where: { id: resetpasswordid }
        });

        if (resetpasswordrequest) {
            const user = await User.findOne({ where: { id: resetpasswordrequest.UserId } });

            if (user) {
                const saltRounds = 10;

                bcrypt.genSalt(saltRounds, async (err, salt) => {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }

                    bcrypt.hash(newpassword, salt, async (err, hash) => {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }

                        await user.update({ password: hash });

                        res.status(201).json({ message: 'Successfully updated the new password' });
                    });
                });
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(404).json({ error: 'Reset request not found', success: false });
        }
    } catch (error) {
        return res.status(403).json({ error, success: false });
    }
}


module.exports = { forgotpassword,resetpassword,updatepassword };
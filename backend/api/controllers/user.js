// https://www.youtube.com/watch?v=ucuNgSOFDZ0&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=14

// https://www.youtube.com/watch?v=_EP2qCmLzSE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=11
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Create a new user with distinct email in the database
// Route controller for json POST requests with body parameters: `{"email": "String", "password": "String"}`
// Path: ROOT DIRECTORY/user/register OR the full path: ROOT DIRECTORY/api/routes/user/controllers/user/register
exports.user_register = (req, res, next) => {
        const req_password = req.body.password;
        // Filter to check if the user email exits in the database
        User.find({email: req.body.email})
             .exec()
             .then(filter_response => {
                if (filter_response.length >= 1) {
                // If the user email exits in the database
                        const old_user = filter_response[0]
                        console.log(`Error 409:\nA user with the email ${req.body.email} is already registered!`);
                        return res.status(409).json({
                                status: 409,
                                message: `A user with the email ${req.body.email} is already registered!`,
                                login_request: {
                                        type: "POST",
                                        url: "http://localhost:3000/login/",
                                        headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                        },
                                        body: {
                                                "email": old_user.email, 
                                                "password": req_password/*,
                                                userImage: req.file.path */
                                        }
                                },
                                id: old_user._id
                        });
                } else {
                // A distinct email address in the user registration request
                        bcrypt.hash(req_password, 10, (err, hash) => {
                                if (err) {
                                        console.log('Hash failed!\nError 500');
                                        return res.status(500).json({
                                                status: 500,
                                                message: 'Hash failed',
                                                error: err
                                        });
                                } else {
                                // Create a new user
                                        const new_user = new User({
                                                _id: new mongoose.Types.ObjectId(),
                                                email: req.body.email,
                                                password: hash
                                        });
                                        new_user
                                        .save()
                                        .then(result => {
                                                console.log('User created successfully!\nTo login:',
                                                        `\nEmail: ${new_user.email}\nPassword: ${req_password}\nUser ID: ${new_user._id}\n`);
                                                res.status(201).json({
                                                        status: 201,
                                                        message: 'User created successfully!',
                                                        login_request: {
                                                                type: "POST",
                                                                url: "http://localhost:3000/login/",
                                                                headers: {
                                                                        'Accept': 'application/json',
                                                                        'Content-Type': 'application/json'
                                                                },
                                                                body: {
                                                                        "email": new_user.email, 
                                                                        "password": req_password/*,
                                                                        userImage: req.file.path */
                                                                }
                                                        },
                                                        id: new_user._id
                                                });
                                        })
                                        .catch(err => {
                                                console.log('Could not create user.\nError 500')
                                                console.log(err);
                                                return res.status(500).json({
                                                        status: 500,
                                                        message: 'Could not create user.\nCheck if the email is correct and that your requested password is valid.'
                                                });
                                        });
                                }
                        });
                }
             });
};

exports.user_login = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        User.find({email: email})
             .exec()
             .then(user => {
                     if (user.length < 1) {
                             return res.status(401).json({
                                     message: 'Auth failed'
                             });
                     }
                     bcrypt.compare(password, user[0].password, (err, result) => {
                             if (err) {
                                     return res.status(401).json({
                                             message: 'Auth failed'
                                     });
                             }
                             if (result) {
                                     const token = jwt.sign(
                                        {
                                                email: user[0].email,
                                                userId: user[0]._id
                                        },
                                        process.env.JWT_KEY,
                                        {
                                                expiresIn: "1h"
                                        }
                                     );
                                     return res.status(200).json({
                                        message: 'Login successful',
                                        token: token,
                                        login_request: {
                                                type: "POST",
                                                url: "http://localhost:3000/login/",
                                                headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json'
                                                },
                                                body: {
                                                        "id": user[0]._id,
                                                        "email": email, 
                                                        "password": password/*,
                                                        userImage: req.file.path */
                                                }
                                        }
                                     });
                             }
                             res.status(401).json({
                                     message: 'Auth failed'
                             });
                     });
             })
             .catch(err => {
                console.log(`Error 500:\n`,`Could not login user due to an unknown reason.\n`,
                        `Check if your email is correct: ${email}`
                );
                console.log(err);

                return res.status(500).json({
                        //status: 500,
                        message: `Could not login user due to an unknown reason.\n`+
                        `Check if your email is correct: ${email}\n`,
                        error: err
                });
             });
};

exports.user_delete = (req, res, next) => {
        const id = `${req.params.userId}`;
        // Check if the ID is valid for MongoDB
        // https://mongoosejs.com/docs/api/mongoose.html#Mongoose.prototype.isObjectIdOrHexString()
        if (mongoose.isObjectIdOrHexString(id)) {
                User.findByIdAndDelete(id)
                .exec()
                .then(user => {
                   if (user) {
                   // User found and deleted from database
                           const email = user.email;
                           console.log('User deleted successfully!\nTo register again use your credentials:',
                                   `\nEmail: ${email}\nPassword: Choose a new password\n`);
                           return res.status(200).json({
                                   //status: 200,
                                   message: "User deleted successfully!",
                                   register_request: {
                                           type: "POST",
                                           url: "http://localhost:3000/login/",
                                           headers: {
                                                   'Accept': 'application/json',
                                                   'Content-Type': 'application/json'
                                           },
                                           body: {
                                                   "email": email, 
                                                   "password": "Choose a new password"/* ,
                                                   userImage: req.file.path  */
                                           }
                                   }
                           });
                   } else {
                   // User not found in database
                           console.log(`Error 404:\n`,`User ID ${id} is not found in the database.\n`);
                           return res.status(404).json({
                                 //status: 404,
                                 message: `User ID ${id} is not found in the database.`
                         });
                   }
                })
                .catch(err => {
                   // https://www.mongodb.com/docs/manual/reference/bson-types/#objectid
                   console.log(`Error 500:\n`,`Could not delete user due to an unknown reason.\n`,
                           `Check if ID ${id} is a valid ID.`,
                           `A valid ID is a single String of 12 bytes or 24 hex (1,2,...,E,F) characters`
                   );
   
                   return res.status(500).json({
                           //status: 500,
                           message: `User ID ${id} could not be deleted due to an unknown reason.`
                   });
                });
        } else {
                console.log(`Error 400:`,
                        `Invalid parameter - ID ${id} is not a valid ID!\n`,
                        `A valid ID is a single String of 12 bytes or 24 hex (1,2,...,E,F) characters\n`,
                        `To read more:\n`,
                        `https://www.mongodb.com/docs/manual/reference/bson-types/#objectid\n`
                );
                return res.status(400).json({
                        //status: 400,
                        message: `Invalid parameter - ID ${id} is not a valid user ID!\n`+
                        `A valid ID is a single String of 12 bytes or 24 hex (1,2,...,E,F) characters.\n`+
                        `To read more:\n`+
                        `https://www.mongodb.com/docs/manual/reference/bson-types/#objectid\n`
                });
        }
};

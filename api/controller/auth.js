const User = require('../models/User.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDoc = await User.findOne({ email });
        if (userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign(
                    {
                        email: userDoc.email,
                        id: userDoc._id,
                    },
                    jwtSecret,
                    {},
                    (err, token) => {
                        if (err) throw err;
                        res
                            .cookie('token', token, {
                                sameSite: 'none',
                                secure: true,
                                httpOnly: false,
                            })
                            .json(userDoc);
                    }
                );
            } else {
                res.status(422).json('pass not ok');
            }
        } else {
            res.json('not found');
        }

    } catch (error) {
        console.log(error);
    }

};


module.exports = {
    register,
    login
};
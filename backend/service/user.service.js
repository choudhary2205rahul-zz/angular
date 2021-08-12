const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user
            .save()
            .then(result => {
                res.status(201).json({
                    message: "User created!",
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Invalid authentication credentials'
                });
            });
    });
};

exports.login = (req, res, next) => {
    let user;
    User.findOne({email: req.body.email})
        .then(res => {
            if (!res) {
                return res.status(401).json({
                    message: 'Invalid authentication credentials'
                })
            }
            user = res;
            return bcrypt.compare(req.body.password, res.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Invalid authentication credentials'
                })
            }

            const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.status(200).json({
                token,
                expires: '3600',
                userId: user._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials'
            })
        });
};
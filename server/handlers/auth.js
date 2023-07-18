const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signin = async function (req, res, next) {
    try {
        const user = await db.User.findOne({
            email: req.body.email,
        });
        const { id, username, category, avatarUrl } = user;
        const isMatch = await user.comparePassword(req.body.password, next);
        if (isMatch) {
            const token = jwt.sign(
                {
                    id,
                    username,
                    category,
                    avatarUrl,
                },
                process.env.JWT_SECRET_KEY
            );

            const cart = [];
            for (const [key, value] of user.cart) {
                const product = await db.Product.findById(key).populate("createdBy");
                const { id, name, description, price, imageUrl, stockNum, createdBy } = product;
                cart.push({
                    id: id,
                    name: name,
                    description: description,
                    price: price,
                    quantity: value,
                    imageUrl: imageUrl,
                    stockNum,
                    vendor: {
                        id: createdBy.id,
                        username: createdBy.username,
                        avatarUrl: createdBy.avatarUrl,
                    },
                });
            }

            return res.status(200).json({
                id,
                username,
                category,
                avatarUrl,
                cart,
                token,
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Password!",
            });
        }
    } catch (err) {
        return next({
            status: 400,
            message: "Email not found!",
            // message: err.message
        });
    }
};

exports.signup = async function (req, res, next) {
    try {
        const user = await db.User.create(req.body);
        const { id, username, category, avatarUrl } = user;
        const token = await jwt.sign(
            {
                id,
                username,
                category,
                avatarUrl,
            },
            process.env.JWT_SECRET_KEY
        );
        return res.status(200).json({
            id,
            username,
            category,
            avatarUrl,
            token,
        });
    } catch (err) {
        if (err.code === 11000) err.message = "Sorry, this email is taken!";
        return next({
            status: 400,
            message: err.message,
        });
    }
};

exports.resetPassword = async function (req, res, next) {
    try {
        const user = await db.User.findOne({
            email: req.body.email,
        });
        if (!user) {
            return next({
                status: 400,
                message: "Email not found!",
            });
        }
        user.password = req.body.password;
        await user.save();
        res.status(202).json({
            message: `${user.username} password updated!`,
        });
    } catch (err) {
        return next({
            status: 400,
            message: "Email not found!",
            // message: err.message
        });
    }
};

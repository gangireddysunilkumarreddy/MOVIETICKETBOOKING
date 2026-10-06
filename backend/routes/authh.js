const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ==========================================
// CREATE JWT TOKEN
// ==========================================

function createToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
}


// ==========================================
// REGISTER CUSTOMER
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill all fields"
            });

        }

        const cleanEmail =
            email.trim().toLowerCase();

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({

                name: name.trim(),

                email: cleanEmail,

                password: hashedPassword,

                role: "customer"

            });

        const token =
            createToken(user);

        res.status(201).json({

            message: "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        res.status(500).json({

            message: "Registration failed",

            error: error.message

        });

    }

});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        console.log("LOGIN REQUEST:", email);


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        const user =
            await User.findOne({
                email: cleanEmail
            });


        if (!user) {

            return res.status(401).json({

                message:
                    "User not found. Please register first."

            });

        }


        if (!user.password) {

            return res.status(401).json({

                message:
                    "This account does not have a password."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Incorrect password"

            });

        }


        const token =
            createToken(user);


        console.log(
            "LOGIN SUCCESS:",
            user.email,
            user.role
        );


        res.status(200).json({

            message:
                "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Server error during login",

            error: error.message

        });

    }

});


module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// Create JWT token
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


// ===============================
// REGISTER CUSTOMER
// ===============================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create customer
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role: "customer"
        });

        // Create token
        const token = createToken(user);

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


// ===============================
// LOGIN
// ===============================
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        console.log(
            "LOGIN REQUEST:",
            email
        );

        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const cleanEmail =
            email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                message:
                    "User not found. Please register first."
            });
        }

        // Google-only account
        if (!user.password) {
            return res.status(401).json({
                message:
                    "This account does not have a password. Please use Google Login."
            });
        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        // Create JWT
        const token =
            createToken(user);

        console.log(
            "LOGIN SUCCESS:",
            user.email,
            user.role
        );

        res.status(200).json({

            message: "Login successful",

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


// ===============================
// GET CURRENT USER
// ===============================
router.get("/me", async (req, res) => {
    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message:
                    "Authentication required"
            });
        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const user =
            await User.findById(
                decoded.userId
            ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user
        });

    } catch (error) {

        res.status(401).json({
            message:
                "Invalid or expired token"
        });
    }
});


module.exports = router;
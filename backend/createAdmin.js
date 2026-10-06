const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            email: "admin@cinebook.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({
            name: "CineBook Admin",
            email: "admin@cinebook.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");
        console.log("Email: admin@cinebook.com");
        console.log("Password: Admin@123");

        process.exit();

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

createAdmin();
const express = require("express");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    adminOnly,
    (req, res) => {
        res.status(200).json({
            message: "Welcome Admin",
            admin: req.user
        });
    }
);

router.get(
    "/test",
    protect,
    adminOnly,
    (req, res) => {
        res.status(200).json({
            message: "Admin API is working successfully",
            role: req.user.role
        });
    }
);

module.exports = router;
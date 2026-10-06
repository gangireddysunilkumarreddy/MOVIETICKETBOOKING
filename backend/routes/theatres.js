const express = require("express");
const Theatre = require("../models/Theatre");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET all theatres
router.get("/", protect, async (req, res) => {
    try {
        const theatres = await Theatre.find()
            .sort({ createdAt: -1 });

        res.json(theatres);

    } catch (error) {
        console.error("GET THEATRES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch theatres"
        });
    }
});


// ADD theatre - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            name,
            location,
            screens
        } = req.body;

        if (!name || !location) {
            return res.status(400).json({
                message: "Theatre name and location are required"
            });
        }

        const theatre = await Theatre.create({
            name: name.trim(),
            location: location.trim(),
            screens: Number(screens) || 1,
            status: "active"
        });

        res.status(201).json({
            message: "Theatre added successfully",
            theatre
        });

    } catch (error) {
        console.error("ADD THEATRE ERROR:", error);

        res.status(500).json({
            message: "Failed to add theatre",
            error: error.message
        });
    }
});


// DELETE theatre - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const theatre =
            await Theatre.findByIdAndDelete(req.params.id);

        if (!theatre) {
            return res.status(404).json({
                message: "Theatre not found"
            });
        }

        res.json({
            message: "Theatre deleted successfully"
        });

    } catch (error) {
        console.error("DELETE THEATRE ERROR:", error);

        res.status(500).json({
            message: "Failed to delete theatre"
        });
    }
});


module.exports = router;
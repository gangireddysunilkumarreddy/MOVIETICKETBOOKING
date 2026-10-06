const express = require("express");
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET all shows
router.get("/", protect, async (req, res) => {
    try {
        const shows = await Show.find()
            .populate("movie", "title")
            .populate("theatre", "name location")
            .sort({ createdAt: -1 });

        res.json(shows);

    } catch (error) {
        console.error("GET SHOWS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch shows"
        });
    }
});


// ADD SHOW - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            movie,
            theatre,
            showDate,
            showTime,
            ticketPrice
        } = req.body;

        if (
            !movie ||
            !theatre ||
            !showDate ||
            !showTime ||
            !ticketPrice
        ) {
            return res.status(400).json({
                message: "Please fill all show fields"
            });
        }

        const movieExists =
            await Movie.findById(movie);

        if (!movieExists) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        const theatreExists =
            await Theatre.findById(theatre);

        if (!theatreExists) {
            return res.status(404).json({
                message: "Theatre not found"
            });
        }


        // Create seats A1-D6
        const seats = [];

        const rows = ["A", "B", "C", "D"];

        rows.forEach((row) => {
            for (let i = 1; i <= 6; i++) {
                seats.push({
                    seatNumber: `${row}${i}`,
                    status: "available"
                });
            }
        });


        const show = await Show.create({
            movie,
            theatre,
            showDate,
            showTime,
            ticketPrice: Number(ticketPrice),
            seats,
            status: "active"
        });


        const populatedShow =
            await Show.findById(show._id)
                .populate("movie", "title")
                .populate("theatre", "name location");


        res.status(201).json({
            message: "Show added successfully",
            show: populatedShow
        });

    } catch (error) {
        console.error("ADD SHOW ERROR:", error);

        res.status(500).json({
            message: "Failed to add show",
            error: error.message
        });
    }
});


// DELETE SHOW - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const show =
            await Show.findByIdAndDelete(req.params.id);

        if (!show) {
            return res.status(404).json({
                message: "Show not found"
            });
        }

        res.json({
            message: "Show deleted successfully"
        });

    } catch (error) {
        console.error("DELETE SHOW ERROR:", error);

        res.status(500).json({
            message: "Failed to delete show"
        });
    }
});


module.exports = router;
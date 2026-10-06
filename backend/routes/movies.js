const express = require("express");
const Movie = require("../models/Movie");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all movies
router.get("/", protect, async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });

        res.json(movies);
    } catch (error) {
        console.error("GET MOVIES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch movies"
        });
    }
});

// ADD movie - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            title,
            description,
            genre,
            language,
            duration,
            poster,
            rating
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Movie title is required"
            });
        }

        const movie = await Movie.create({
            title,
            description: description || "",
            genre: genre || "",
            language: language || "Telugu",
            duration: duration || "",
            poster: poster || "",
            rating: Number(rating) || 0,
            status: "active"
        });

        res.status(201).json({
            message: "Movie added successfully",
            movie
        });

    } catch (error) {
        console.error("ADD MOVIE ERROR:", error);

        res.status(500).json({
            message: "Failed to add movie",
            error: error.message
        });
    }
});

// DELETE movie - Admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.json({
            message: "Movie deleted successfully"
        });

    } catch (error) {
        console.error("DELETE MOVIE ERROR:", error);

        res.status(500).json({
            message: "Failed to delete movie"
        });
    }
});

module.exports = router;
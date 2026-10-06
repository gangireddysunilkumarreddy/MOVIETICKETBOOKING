const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        genre: {
            type: String,
            default: ""
        },

        language: {
            type: String,
            default: "Telugu"
        },

        duration: {
            type: String,
            default: ""
        },

        poster: {
            type: String,
            default: ""
        },

        rating: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Movie", movieSchema);
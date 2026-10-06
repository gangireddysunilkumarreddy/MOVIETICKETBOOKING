const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
    {
        seatNumber: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["available", "booked"],
            default: "available"
        }
    },
    { _id: false }
);

const showSchema = new mongoose.Schema(
    {
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true
        },

        theatre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theatre",
            required: true
        },

        showDate: {
            type: String,
            required: true
        },

        showTime: {
            type: String,
            required: true
        },

        ticketPrice: {
            type: Number,
            required: true
        },

        seats: {
            type: [seatSchema],
            default: []
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

module.exports = mongoose.model("Show", showSchema);
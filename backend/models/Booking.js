const mongoose = require("mongoose");


const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        total: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);


const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

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

        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Show",
            required: true
        },

        seats: {
            type: [String],
            required: true
        },

        ticketPrice: {
            type: Number,
            required: true
        },

        ticketTotal: {
            type: Number,
            required: true
        },

        food: {
            type: [foodSchema],
            default: []
        },

        foodTotal: {
            type: Number,
            default: 0
        },

        totalAmount: {
            type: Number,
            required: true
        },

        foodStatus: {
            type: String,
            enum: [
                "No Food",
                "Pending",
                "Preparing",
                "Delivered"
            ],
            default: "No Food"
        },

        bookingStatus: {
            type: String,
            enum: [
                "Confirmed",
                "Cancelled"
            ],
            default: "Confirmed"
        },

        bookingDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Booking", bookingSchema);
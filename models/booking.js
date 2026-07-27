import mongoose from "mongoose";
import constants from "../constant.js";

const bookingSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
        },
        customerPhone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        serviceSnapshot: {
            name: String,
            price: Number,
            finalPrice: Number,
            image: String,
        },
        date: {
            type: Date,
            required: [true, "Booking date is required"],
        },
        timeSlot: {
            type: String,
            required: [true, "Time slot is required"],
        },
        address: {
            type: String,
            required: [true, "Address is required"],
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({ user: 1, date: -1 });
bookingSchema.index({ status: 1 });

const BookingModel = mongoose.model(
    constants.DATABASE_MODELS.BOOKING,
    bookingSchema
);

export default BookingModel;
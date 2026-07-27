import mongoose from "mongoose";
import BookingModel from "../models/booking.js";
import ServiceModel from "../models/service.js";
import asyncErrorHandler from "../utils/asynErrorHandler.js";
import CustomError from "../utils/customError.js";

const validateBookingBody = (req, res, next) => {
    const {
        customerName,
        customerPhone,
        serviceId,
        date,
        timeSlot,
        address,
    } = req.body;

    if (!customerName?.trim())
        return next(new CustomError("Customer name is required", 400));

    if (!customerPhone?.trim())
        return next(new CustomError("Customer phone is required", 400));

    if (!serviceId)
        return next(new CustomError("Service ID is required", 400));

    if (!date)
        return next(new CustomError("Booking date is required", 400));

    if (isNaN(new Date(date).getTime()))
        return next(new CustomError("Invalid booking date", 400));

    if (!timeSlot?.trim())
        return next(new CustomError("Time slot is required", 400));

    if (!address?.trim())
        return next(new CustomError("Address is required", 400));

    next();
};

const createBooking = asyncErrorHandler(async (req, res, next) => {
    const body = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(body.serviceId)) {
        return next(new CustomError("Invalid service ID", 400));
    }

    // Find service
    const service = await ServiceModel.findById(body.serviceId);

    if (!service) {
        return next(new CustomError("Service not found", 404));
    }

    // Use virtual finalPrice if available
    const finalPrice = service.finalPrice;

    // Snapshot
    const snapshot = {
        name: service.name,
        price: service.price,
        finalPrice,
        image: service.assets[0],
    };

    const booking = await BookingModel.create({
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        service: service._id,
        serviceSnapshot: snapshot,
        date: new Date(body.date),
        timeSlot: body.timeSlot,
        address: body.address,
        totalPrice: finalPrice,
        notes: body.notes ?? "",
    });

    res.status(201).json({
        status: "success",
        message: "Booking confirmed successfully",
        data: booking,
    });
});

// --- (Optional) GET BOOKINGS by phone ---
const getBookingsByPhone = asyncErrorHandler(async (req, res, next) => {
    const { phone } = req.query;
    if (!phone) {
        return next(new CustomError("Phone number is required to fetch bookings", 400));
    }

    const bookings = await BookingModel.find({ customerPhone: phone })
        .sort({ createdAt: -1 })
        .populate("service", "name category assets") // populate service details if needed
        .lean();

    res.status(200).json({
        status: "success",
        results: bookings.length,
        data: bookings,
    });
});

// --- (Optional) GET a single booking by ID ---
const getBookingById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const booking = await BookingModel.findById(id).populate("service");
    if (!booking) {
        return next(new CustomError("Booking not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: booking,
    });
});


export default {
    getBookingById,
    getBookingsByPhone,
    createBooking,
    validateBookingBody
}
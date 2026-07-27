import express from "express";
import controller from "../controllers/booking.js";

const router = express.Router();

router.route("/booking")
    .post(controller.validateBookingBody, controller.createBooking);

router.route("/bookings")
    .get(controller.getBookingsByPhone);

router.route("/bookings/:id")
    .get(controller.getBookingById);

export default router;
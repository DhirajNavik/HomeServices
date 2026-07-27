import express from "express";
import controller from "../controllers/service.js"
const router = express.Router()

router.route("/service").post(controller.validateServiceBody, controller.createService)

router.route("/services{/:id}")
        .get(controller.fetchServicesByCategory)

router.route("/service{/:id}")
        .get(controller.findServiceDetails)

router.route("/fetchTopRatedServices").get(controller.fetchTopRatedServices)

export default router

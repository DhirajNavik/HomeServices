import express from "express";
import controller from "../controllers/category.js"
const router = express.Router()

router.route("/categories")
        .get(controller.fetchCategories)
router.route("/category")
        .post(controller.createCategory)
router.route("/category/:id")
        .get(controller.categoryDetails)

export default router

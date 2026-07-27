import CategoryModel from "../models/category.js";
import ApiFeatures from "../utils/apiFeatures.js";
import asyncErrorHandler from "../utils/asynErrorHandler.js";
import CustomError from "../utils/customError.js";

const fetchCategories = asyncErrorHandler(async (req, res) => {
    const id = req.params.id

    const features = new ApiFeatures(CategoryModel.find({ isActive: true }), req.query, res.locals).filter().sort().limitFields().paginate()
    let categories = await features.queryObject;

    return res.status(200).json({
        "data": categories,
        "page": req.query.page,
        "status": "success"
    })

})

const categoryDetails = asyncErrorHandler(async (req, res, next) => {
    const id = req.params.id
    const category = await CategoryModel.findById(id)
    if (!category) {
        const error = new CustomError("Category not found", 404);
        return next(error);
    }
    return res.status(200).json({
        "data": category,
        "status": "success"
    })

})


const createCategory = asyncErrorHandler(async (req, res) => {
    const category = await CategoryModel.create(req.body);

    res.status(201).json({
        data: category,
        message: "Category created successfully",
        status: "success",
    });
});

export default {
    fetchCategories,
    createCategory,
    categoryDetails
};
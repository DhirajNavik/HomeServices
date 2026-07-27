import ServiceModel from "../models/service.js";
import ApiFeatures from "../utils/apiFeatures.js";
import asyncErrorHandler from "../utils/asynErrorHandler.js";
import CustomError from "../utils/customError.js";

const validateServiceBody = (req, res, next) => {
    if (!req.body) {
        const error = new CustomError('Not a valid request', 400);
        return next(error);
    }
    next()
}


const findServiceDetails = asyncErrorHandler(async (req, res, next) => {
    const id = req.params.id
    const service = await ServiceModel.findById(id)
    if (!service) {
        const error = new CustomError("Service not found", 404);
        return next(error);
    }
    return res.status(200).json({
        "data": service,
        "status": "success"
    })

})

const fetchServicesByCategory = asyncErrorHandler(async (req, res, next) => {
    const categoryId = req.params.id

    const features = new ApiFeatures(ServiceModel.find({
        category: categoryId,
        isActive: true,
    }), req.query, res.locals).filter().sort().limitFields().paginate()
    let services = await features.queryObject;

    return res.status(200).json({
        "data": services,
        "page": req.query.page,
        "status": "success"
    })

})


const createService = asyncErrorHandler(async (req, res, next) => {
    const serviceData = req.body;
    const newService = await ServiceModel.create(serviceData);

    res.status(201).json({
        "data": newService,
        "message": "Service created successfully",
        "status": "success"
    })

})

const fetchTopRatedServices = asyncErrorHandler(async (req, res, next) => {
    const services = await ServiceModel.aggregate([
        {
            $match: {
                isActive: true,
            },
        },
        {
            $sort: {
                rating: -1, // Highest rating first
            },
        },
        {
            $limit: 5,
        },
        {
            $project: {
                name: 1,
                description: 1,
                price: 1,
                discountPercent: 1,
                assets: 1,
                category: 1,
                rating: 1,
                finalPrice: {
                    $round: [
                        {
                            $multiply: [
                                "$price",
                                {
                                    $subtract: [
                                        1,
                                        {
                                            $divide: ["$discountPercent", 100],
                                        },
                                    ],
                                },
                            ],
                        },
                        2,
                    ],
                },
            },
        },
    ]);

    return res.status(200).json({
        data: services,
        status: "success",
    });
});

export default {
    validateServiceBody,
    findServiceDetails,
    fetchServicesByCategory,
    createService,
    fetchTopRatedServices
};
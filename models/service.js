import mongoose from "mongoose";
import constants from "../constant.js";

const serviceSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: constants.DATABASE_MODELS.CATEGORY,
        required: true,
    },
    name: {
        type: String,
        required: [true, "Service name is required"],
        maxLength: [100, "Service name must not have more than 100 Character"],
        minLength: [4, "Service name should be atleast 4 Character"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than or equal to 0"],
    },
    discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    ratings: {
        type: Number,
        default: 0,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    assets: {
        type: String,
        required: [true, "Service Image is required"],
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

serviceSchema.virtual('finalPrice').get(function () {
    if (this.discountPercent <= 0 || !this.price) {
        return this.price;
    }
    return Number(
        (this.price * (1 - this.discountPercent / 100)).toFixed(2)
    );
})

serviceSchema.index({ category: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ isActive: 1 });

const ServiceModel = mongoose.model(constants.DATABASE_MODELS.SERVICE, serviceSchema)

export default ServiceModel;
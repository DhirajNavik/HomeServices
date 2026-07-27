import mongoose from "mongoose";
import constants from "../constant.js";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxLength: 500
        },
        icon: {
            type: String
        },
        assets: {
            type: [String],
            required: [true, "At least one image is required"],
            validate: {
                validator: function (value) {
                    return value.length >= 1 && value.length <= 5;
                },
                message: "Assets must contain between 1 and 5 images"
            }
        },

        bookings: {
            type: Number,
            default: 2,
            min: 0,
        },
        ratings: {
            type: Number,
            default: 0,
            min: [0, "Rating must be above 0"],
            max: [5, "Rating must be below 5"]
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    },
);

categorySchema.index({ name: 1 }, { unique: true });
categorySchema.index({ isActive: 1 });
categorySchema.index({ bookings: -1 });
categorySchema.index({ ratings: -1 });

const categoryModel = mongoose.model(
    constants.DATABASE_MODELS.CATEGORY,
    categorySchema,
);

export default categoryModel;
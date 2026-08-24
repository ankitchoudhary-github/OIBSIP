import mongoose from "mongoose";

const customizationOptionSchema =
  new mongoose.Schema(
    {
      optionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      type: {
        type: String,
        required: true,
        enum: [
          "base",
          "sauce",
          "cheese",
          "vegetable",
        ],
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      image: {
        type: String,
        trim: true,
        default: "",
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    },
  );

const CustomizationOption =
  mongoose.model(
    "CustomizationOption",
    customizationOptionSchema,
  );

export default CustomizationOption;
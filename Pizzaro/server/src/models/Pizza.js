import mongoose from "mongoose";

const pizzaIngredientSchema =
  new mongoose.Schema(
    {
      optionId: {
        type: String,
        required: true,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 0.01,
      },
    },
    {
      _id: false,
    },
  );

const pizzaSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["veg", "nonveg"],
    },

    /*
      Ingredients consumed when this
      menu pizza is ordered.
    */
    recipe: {
      type: [pizzaIngredientSchema],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
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

const Pizza =
  mongoose.model("Pizza", pizzaSchema);

export default Pizza;
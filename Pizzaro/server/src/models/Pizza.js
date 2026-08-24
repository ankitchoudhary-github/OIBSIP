import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
  {
    /*
      This is the product ID used by the frontend.

      Example:
      bbq-poncho
      bombay
      cheeseburger-pizza
    */
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

    /*
      IMPORTANT:
      This is the price the backend trusts.
      Never use the price sent by the browser
      when creating an order.
    */
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

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
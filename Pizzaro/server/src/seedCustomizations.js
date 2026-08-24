import "dotenv/config";

import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import CustomizationOption from "./models/CustomizationOption.js";

const options = [
  // =========================
  // BASES
  // =========================
  {
    optionId: "classic",
    type: "base",
    name: "Classic",
    description:
      "Our signature hand-stretched base",
    price: 299,
    image:
      "/images/customizer/bases/classic-crust.png",
  },
  {
    optionId: "thin-crust",
    type: "base",
    name: "Thin Crust",
    description:
      "Light, crispy & perfectly golden",
    price: 329,
    image:
      "/images/customizer/bases/thin-crust.png",
  },
  {
    optionId: "whole-wheat",
    type: "base",
    name: "Whole Wheat",
    description:
      "Wholesome & hearty",
    price: 339,
    image:
      "/images/customizer/bases/whole-wheat.png",
  },
  {
    optionId: "cheese-burst",
    type: "base",
    name: "Cheese Burst",
    description:
      "Loaded with creamy cheese",
    price: 369,
    image:
      "/images/customizer/bases/cheese-burst.png",
  },
  {
    optionId: "stuffed-crust",
    type: "base",
    name: "Stuffed Crust",
    description:
      "Golden crust packed with cheese",
    price: 389,
    image:
      "/images/customizer/bases/stuffed-crust.png",
  },

  // =========================
  // SAUCES
  // =========================
  {
    optionId: "classic-tomato",
    type: "sauce",
    name: "Classic Tomato",
    description:
      "Rich Italian tomato sauce",
    price: 0,
    image:
      "/images/customizer/sauces/classic-tomato.png",
  },
  {
    optionId: "bbq",
    type: "sauce",
    name: "BBQ",
    description:
      "Smoky, sweet & tangy",
    price: 20,
    image:
      "/images/customizer/sauces/BBQ.png",
  },
  {
    optionId: "spicy-arrabbiata",
    type: "sauce",
    name: "Spicy Arrabbiata",
    description:
      "Tomato sauce with a kick",
    price: 25,
    image:
      "/images/customizer/sauces/spicy-arrabbiata.png",
  },
  {
    optionId: "creamy-garlic",
    type: "sauce",
    name: "Creamy Garlic",
    description:
      "Smooth garlic cream sauce",
    price: 30,
    image:
      "/images/customizer/sauces/creamy-garlic.png",
  },
  {
    optionId: "pesto",
    type: "sauce",
    name: "Pesto",
    description:
      "Fresh basil & parmesan",
    price: 35,
    image:
      "/images/customizer/sauces/pesto.png",
  },

  // =========================
  // CHEESES
  // =========================
  {
    optionId: "mozzarella",
    type: "cheese",
    name: "Mozzarella",
    description:
      "Classic stretchy mozzarella",
    price: 0,
    image:
      "/images/customizer/cheeses/mozzarella.png",
  },
  {
    optionId: "cheddar",
    type: "cheese",
    name: "Cheddar",
    description: "Sharp & rich",
    price: 30,
    image:
      "/images/customizer/cheeses/cheddar.png",
  },
  {
    optionId: "parmesan",
    type: "cheese",
    name: "Parmesan",
    description: "Nutty & aged",
    price: 40,
    image:
      "/images/customizer/cheeses/parmesan.png",
  },
  {
    optionId: "four-cheese",
    type: "cheese",
    name: "Four Cheese",
    description:
      "A decadent cheese blend",
    price: 60,
    image:
      "/images/customizer/cheeses/four-cheese.png",
  },

  // =========================
  // VEGETABLES
  // =========================
  {
    optionId: "onions",
    type: "vegetable",
    name: "Onions",
    price: 20,
    image:
      "/images/customizer/toppings/onions.png",
  },
  {
    optionId: "capsicum",
    type: "vegetable",
    name: "Capsicum",
    price: 20,
    image:
      "/images/customizer/toppings/capsicum.png",
  },
  {
    optionId: "mushrooms",
    type: "vegetable",
    name: "Mushrooms",
    price: 30,
    image:
      "/images/customizer/toppings/mushrooms.png",
  },
  {
    optionId: "black-olives",
    type: "vegetable",
    name: "Black Olives",
    price: 30,
    image:
      "/images/customizer/toppings/black-olives.png",
  },
  {
    optionId: "jalapenos",
    type: "vegetable",
    name: "Jalapeños",
    price: 30,
    image:
      "/images/customizer/toppings/jalapenos.png",
  },
  {
    optionId: "sweet-corn",
    type: "vegetable",
    name: "Sweet Corn",
    price: 25,
    image:
      "/images/customizer/toppings/sweet-corn.png",
  },
  {
    optionId: "tomatoes",
    type: "vegetable",
    name: "Tomatoes",
    price: 20,
    image:
      "/images/customizer/toppings/tomatoes.png",
  },
  {
    optionId: "spinach",
    type: "vegetable",
    name: "Spinach",
    price: 25,
    image:
      "/images/customizer/toppings/spinach.png",
  },
];

async function seedCustomizations() {
  try {
    await connectDB();

    await CustomizationOption.deleteMany({});

    await CustomizationOption.insertMany(options);

    console.log(
      "Customization options seeded successfully.",
    );

    console.log(
      `Inserted ${options.length} customization options.`,
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Customization seed failed:",
      error.message,
    );

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedCustomizations();
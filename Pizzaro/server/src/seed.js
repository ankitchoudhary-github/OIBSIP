import "dotenv/config";

import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import Pizza from "./models/Pizza.js";

const pizzas = [
  {
    productId: "bbq-poncho",
    name: "BBQ Poncho",
    description:
      "Smoky BBQ sauce, tender chicken & melted cheese.",
    price: 399,
    image: "/images/menu/bbq poncho.png",
    category: "nonveg",
    featured: true,
    active: true,
  },

  {
    productId: "bombay",
    name: "Bombay",
    description:
      "A bold Indian-inspired pizza packed with flavour.",
    price: 349,
    image: "/images/menu/bombay.png",
    category: "veg",
    featured: true,
    active: true,
  },

  {
    productId: "cheeseburger-pizza",
    name: "Cheeseburger Pizza",
    description:
      "All the comfort of a cheeseburger on a pizza.",
    price: 449,
    image: "/images/menu/cheeseburger pizza.png",
    category: "nonveg",
    featured: true,
    active: true,
  },

  {
    productId: "dutchman",
    name: "Dutchman",
    description:
      "A hearty combination of premium toppings and melted cheese.",
    price: 439,
    image: "/images/menu/dutchman.png",
    category: "nonveg",
    featured: false,
    active: true,
  },

  {
    productId: "conchita",
    name: "Conchita",
    description:
      "Tender chicken with sweet and savoury flavours.",
    price: 429,
    image: "/images/menu/conchita.png",
    category: "nonveg",
    featured: false,
    active: true,
  },

  {
    productId: "gourmet",
    name: "Gourmet",
    description:
      "A premium pizza layered with rich flavours and fresh ingredients.",
    price: 479,
    image: "/images/menu/Gourmet.png",
    category: "veg",
    featured: false,
    active: true,
  },

  {
    productId: "steak-bacon",
    name: "Steak & Bacon",
    description:
      "Juicy steak, crispy bacon and melted cheese on a golden crust.",
    price: 499,
    image: "/images/menu/steak&bacon.png",
    category: "nonveg",
    featured: false,
    active: true,
  },

  {
    productId: "indi-tandoori-paneer",
    name: "Indi Tandoori Paneer",
    description:
      "Tandoori-marinated paneer with rich Indian flavours.",
    price: 600,
    image: "/images/menu/indi-tandoor.png",
    category: "veg",
    featured: false,
    active: true,
  },
];

async function seedPizzas() {
  try {
    await connectDB();

    await Pizza.deleteMany({});

    await Pizza.insertMany(pizzas);

    console.log("Pizza catalog seeded successfully.");
    console.log(`Inserted ${pizzas.length} pizzas.`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Pizza seed failed:",
      error.message,
    );

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedPizzas();
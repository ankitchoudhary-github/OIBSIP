import Pizza from "../models/Pizza.js";

const recipes = {
  "bbq-poncho": [
    { optionId: "classic", quantity: 1 },
    { optionId: "bbq", quantity: 1 },
    { optionId: "mozzarella", quantity: 1 },
    { optionId: "onions", quantity: 1 },
    { optionId: "capsicum", quantity: 1 },
  ],

  bombay: [
    { optionId: "whole-wheat", quantity: 1 },
    { optionId: "spicy-arrabbiata", quantity: 1 },
    { optionId: "cheddar", quantity: 1 },
    { optionId: "onions", quantity: 1 },
    { optionId: "capsicum", quantity: 1 },
    { optionId: "sweet-corn", quantity: 1 },
  ],

  "cheeseburger-pizza": [
    { optionId: "classic", quantity: 1 },
    { optionId: "creamy-garlic", quantity: 1 },
    { optionId: "cheddar", quantity: 1 },
    { optionId: "onions", quantity: 1 },
    { optionId: "tomatoes", quantity: 1 },
    { optionId: "jalapenos", quantity: 1 },
  ],

  dutchman: [
    { optionId: "thin-crust", quantity: 1 },
    { optionId: "pesto", quantity: 1 },
    { optionId: "parmesan", quantity: 1 },
    { optionId: "mushrooms", quantity: 1 },
    { optionId: "black-olives", quantity: 1 },
  ],

  conchita: [
    { optionId: "classic", quantity: 1 },
    { optionId: "classic-tomato", quantity: 1 },
    { optionId: "mozzarella", quantity: 1 },
    { optionId: "tomatoes", quantity: 1 },
    { optionId: "spinach", quantity: 1 },
  ],

  gourmet: [
    { optionId: "cheese-burst", quantity: 1 },
    { optionId: "pesto", quantity: 1 },
    { optionId: "four-cheese", quantity: 1 },
    { optionId: "mushrooms", quantity: 1 },
    { optionId: "black-olives", quantity: 1 },
    { optionId: "spinach", quantity: 1 },
  ],

  "steak-bacon": [
    { optionId: "stuffed-crust", quantity: 1 },
    { optionId: "bbq", quantity: 1 },
    { optionId: "cheddar", quantity: 1 },
    { optionId: "onions", quantity: 1 },
    { optionId: "jalapenos", quantity: 1 },
  ],

  "indi-tandoori-paneer": [
    { optionId: "whole-wheat", quantity: 1 },
    { optionId: "creamy-garlic", quantity: 1 },
    { optionId: "four-cheese", quantity: 1 },
    { optionId: "capsicum", quantity: 1 },
    { optionId: "onions", quantity: 1 },
    { optionId: "tomatoes", quantity: 1 },
  ],
};

export async function updatePizzaRecipes() {
  for (const [productId, recipe] of Object.entries(recipes)) {
    const result = await Pizza.updateOne(
      { productId },
      { $set: { recipe } },
    );

    if (result.matchedCount === 0) {
      console.log(`Pizza not found: ${productId}`);
    } else {
      console.log(`Recipe updated: ${productId}`);
    }
  }

  console.log("Pizza recipe update completed.");
}
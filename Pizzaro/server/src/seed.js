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

    recipe: [
      { optionId: "classic", quantity: 1 },
      { optionId: "bbq", quantity: 1 },
      { optionId: "mozzarella", quantity: 1 },
      { optionId: "onions", quantity: 1 },
      { optionId: "capsicum", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "whole-wheat", quantity: 1 },
      { optionId: "spicy-arrabbiata", quantity: 1 },
      { optionId: "cheddar", quantity: 1 },
      { optionId: "onions", quantity: 1 },
      { optionId: "capsicum", quantity: 1 },
      { optionId: "sweet-corn", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "classic", quantity: 1 },
      { optionId: "creamy-garlic", quantity: 1 },
      { optionId: "cheddar", quantity: 1 },
      { optionId: "onions", quantity: 1 },
      { optionId: "tomatoes", quantity: 1 },
      { optionId: "jalapenos", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "thin-crust", quantity: 1 },
      { optionId: "pesto", quantity: 1 },
      { optionId: "parmesan", quantity: 1 },
      { optionId: "mushrooms", quantity: 1 },
      { optionId: "black-olives", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "classic", quantity: 1 },
      { optionId: "classic-tomato", quantity: 1 },
      { optionId: "mozzarella", quantity: 1 },
      { optionId: "tomatoes", quantity: 1 },
      { optionId: "spinach", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "cheese-burst", quantity: 1 },
      { optionId: "pesto", quantity: 1 },
      { optionId: "four-cheese", quantity: 1 },
      { optionId: "mushrooms", quantity: 1 },
      { optionId: "black-olives", quantity: 1 },
      { optionId: "spinach", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "stuffed-crust", quantity: 1 },
      { optionId: "bbq", quantity: 1 },
      { optionId: "cheddar", quantity: 1 },
      { optionId: "onions", quantity: 1 },
      { optionId: "jalapenos", quantity: 1 },
    ],
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

    recipe: [
      { optionId: "whole-wheat", quantity: 1 },
      { optionId: "creamy-garlic", quantity: 1 },
      { optionId: "four-cheese", quantity: 1 },
      { optionId: "capsicum", quantity: 1 },
      { optionId: "onions", quantity: 1 },
      { optionId: "tomatoes", quantity: 1 },
    ],
  },
];
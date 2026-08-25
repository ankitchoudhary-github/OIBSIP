import mongoose from "mongoose";
import Pizza from "../models/Pizza.js";
import Order from "../models/Order.js";
import CustomizationOption from "../models/CustomizationOption.js";

const MAX_QUANTITY_PER_ITEM = 20;
const MAX_ITEMS_PER_ORDER = 50;

export async function createOrder({ items, customer }) {
  /* =========================
     BASIC ORDER VALIDATION
  ========================== */

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }

  if (items.length > MAX_ITEMS_PER_ORDER) {
    throw new Error("Order contains too many different items.");
  }

  /* =========================
     CUSTOMER VALIDATION
  ========================== */

  const requiredCustomerFields = [
    "name",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ];

  if (!customer || typeof customer !== "object") {
    throw new Error("Customer details are required.");
  }

  for (const field of requiredCustomerFields) {
    if (typeof customer[field] !== "string" || !customer[field].trim()) {
      throw new Error(`Customer ${field} is required.`);
    }
  }

  /* =========================
     NORMALIZE + VALIDATE ITEMS
  ========================== */

  const normalizedItems = [];
  const seenItemKeys = new Set();

  for (const [index, item] of items.entries()) {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid item at position ${index + 1}.`);
    }

    const type = item.type ?? "menu";

    if (!["menu", "custom"].includes(type)) {
      throw new Error(`Invalid item type at position ${index + 1}.`);
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Quantity must be a positive integer.`);
    }

    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Quantity cannot exceed ${MAX_QUANTITY_PER_ITEM}.`);
    }

    if (type === "menu") {
      const productId =
        typeof item.productId === "string" ? item.productId.trim() : "";

      if (!productId) {
        throw new Error(`Menu item ${index + 1} is missing productId.`);
      }

      const itemKey = `menu:${productId}`;

      if (seenItemKeys.has(itemKey)) {
        throw new Error(
          `Duplicate menu product "${productId}" is not allowed.`,
        );
      }

      seenItemKeys.add(itemKey);

      normalizedItems.push({
        type: "menu",
        productId,
        quantity,
      });

      continue;
    }

    /* =========================
       CUSTOM PIZZA VALIDATION
    ========================== */

    const customization = item.customization;

    if (!customization || typeof customization !== "object") {
      throw new Error("Custom pizza configuration is required.");
    }

    const baseId =
      typeof customization.baseId === "string"
        ? customization.baseId.trim()
        : "";

    const sauceId =
      typeof customization.sauceId === "string"
        ? customization.sauceId.trim()
        : "";

    const cheeseId =
      typeof customization.cheeseId === "string"
        ? customization.cheeseId.trim()
        : "";

    const vegetableIds = Array.isArray(customization.vegetableIds)
      ? customization.vegetableIds
          .filter((id) => typeof id === "string")
          .map((id) => id.trim())
      : [];

    if (!baseId || !sauceId || !cheeseId) {
      throw new Error("Custom pizza must include a base, sauce, and cheese.");
    }

    if (vegetableIds.length > 8) {
      throw new Error("Too many vegetables selected.");
    }

    const uniqueVegetableIds = [...new Set(vegetableIds)];

    if (uniqueVegetableIds.length !== vegetableIds.length) {
      throw new Error("Duplicate vegetables are not allowed.");
    }

    const customKey = [
      "custom",
      baseId,
      sauceId,
      cheeseId,
      ...uniqueVegetableIds.sort(),
    ].join(":");

    if (seenItemKeys.has(customKey)) {
      throw new Error("Duplicate custom pizza configurations are not allowed.");
    }

    seenItemKeys.add(customKey);

    normalizedItems.push({
      type: "custom",
      quantity,
      customization: {
        baseId,
        sauceId,
        cheeseId,
        vegetableIds: uniqueVegetableIds,
      },
    });
  }

  /* =========================
     FETCH NORMAL PIZZAS
  ========================== */

  const menuItems = normalizedItems.filter((item) => item.type === "menu");

  const menuProductIds = menuItems.map((item) => item.productId);

  const pizzas =
    menuProductIds.length > 0
      ? await Pizza.find({
          productId: {
            $in: menuProductIds,
          },
          active: true,
        })
      : [];

  const pizzaMap = new Map(pizzas.map((pizza) => [pizza.productId, pizza]));

  for (const item of menuItems) {
    if (!pizzaMap.has(item.productId)) {
      throw new Error(
        `Pizza "${item.productId}" was not found or is unavailable.`,
      );
    }
  }

  /* =========================
     PREPARE CUSTOM OPTION IDS
  ========================== */

  const customItems = normalizedItems.filter((item) => item.type === "custom");

  const customOptionIds = new Set();

  for (const item of customItems) {
    customOptionIds.add(item.customization.baseId);

    customOptionIds.add(item.customization.sauceId);

    customOptionIds.add(item.customization.cheeseId);

    for (const vegetableId of item.customization.vegetableIds) {
      customOptionIds.add(vegetableId);
    }
  }

  const customOptions =
    customOptionIds.size > 0
      ? await CustomizationOption.find({
          optionId: {
            $in: [...customOptionIds],
          },
          active: true,
        })
      : [];

  const customOptionMap = new Map(
    customOptions.map((option) => [option.optionId, option]),
  );
  console.log("Requested custom option IDs:", [...customOptionIds]);

  console.log("Found custom option IDs:", [...customOptionMap.keys()]);
  /* =========================
     VERIFY CUSTOM OPTIONS
  ========================== */

  const missingCustomOptionIds = [...customOptionIds].filter(
    (optionId) => !customOptionMap.has(optionId),
  );

  if (missingCustomOptionIds.length > 0) {
    throw new Error(
      `Custom pizza option(s) unavailable: ${missingCustomOptionIds.join(", ")}`,
    );
  }
  /* =========================
     CALCULATE ORDER ITEMS
  ========================== */

  const orderItems = [];

  for (const item of normalizedItems) {
    /* =========================
       NORMAL MENU PIZZA
    ========================== */

    if (item.type === "menu") {
      const pizza = pizzaMap.get(item.productId);

      const unitPrice = pizza.price;

      orderItems.push({
        type: "menu",
        productId: pizza.productId,
        name: pizza.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      });

      continue;
    }

    /* =========================
       CUSTOM PIZZA
    ========================== */

    const { baseId, sauceId, cheeseId, vegetableIds } = item.customization;

    const base = customOptionMap.get(baseId);

    const sauce = customOptionMap.get(sauceId);

    const cheese = customOptionMap.get(cheeseId);

    if (
      base.type !== "base" ||
      sauce.type !== "sauce" ||
      cheese.type !== "cheese"
    ) {
      throw new Error("Invalid custom pizza option types.");
    }

    let customPrice = base.price + sauce.price + cheese.price;

    for (const vegetableId of vegetableIds) {
      const vegetable = customOptionMap.get(vegetableId);

      if (vegetable.type !== "vegetable") {
        throw new Error(`Invalid vegetable option "${vegetableId}".`);
      }

      customPrice += vegetable.price;
    }

    const name = `${base.name} Pizza`;

    orderItems.push({
      type: "custom",
      productId: null,
      name,
      quantity: item.quantity,

      customization: {
        baseId,
        sauceId,
        cheeseId,
        vegetableIds,
      },

      unitPrice: customPrice,

      lineTotal: customPrice * item.quantity,
    });
  }

  /* =========================
     TRUSTED SUBTOTAL
  ========================== */

  const subtotal = orderItems.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  /* =========================
     CREATE ORDER
  ========================== */

  const order = await Order.create({
    items: orderItems,

    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
      city: customer.city.trim(),
      state: customer.state.trim(),
      pincode: customer.pincode.trim(),
    },

    subtotal,
  });

  return order;
}

export async function getOrderById(orderId) {
  if (!orderId) {
    const error = new Error("Order ID is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    const error = new Error("Invalid order ID.");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId).lean();

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  return order;
}
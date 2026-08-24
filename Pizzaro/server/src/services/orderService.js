import Pizza from "../models/Pizza.js";
import Order from "../models/Order.js";

const MAX_QUANTITY_PER_ITEM = 20;

export async function createOrder({
  items,
  customer,
}) {
  /* =========================
     BASIC ORDER VALIDATION
  ========================== */

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "Order must contain at least one item.",
    );
  }

  if (items.length > 50) {
    throw new Error(
      "Order contains too many different items.",
    );
  }

  /* =========================
     VALIDATE CUSTOMER
  ========================== */

  const requiredCustomerFields = [
    "name",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ];

  if (
    !customer ||
    typeof customer !== "object"
  ) {
    throw new Error(
      "Customer details are required.",
    );
  }

  for (const field of requiredCustomerFields) {
    if (
      typeof customer[field] !== "string" ||
      !customer[field].trim()
    ) {
      throw new Error(
        `Customer ${field} is required.`,
      );
    }
  }

  /* =========================
     NORMALIZE + VALIDATE ITEMS
  ========================== */

  const seenProductIds = new Set();

  const normalizedItems = items.map(
    (item, index) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        throw new Error(
          `Invalid item at position ${index + 1}.`,
        );
      }

      const productId =
        typeof item.productId === "string"
          ? item.productId.trim()
          : "";

      const quantity = Number(item.quantity);

      if (!productId) {
        throw new Error(
          `Item ${index + 1} is missing productId.`,
        );
      }

      if (seenProductIds.has(productId)) {
        throw new Error(
          `Duplicate product "${productId}" is not allowed.`,
        );
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        throw new Error(
          `Quantity for "${productId}" must be a positive integer.`,
        );
      }

      if (
        quantity > MAX_QUANTITY_PER_ITEM
      ) {
        throw new Error(
          `Quantity for "${productId}" cannot exceed ${MAX_QUANTITY_PER_ITEM}.`,
        );
      }

      seenProductIds.add(productId);

      return {
        productId,
        quantity,
      };
    },
  );

  /* =========================
     FETCH TRUSTED PRODUCTS
     FROM MONGODB
  ========================== */

  const productIds = normalizedItems.map(
    (item) => item.productId,
  );

  const pizzas = await Pizza.find({
    productId: {
      $in: productIds,
    },
    active: true,
  });

  /* =========================
     VERIFY EVERY PRODUCT
     EXISTS
  ========================== */

  const pizzaMap = new Map(
    pizzas.map((pizza) => [
      pizza.productId,
      pizza,
    ]),
  );

  for (const productId of productIds) {
    if (!pizzaMap.has(productId)) {
      throw new Error(
        `Pizza "${productId}" was not found or is unavailable.`,
      );
    }
  }

  /* =========================
     CALCULATE TRUSTED ORDER ITEMS
  ========================== */

  const orderItems = normalizedItems.map(
    (item) => {
      const pizza = pizzaMap.get(
        item.productId,
      );

      /*
        IMPORTANT:
        The price always comes from MongoDB.
        Client-supplied price/total fields
        are never used.
      */
      const unitPrice = pizza.price;

      const lineTotal =
        unitPrice * item.quantity;

      return {
        productId: pizza.productId,
        name: pizza.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    },
  );

  /* =========================
     CALCULATE TRUSTED SUBTOTAL
  ========================== */

  const subtotal = orderItems.reduce(
    (total, item) =>
      total + item.lineTotal,
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
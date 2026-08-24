import Pizza from "../models/Pizza.js";
import Order from "../models/Order.js";

export async function createOrder({
  items,
  customer,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "Order must contain at least one item.",
    );
  }

  /* =========================
     NORMALIZE REQUEST ITEMS
  ========================== */
  const normalizedItems = items.map((item) => ({
    productId: item.productId,
    quantity: Number(item.quantity),
  }));

  /* =========================
     VALIDATE QUANTITIES
  ========================== */
  for (const item of normalizedItems) {
    if (!item.productId) {
      throw new Error(
        "Each order item must have a productId.",
      );
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error(
        "Each item quantity must be a positive integer.",
      );
    }
  }

  /* =========================
     FETCH TRUSTED PRODUCTS
     FROM MONGODB
  ========================== */
  const productIds = normalizedItems.map(
    (item) => item.productId,
  );

  const pizzas = await Pizza.find({
    productId: { $in: productIds },
    active: true,
  });

  /* =========================
     MAKE SURE EVERY PRODUCT
     EXISTS
  ========================== */
  if (pizzas.length !== productIds.length) {
    throw new Error(
      "One or more pizzas could not be found.",
    );
  }

  const pizzaMap = new Map(
    pizzas.map((pizza) => [
      pizza.productId,
      pizza,
    ]),
  );

  /* =========================
     CALCULATE TRUSTED ITEMS
  ========================== */
  const orderItems = normalizedItems.map((item) => {
    const pizza = pizzaMap.get(item.productId);

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
  });

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
    customer,
    subtotal,
  });

  return order;
}
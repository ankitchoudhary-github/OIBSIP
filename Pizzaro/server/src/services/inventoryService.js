import mongoose from "mongoose";
import Order from "../models/Order.js";
import Pizza from "../models/Pizza.js";
import CustomizationOption from "../models/CustomizationOption.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

/**
 * Builds the total inventory usage required for an order.
 *
 * Returns:
 * Map<optionId, totalQuantityRequired>
 */
async function buildInventoryUsage(order) {
  const usage = new Map();

  const addIngredient = (optionId, quantity) => {
    if (!optionId) return;

    const current = usage.get(optionId) || 0;
    usage.set(optionId, current + quantity);
  };

  for (const item of order.items) {
    const itemQuantity = item.quantity;

    // -------------------------
    // MENU PIZZA
    // -------------------------
    if (item.type === "menu") {
      const pizza = await Pizza.findOne({
        productId: item.productId,
        active: true,
      }).lean();

      if (!pizza) {
        throw new Error(
          `Pizza "${item.productId}" could not be found for inventory deduction.`,
        );
      }

      if (!pizza.recipe || pizza.recipe.length === 0) {
        throw new Error(
          `No inventory recipe is configured for "${pizza.name}".`,
        );
      }

      for (const ingredient of pizza.recipe) {
        addIngredient(
          ingredient.optionId,
          ingredient.quantity * itemQuantity,
        );
      }
    }

    // -------------------------
    // CUSTOM PIZZA
    // -------------------------
    if (item.type === "custom") {
      const customization = item.customization;

      if (!customization) {
        throw new Error(
          `Customization data is missing for custom pizza "${item.name}".`,
        );
      }

      // One base per pizza
      addIngredient(customization.baseId, itemQuantity);

      // One sauce per pizza
      addIngredient(customization.sauceId, itemQuantity);

      // One cheese per pizza
      addIngredient(customization.cheeseId, itemQuantity);

      // Multiple vegetables
      for (const vegetableId of customization.vegetableIds || []) {
        addIngredient(vegetableId, itemQuantity);
      }
    }
  }

  return usage;
}

/**
 * Deducts inventory after successful payment.
 *
 * This operation is protected by a MongoDB transaction so that:
 * - stock cannot become negative
 * - partial deductions are rolled back
 * - the same order cannot deduct inventory twice
 */
export async function deductInventoryForOrder(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  if (!mongoose.isValidObjectId(orderId)) {
    throw new Error("Invalid order ID.");
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // -------------------------
      // 1. GET ORDER
      // -------------------------
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw new Error("Order not found.");
      }

      // Inventory must ONLY be deducted after successful payment.
      if (order.payment?.status !== "paid") {
        throw new Error(
          "Inventory can only be deducted after successful payment.",
        );
      }

      // -------------------------
      // 2. IDEMPOTENCY CHECK
      // -------------------------
      const existingTransaction = await InventoryTransaction.findOne({
        orderId: order._id,
        type: "order",
      }).session(session);

      if (existingTransaction) {
        result = {
          alreadyDeducted: true,
          orderId: order._id,
        };

        return;
      }

      // -------------------------
      // 3. CALCULATE USAGE
      // -------------------------
      const usage = await buildInventoryUsage(order);

      if (usage.size === 0) {
        throw new Error(
          "No inventory ingredients were found for this order.",
        );
      }

      const optionIds = [...usage.keys()];

      // -------------------------
      // 4. LOAD INVENTORY ITEMS
      // -------------------------
      const options = await CustomizationOption.find({
        optionId: { $in: optionIds },
        active: true,
      })
        .session(session)
        .lean();

      const optionMap = new Map(
        options.map((option) => [option.optionId, option]),
      );

      // -------------------------
      // 5. VALIDATE ALL INGREDIENTS
      // -------------------------
      for (const [optionId, requiredQuantity] of usage.entries()) {
        const option = optionMap.get(optionId);

        if (!option) {
          throw new Error(
            `Inventory ingredient "${optionId}" was not found or is inactive.`,
          );
        }

        if (option.stock < requiredQuantity) {
          throw new Error(
            `Insufficient stock for "${option.name}". Required: ${requiredQuantity}, available: ${option.stock}.`,
          );
        }
      }

      // -------------------------
      // 6. DEDUCT STOCK
      // -------------------------
      const transactions = [];

      for (const [optionId, requiredQuantity] of usage.entries()) {
        const option = optionMap.get(optionId);

        const updatedOption =
          await CustomizationOption.findOneAndUpdate(
            {
              _id: option._id,
              stock: { $gte: requiredQuantity },
            },
            {
              $inc: {
                stock: -requiredQuantity,
              },
            },
            {
              new: true,
              session,
            },
          ).lean();

        if (!updatedOption) {
          throw new Error(
            `Inventory changed while processing "${option.name}". Please try again.`,
          );
        }

        // quantityDelta is negative because stock is being consumed.
        transactions.push({
          ingredientId: option._id,
          quantityDelta: -requiredQuantity,
          type: "order",
          reason: `Inventory used for order ${order._id}`,
          orderId: order._id,
          actor: "system",
        });
      }

      // -------------------------
      // 7. RECORD TRANSACTIONS
      // -------------------------
      await InventoryTransaction.insertMany(transactions, {
        session,
      });

      result = {
        alreadyDeducted: false,
        orderId: order._id,
        ingredientsDeducted: transactions.length,
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
}
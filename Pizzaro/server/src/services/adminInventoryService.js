import mongoose from "mongoose";
import CustomizationOption from "../models/CustomizationOption.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

/**
 * Get inventory items for the admin dashboard.
 *
 * Optional filters:
 * - type: base | sauce | cheese | vegetable
 * - lowStock: true
 */
export async function getInventoryItems({ type, lowStock } = {}) {
  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (lowStock === true) {
    filter.$expr = {
      $lte: ["$stock", "$threshold"],
    };
  }

  return CustomizationOption.find(filter)
    .sort({ type: 1, name: 1 })
    .lean();
}

/**
 * Get only items that are at or below their low-stock threshold.
 */
export async function getLowStockItems() {
  return CustomizationOption.find({
    $expr: {
      $lte: ["$stock", "$threshold"],
    },
    active: true,
  })
    .sort({ stock: 1, name: 1 })
    .lean();
}

/**
 * Manually increase or decrease stock.
 *
 * quantityDelta:
 *   +10 = add 10 units
 *   -5  = remove 5 units
 *
 * Every manual change creates an InventoryTransaction.
 */
export async function updateInventoryStock({
  optionId,
  quantityDelta,
  reason,
  actor = "admin",
}) {
  if (!optionId) {
    throw new Error("Inventory option ID is required.");
  }

  if (
    !Number.isInteger(quantityDelta) ||
    quantityDelta === 0
  ) {
    throw new Error(
      "Quantity delta must be a non-zero integer.",
    );
  }

  if (!reason || !reason.trim()) {
    throw new Error("A reason is required for stock adjustment.");
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const option = await CustomizationOption.findOne({
        optionId,
        active: true,
      }).session(session);

      if (!option) {
        throw new Error(
          `Inventory item "${optionId}" was not found.`,
        );
      }

      const newStock = option.stock + quantityDelta;

      if (newStock < 0) {
        throw new Error(
          `Stock cannot go below zero for "${option.name}". Available: ${option.stock}.`,
        );
      }

      option.stock = newStock;

      await option.save({ session });

      const transaction = await InventoryTransaction.create(
        [
          {
            ingredientId: option._id,
            quantityDelta,
            type: "manual",
            reason: reason.trim(),
            orderId: null,
            actor,
          },
        ],
        { session },
      );

      result = {
        item: option.toObject(),
        transaction: transaction[0],
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
}
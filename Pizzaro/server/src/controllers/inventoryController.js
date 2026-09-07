import {
  getInventoryItems,
  getLowStockItems,
  updateInventoryStock,
} from "../services/adminInventoryService.js";

export async function getInventoryController(req, res) {
  try {
    const { type, lowStock } = req.query;

    const inventory = await getInventoryItems({
      type,
      lowStock: lowStock === "true",
    });

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getLowStockController(req, res) {
  try {
    const inventory = await getLowStockItems();

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get low stock error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateInventoryController(req, res) {
  try {
    const { optionId } = req.params;
    const { quantityDelta, reason } = req.body;

    const result = await updateInventoryStock({
      optionId,
      quantityDelta,
      reason,
      actor: "admin",
    });

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully.",
      item: result.item,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error("Update inventory error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
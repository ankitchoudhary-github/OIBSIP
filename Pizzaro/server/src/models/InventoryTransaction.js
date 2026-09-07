import mongoose from "mongoose";

const inventoryTransactionSchema =
  new mongoose.Schema(
    {
      ingredientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomizationOption",
        required: true,
      },

      quantityDelta: {
        type: Number,
        required: true,
        validate: {
          validator: (value) => value !== 0,
          message:
            "Quantity delta cannot be zero.",
        },
      },

      type: {
        type: String,
        enum: [
          "order",
          "manual",
          "adjustment",
        ],
        required: true,
      },

      reason: {
        type: String,
        trim: true,
        required: true,
      },

      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
      },

      actor: {
        type: String,
        trim: true,
        default: "system",
      },
    },
    {
      timestamps: true,
    },
  );

const InventoryTransaction =
  mongoose.model(
    "InventoryTransaction",
    inventoryTransactionSchema,
  );

export default InventoryTransaction;
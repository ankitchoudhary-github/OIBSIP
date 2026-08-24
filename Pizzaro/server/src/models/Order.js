import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema(
  {
    baseId: {
      type: String,
      default: null,
    },

    sauceId: {
      type: String,
      default: null,
    },

    cheeseId: {
      type: String,
      default: null,
    },

    vegetableIds: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const orderItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["menu", "custom"],
      required: true,
    },

    /*
      Used for normal menu pizzas.
      Custom pizzas do not use this field.
    */
    productId: {
      type: String,
      default: null,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    /*
      Custom pizza configuration snapshot.
    */
    customization: {
      type: customizationSchema,
      default: null,
    },

    /*
      Trusted price captured at order creation.
    */
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      provider: {
        type: String,
        enum: ["razorpay", null],
        default: null,
      },

      razorpayOrderId: {            //orderID to razorpayOrderId
        type: String,
        default: null,
      },

      paymentId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
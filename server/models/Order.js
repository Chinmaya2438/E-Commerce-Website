import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { 
        type: String, 
        required: [true, "State is required"],
        validate: {
          validator: function(v) {
            return v && v.trim() !== "Choose a state" && v.trim().toLowerCase() !== "select state";
          },
          message: "Please select a valid state"
        }
      },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentResult: {
      stripe_session_id: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

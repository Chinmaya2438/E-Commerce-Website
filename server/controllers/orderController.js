import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image?.url || "",
    }));

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

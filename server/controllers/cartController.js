import Cart from "../models/Cart.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    if (!cart) {
      cart = { items: [] };
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/cart/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image stock"
    );

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

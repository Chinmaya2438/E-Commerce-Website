import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCart as fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const { data } = await fetchCart();
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await apiAddToCart({ productId, quantity });
      setCart(data);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await apiUpdateCartItem(itemId, { quantity });
      setCart(data);
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await apiRemoveCartItem(itemId);
      setCart(data);
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCartLocal = () => {
    setCart({ items: [] });
  };

  const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const cartTotal =
    cart.items?.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCartLocal,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

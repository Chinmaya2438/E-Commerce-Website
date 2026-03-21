import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiOutlineTrash, HiMinus, HiPlus, HiOutlineShoppingBag } from "react-icons/hi";

const CartPage = () => {
  const { cart, loading, cartTotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner size="lg" />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <HiOutlineShoppingBag className="w-20 h-20 text-dark-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Your cart is empty</h2>
        <p className="text-dark-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card p-4 sm:p-6 flex gap-4">
              <Link
                to={`/products/${item.product?._id}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-dark-50"
              >
                <img
                  src={item.product?.image?.url || "https://via.placeholder.com/96"}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product?._id}`}
                  className="font-semibold text-dark-900 text-sm sm:text-base hover:text-primary-600 transition-colors line-clamp-2"
                >
                  {item.product?.name}
                </Link>
                <p className="text-lg font-bold text-dark-900 mt-1">
                  ₹{item.product?.price?.toLocaleString()}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-dark-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="p-1.5 hover:bg-dark-50 disabled:opacity-50 rounded-l-lg"
                    >
                      <HiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      disabled={item.quantity >= (item.product?.stock || 10)}
                      className="p-1.5 hover:bg-dark-50 disabled:opacity-50 rounded-r-lg"
                    >
                      <HiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:text-red-600 p-1.5 transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h3 className="text-lg font-semibold text-dark-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-dark-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-dark-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-dark-100 pt-3 flex justify-between text-base font-bold text-dark-900">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full btn-primary py-3 mt-6"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/products"
              className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, createStripeSession } from "../services/api";
import toast from "react-hot-toast";
import { HiOutlineTruck } from "react-icons/hi";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCartLocal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Create our internal DB Order flagged as unpaid
      const { data: dbOrder } = await createOrder({ shippingAddress: form });

      // Step 2: Simulate Payment Gateway Loading Overlay Delay
      toast.loading("Connecting to Mock Payment Gateway...", { duration: 1500 });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Step 3: Send Secure Mock Transaction ID
      toast.loading("Processing Mock Transaction...", { duration: 1500 });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mock_transaction_id = "mock_tx_" + Math.random().toString(36).substr(2, 9);
      
      // Step 4: Clear cart and redirect browser with simulated Stripe webhook params!
      clearCartLocal();
      window.location.href = `/orders?session_id=${mock_transaction_id}&order_id=${dbOrder._id}`;
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initialize payment gateway");
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                <HiOutlineTruck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-dark-900">
                Shipping Information
              </h2>
            </div>

            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h3 className="text-lg font-semibold text-dark-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 text-sm">
                  <img
                    src={item.product?.image?.url || "https://via.placeholder.com/48"}
                    alt={item.product?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 truncate">
                      {item.product?.name}
                    </p>
                    <p className="text-dark-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-dark-900">
                    ₹{(item.product?.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-dark-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-dark-600">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-dark-600">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="border-t border-dark-100 pt-2 flex justify-between text-base font-bold text-dark-900">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full btn-primary py-3 mt-6 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? "Processing Securely..." : "Simulate Secure Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

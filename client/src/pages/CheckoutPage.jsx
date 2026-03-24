import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, createStripeSession, applyCoupon } from "../services/api";
import toast from "react-hot-toast";
import { HiOutlineTruck } from "react-icons/hi";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCartLocal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { user } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState("");
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

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        const { fullName, address, city, state, zipCode, phone } = defaultAddr;
        setForm({ fullName, address, city, state, zipCode, phone });
      }
    }
  }, [user]);

  const handleAddressSelect = (e) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (!id) {
      setForm({ fullName: "", address: "", city: "", state: "", zipCode: "", phone: "" });
      return;
    }
    const addr = user.addresses.find((a) => a._id === id);
    if (addr) {
      const { fullName, address, city, state, zipCode, phone } = addr;
      setForm({ fullName, address, city, state, zipCode, phone });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      const { data } = await applyCoupon({ code: couponCode });
      setAppliedCoupon(data);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const getFinalTotal = () => {
    let total = cartTotal;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        total = total - (total * appliedCoupon.discountValue) / 100;
      } else {
        total = Math.max(0, total - appliedCoupon.discountValue);
      }
    }
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Create our internal DB Order flagged as unpaid
      const { data: dbOrder } = await createOrder({ 
        shippingAddress: form,
        couponCode: appliedCoupon?.code
      });

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

            {user?.addresses?.length > 0 && (
              <div className="mb-6 bg-dark-50 p-4 rounded-lg border border-dark-100">
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Quick Select Saved Address
                </label>
                <select 
                  value={selectedAddressId} 
                  onChange={handleAddressSelect}
                  className="input-field py-2.5 text-sm cursor-pointer"
                >
                  <option value="">-- Enter a new custom address --</option>
                  {user.addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.title} - {addr.address}, {addr.city} {addr.isDefault ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

              {/* Coupon Section */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="input-field py-2 text-sm"
                    disabled={appliedCoupon !== null}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode}
                      className="px-4 py-2 bg-dark-900 text-white rounded-lg text-sm font-semibold hover:bg-dark-800 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 mt-2 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>
                      -₹{appliedCoupon.discountType === "percentage" 
                        ? ((cartTotal * appliedCoupon.discountValue) / 100).toLocaleString() 
                        : appliedCoupon.discountValue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-dark-100 pt-3 flex justify-between text-base font-bold text-dark-900">
                <span>Total</span>
                <span>₹{getFinalTotal().toLocaleString()}</span>
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

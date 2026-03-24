import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getMyOrders, cancelOrder, verifyStripeSession, getInvoice } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiOutlineClipboardList } from "react-icons/hi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    if (sessionId && orderId) {
      const verifyPayment = async () => {
        try {
          toast.loading("Verifying your secure payment...", { id: "verify" });
          await verifyStripeSession({ session_id: sessionId, orderId });
          toast.success("Payment verified successfully! Your order is confirmed.", { id: "verify" });
        } catch (error) {
          toast.error("Payment verification failed or was incomplete.", { id: "verify" });
        } finally {
          setSearchParams({}); // Clean URL params so it doesn't re-trigger
          fetchOrders();
        }
      };
      verifyPayment();
    } else {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to cancel order");
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      toast.loading("Generating your secure PDF...", { id: "pdf" });
      const { data } = await getInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success("PDF Invoice successfully retrieved!", { id: "pdf" });
    } catch (error) {
      toast.error("Failed to mathematically generate the PDF document.", { id: "pdf" });
    }
  };

  const statusColor = {
    pending: "badge-pending",
    shipped: "badge-shipped",
    delivered: "badge-delivered",
    cancelled: "badge bg-red-100 text-red-700",
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineClipboardList className="w-20 h-20 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-900 mb-2">No orders yet</h2>
          <p className="text-dark-500">Your order history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card overflow-hidden">
              {/* Header */}
              <div className="bg-dark-50 px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex flex-wrap gap-4 sm:gap-8">
                  <div>
                    <span className="text-dark-500 block">Order ID</span>
                    <span className="font-medium text-dark-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-500 block">Date</span>
                    <span className="font-medium text-dark-900">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-500 block">Total</span>
                    <span className="font-bold text-dark-900">
                      ₹{order.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusColor[order.status] || "badge"}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                  {order.status === "pending" && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-1 bg-red-50 px-2 py-1 rounded shadow-sm border border-red-100"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status !== "cancelled" && (
                    <button 
                      onClick={() => handleDownloadInvoice(order._id)}
                      className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors ml-2 bg-primary-50 px-3 py-1 rounded shadow-sm border border-primary-100 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Get PDF Receipt
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="p-6 space-y-3">
                {order.items.map((item, i) => (
                  <Link
                    to={`/products/${item.product}`}
                    key={i}
                    className="flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-dark-50/50 transition-colors"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/64"}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-dark-50"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 text-sm hover:text-primary-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-dark-500">
                        ₹{item.price?.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-dark-900 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Order Summary */}
              <div className="px-6 py-4 border-t border-dark-100 bg-dark-50 flex justify-end">
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-dark-600 text-sm">
                    <span>Subtotal:</span>
                    <span>₹{(order.totalPrice + (order.discountAmount || 0)).toLocaleString()}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 text-sm font-medium">
                      <span>Discount ({order.couponCode}):</span>
                      <span>-₹{order.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-dark-900 font-bold text-lg border-t border-dark-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>₹{order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="border-t border-dark-100 px-6 py-4 text-sm text-dark-600">
                <span className="font-medium text-dark-900">Ship to: </span>
                {order.shippingAddress?.fullName}, {order.shippingAddress?.address},{" "}
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.zipCode}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

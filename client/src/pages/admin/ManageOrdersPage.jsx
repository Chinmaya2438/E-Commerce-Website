import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiOutlineClipboardList } from "react-icons/hi";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: data.status } : o))
      );
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">
        Manage Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineClipboardList className="w-20 h-20 text-dark-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-dark-900 mb-2">No orders yet</h2>
          <p className="text-dark-500">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card overflow-hidden">
              <div className="bg-dark-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-4 sm:gap-8 text-sm">
                  <div>
                    <span className="text-dark-500 block">Order</span>
                    <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-dark-500 block">Customer</span>
                    <span className="font-medium">{order.user?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-dark-500 block">Email</span>
                    <span className="font-medium">{order.user?.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-dark-500 block">Total</span>
                    <span className="font-bold block">₹{order.totalPrice?.toLocaleString()}</span>
                    {order.discountAmount > 0 && (
                      <span className="text-xs text-emerald-600 block mt-0.5 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
                        Coupon: -₹{order.discountAmount.toLocaleString()} ({order.couponCode})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-dark-500 block">Date</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={statusColor[order.status] || "badge"}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="input-field py-1.5 px-3 text-sm w-auto"
                    disabled={order.status === "cancelled"}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <Link
                      to={`/products/${item.product}`}
                      key={i}
                      className="flex items-center gap-3 text-sm p-2 -mx-2 rounded-lg hover:bg-dark-50/50 transition-colors"
                    >
                      <img
                        src={item.image || "https://via.placeholder.com/48"}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover bg-dark-50"
                      />
                      <span className="flex-1 text-dark-700 hover:text-primary-600 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-dark-500">×{item.quantity}</span>
                      <span className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-dark-100 text-sm text-dark-600">
                  <span className="font-medium text-dark-900">Ship to: </span>
                  {order.shippingAddress?.fullName}, {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.zipCode} — {order.shippingAddress?.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getAllOrders } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlinePlus,
} from "react-icons/hi";

const DashboardPage = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          getProducts({ limit: 1 }),
          getAllOrders(),
        ]);
        const orders = ordersRes.data;
        const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

        setStats({
          products: productsRes.data.total,
          orders: orders.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const statusColor = {
    pending: "badge-pending",
    shipped: "badge-shipped",
    delivered: "badge-delivered",
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">
          Admin Dashboard
        </h1>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <HiOutlineShoppingBag className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-dark-500">Total Products</p>
              <p className="text-2xl font-bold text-dark-900">{stats.products}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
              <HiOutlineClipboardList className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-dark-500">Total Orders</p>
              <p className="text-2xl font-bold text-dark-900">{stats.orders}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <HiOutlineCurrencyRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-dark-500">Total Revenue</p>
              <p className="text-2xl font-bold text-dark-900">
                ₹{stats.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Link to="/admin/products/add" className="card p-4 text-center hover:border-primary-200 group">
          <span className="text-2xl mb-2 block">➕</span>
          <span className="text-sm font-medium text-dark-700 group-hover:text-primary-600">Add Product</span>
        </Link>
        <Link to="/products" className="card p-4 text-center hover:border-primary-200 group">
          <span className="text-2xl mb-2 block">📦</span>
          <span className="text-sm font-medium text-dark-700 group-hover:text-primary-600">View Products</span>
        </Link>
        <Link to="/admin/orders" className="card p-4 text-center hover:border-primary-200 group">
          <span className="text-2xl mb-2 block">📋</span>
          <span className="text-sm font-medium text-dark-700 group-hover:text-primary-600">Manage Orders</span>
        </Link>
        <Link to="/" className="card p-4 text-center hover:border-primary-200 group">
          <span className="text-2xl mb-2 block">🏠</span>
          <span className="text-sm font-medium text-dark-700 group-hover:text-primary-600">View Store</span>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-100 flex items-center justify-between">
          <h2 className="font-semibold text-dark-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-dark-600">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium text-dark-600">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-dark-600">Total</th>
                  <th className="text-left px-6 py-3 font-medium text-dark-600">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-dark-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-dark-50">
                    <td className="px-6 py-3 font-medium">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-dark-600">
                      {order.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      ₹{order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <span className={statusColor[order.status] || "badge"}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-dark-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-dark-500">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

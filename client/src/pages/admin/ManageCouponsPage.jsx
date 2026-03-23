import { useState, useEffect } from "react";
import { getCoupons, createCoupon, deleteCoupon } from "../../services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiOutlineTrash, HiOutlineTicket, HiOutlinePlus } from "react-icons/hi";

const ManageCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiresAt: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createCoupon(form);
      setCoupons([data, ...coupons]);
      setForm({ code: "", discountType: "percentage", discountValue: "", expiresAt: "" });
      toast.success("Coupon created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this coupon forever?")) {
      try {
        await deleteCoupon(id);
        setCoupons(coupons.filter((c) => c._id !== id));
        toast.success("Coupon deleted");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete coupon");
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineTicket className="w-8 h-8 text-primary-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">Manage Coupons</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-dark-900 mb-6 flex items-center gap-2">
              <HiOutlinePlus /> Create New Coupon
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="input-field"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={form.discountType === "percentage" ? "100" : undefined}
                  placeholder="e.g. 20"
                  value={form.discountValue}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (form.discountType === "percentage" && Number(val) > 100) val = "100";
                    if (Number(val) < 0) val = "0";
                    setForm({ ...form, discountValue: val });
                  }}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="input-field"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-2.5">
                Generate Coupon
              </button>
            </form>
          </div>
        </div>

        {/* Coupons List */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-dark-700">Code</th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-700">Discount</th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-700">Expires</th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-700">Status</th>
                    <th className="text-right px-6 py-4 font-semibold text-dark-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiresAt) < new Date();
                    return (
                      <tr key={coupon._id} className="hover:bg-dark-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-dark-900">{coupon.code}</td>
                        <td className="px-6 py-4 font-medium text-primary-600">
                          {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                        </td>
                        <td className="px-6 py-4 text-dark-600">
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${isExpired ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-dark-500">
                        No coupons generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCouponsPage;

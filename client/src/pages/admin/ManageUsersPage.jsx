import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiOutlineTrash, HiOutlineUserGroup } from "react-icons/hi";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineUserGroup className="w-8 h-8 text-primary-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">Manage Users</h1>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-dark-700">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-dark-700">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-dark-700">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-dark-700">Join Date</th>
                <th className="text-right px-6 py-4 font-semibold text-dark-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark-900">{user.name}</td>
                  <td className="px-6 py-4 text-dark-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-dark-100 text-dark-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-500">
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete User"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-dark-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;

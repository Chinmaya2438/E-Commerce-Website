import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { 
  HiOutlineUser, 
  HiOutlineShieldCheck, 
  HiOutlineMap,
  HiOutlineCamera,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlinePlus,
  HiOutlineCheckCircle
} from "react-icons/hi";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const ProfilePage = () => {
  const { user, setUser } = useAuth(); 
  const [activeTab, setActiveTab] = useState("details");
  
  if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">My Profile</h1>
        <p className="text-dark-500">Manage your account details and settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="card p-2 space-y-1 sticky top-24">
            <button
              onClick={() => setActiveTab("details")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "details" ? "bg-primary-50 text-primary-700" : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
              }`}
            >
              <HiOutlineUser className="w-5 h-5" /> Account Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "security" ? "bg-primary-50 text-primary-700" : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
              }`}
            >
              <HiOutlineShieldCheck className="w-5 h-5" /> Security
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "addresses" ? "bg-primary-50 text-primary-700" : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
              }`}
            >
              <HiOutlineMap className="w-5 h-5" /> Address Book
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === "details" && <ProfileDetails user={user} setUser={setUser} />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "addresses" && <AddressBook user={user} setUser={setUser} />}
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const ProfileDetails = ({ user, setUser }) => {
  const [name, setName] = useState(user.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(user.profilePicture || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app we would upload the base64 previewImage to cloudinary via backend or frontend directly.
      // Here, keeping it simple: pass the base64 string to be saved in DB / Cloudinary.
      const { data } = await updateProfile({ name, profilePicture: previewImage });
      
      // Update local context
      setUser({ ...user, ...data });
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8 animate-fade-in">
      <h2 className="text-xl font-bold text-dark-900 mb-6">Account Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden hero-gradient flex items-center justify-center border-4 border-white shadow-md">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-white font-bold">{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
            >
              <HiOutlineCamera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="text-sm text-dark-500">
            <p className="font-medium text-dark-900">Profile Picture</p>
            <p>JPG, GIF or PNG. 2MB max.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input-field bg-dark-50 text-dark-500 cursor-not-allowed"
            />
            <p className="text-xs text-dark-400 mt-1">Email cannot be changed directly for security reasons.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full sm:w-auto"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8 animate-fade-in">
      <h2 className="text-xl font-bold text-dark-900 mb-6">Security Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full sm:w-auto mt-4"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

const AddressBook = ({ user, setUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    title: "", fullName: "", address: "", city: "", state: "", zipCode: "", phone: "", isDefault: false
  };
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addresses = user.addresses || [];

  const handleOpenModal = (address = null) => {
    if (address) {
      setFormData(address);
      setEditingId(address._id);
    } else {
      setFormData(initialForm);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const updateLocalUser = (updatedAddresses) => {
    setUser({ ...user, addresses: updatedAddresses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let data;
      if (editingId) {
        const res = await updateAddress(editingId, formData);
        data = res.data;
        toast.success("Address updated");
      } else {
        const res = await addAddress(formData);
        data = res.data;
        toast.success("Address added");
      }
      updateLocalUser(data);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const { data } = await deleteAddress(id);
      updateLocalUser(data);
      toast.success("Address deleted");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data } = await setDefaultAddress(id);
      updateLocalUser(data);
      toast.success("Default address updated");
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-dark-900">Address Book</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary py-2 text-sm flex items-center gap-1">
          <HiOutlinePlus className="w-4 h-4" /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card p-10 text-center border-dashed border-2 border-dark-200 bg-transparent shadow-none">
          <HiOutlineMap className="w-12 h-12 text-dark-300 mx-auto mb-3" />
          <h3 className="text-dark-900 font-medium mb-1">No addresses saved</h3>
          <p className="text-dark-500 text-sm">Add a shipping address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div key={address._id} className={`card p-5 border-2 transition-all ${address.isDefault ? 'border-primary-500' : 'border-transparent'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-dark-900">{address.title}</span>
                  {address.isDefault && (
                    <span className="bg-primary-100 text-primary-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenModal(address)} className="p-1.5 text-dark-400 hover:text-primary-600 transition-colors bg-dark-50 rounded-md" title="Edit">
                    <HiOutlinePencilAlt className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(address._id)} className="p-1.5 text-dark-400 hover:text-red-500 transition-colors bg-dark-50 rounded-md" title="Delete">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-dark-600 space-y-1">
                <p className="font-medium text-dark-900">{address.fullName}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>Phone: {address.phone}</p>
              </div>

              {!address.isDefault && (
                <button 
                  onClick={() => handleSetDefault(address._id)}
                  className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <HiOutlineCheckCircle className="w-4 h-4" /> Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-dark-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-dark-900">{editingId ? "Edit Address" : "Add New Address"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-dark-400 hover:text-dark-900">
                <HiOutlineTrash className="w-5 h-5 hidden" /> {/* Placeholder for close X which normally id HiOutlineX */}
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-dark-700 mb-1">Address Label (e.g. Home, Work)</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="input-field py-2 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-dark-700 mb-1">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required className="input-field py-2 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-dark-700 mb-1">Street Address</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-700 mb-1">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-700 mb-1">State</label>
                  <select 
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value})} 
                    required 
                    className="input-field py-2 text-sm cursor-pointer"
                  >
                    <option value="">Choose a state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-700 mb-1">Zip Code</label>
                  <input type="text" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} required className="input-field py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-700 mb-1">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="input-field py-2 text-sm" />
                </div>
                <div className="sm:col-span-2 flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    checked={formData.isDefault}
                    onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                    className="w-4 h-4 text-primary-600 bg-dark-50 border-dark-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-dark-700">Set as default shipping address</label>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn hover:bg-dark-100 py-2">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary py-2">{isSubmitting ? "Saving..." : "Save Address"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

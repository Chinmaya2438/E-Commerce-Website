import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "../../services/api";
import toast from "react-hot-toast";
import { HiOutlinePhotograph } from "react-icons/hi";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    ratings: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) formData.append("image", imageFile);

      await createProduct(formData);
      toast.success("Product created successfully!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">
        Add New Product
      </h1>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 border-2 border-dashed border-dark-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div>
                    <HiOutlinePhotograph className="w-10 h-10 text-dark-400 mx-auto mb-2" />
                    <p className="text-sm text-dark-500">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-dark-400 mt-1">
                      JPG, PNG, WebP (max 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Bluetooth Headphones"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product features, materials, etc."
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="999"
                min="0"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                min="0"
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Electronics, Fashion, etc."
                list="categories-list"
                className="input-field"
                required
              />
              <datalist id="categories-list">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="ratings"
                value={form.ratings}
                onChange={handleChange}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="btn-outline flex-1 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const changePassword = (data) => API.put("/auth/password", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (token, data) => API.put(`/auth/reset-password/${token}`, data);
export const getAllUsers = () => API.get("/auth/users");
export const deleteUser = (id) => API.delete(`/auth/users/${id}`);

// Addresses
export const addAddress = (data) => API.post("/auth/addresses", data);
export const updateAddress = (id, data) => API.put(`/auth/addresses/${id}`, data);
export const deleteAddress = (id) => API.delete(`/auth/addresses/${id}`);
export const setDefaultAddress = (id) => API.put(`/auth/addresses/${id}/default`);

// Products
export const getProducts = (params) => API.get("/products", { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get("/products/categories");
export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createProductReview = (id, data) => API.post(`/products/${id}/reviews`, data);

// Cart
export const getCart = () => API.get("/cart");
export const addToCart = (data) => API.post("/cart", data);
export const updateCartItem = (itemId, data) => API.put(`/cart/${itemId}`, data);
export const removeCartItem = (itemId) => API.delete(`/cart/${itemId}`);

// Orders
export const createOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/my");
export const getAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}`, data);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);
export const getInvoice = (id) => API.get(`/orders/${id}/invoice`, { responseType: "blob" });

// Payment
export const createStripeSession = (data) => API.post("/payment/create-session", data);
export const verifyStripeSession = (data) => API.post("/payment/verify-session", data);

// Coupons
export const getCoupons = () => API.get("/coupons");
export const createCoupon = (data) => API.post("/coupons", data);
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);
export const applyCoupon = (data) => API.post("/coupons/apply", data);

export default API;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";

// Admin Pages
import DashboardPage from "./pages/admin/DashboardPage";
import AddProductPage from "./pages/admin/AddProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageCouponsPage from "./pages/admin/ManageCouponsPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-dark-50">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />

                  {/* Protected */}
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

                  {/* Admin */}
                  <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
                  <Route path="/admin/products/add" element={<AdminRoute><AddProductPage /></AdminRoute>} />
                  <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProductPage /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><ManageOrdersPage /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />
                  <Route path="/admin/coupons" element={<AdminRoute><ManageCouponsPage /></AdminRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#212529",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

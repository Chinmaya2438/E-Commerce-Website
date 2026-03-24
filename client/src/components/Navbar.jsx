import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineViewGrid,
} from "react-icons/hi";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="text-xl font-bold text-dark-900 hidden sm:block">
              Shop<span className="text-primary-600">Verse</span>
            </span>
          </Link>

          {/* Search Bar — Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-lg mx-8"
          >
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-dark-200 bg-dark-50 text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {!isAdmin && (
              <>
                <Link
                  to="/wishlist"
                  className="p-2 rounded-full hover:bg-dark-100 transition-colors relative"
                  title="Wishlist"
                >
                  <HiOutlineHeart className="w-5 h-5 text-dark-700" />
                </Link>

                <Link
                  to="/cart"
                  className="p-2 rounded-full hover:bg-dark-100 transition-colors relative"
                  title="Cart"
                >
                  <HiOutlineShoppingCart className="w-5 h-5 text-dark-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-fade-in">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-dark-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full hero-gradient flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-dark-100 py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2 border-b border-dark-100">
                        <p className="text-sm font-semibold text-dark-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-dark-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-dark-700 hover:bg-dark-50 transition-colors"
                      >
                        <HiOutlineUser className="w-4 h-4 mr-2" />
                        My Profile
                      </Link>
                      {!isAdmin && (
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-dark-700 hover:bg-dark-50 transition-colors"
                        >
                          <HiOutlineViewGrid className="w-4 h-4 mr-2" />
                          My Orders
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <HiOutlineViewGrid className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          navigate("/");
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <HiOutlineLogout className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 btn-primary text-sm py-2 px-4"
              >
                <HiOutlineUser className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-dark-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <HiOutlineX className="w-5 h-5" />
              ) : (
                <HiOutlineMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-100 py-4 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-dark-200 bg-dark-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <div className="space-y-1">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-dark-700 hover:bg-dark-100 transition-colors"
              >
                All Products
              </Link>
              {!isAdmin && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-dark-700 hover:bg-dark-100 transition-colors"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-dark-700 hover:bg-dark-100 transition-colors"
                  >
                    Cart ({cartCount})
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

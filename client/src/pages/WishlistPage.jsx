import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { HiOutlineHeart, HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(productId);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <HiOutlineHeart className="w-20 h-20 text-dark-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-dark-900 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-dark-500 mb-6">
          Save items you love for later.
        </p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-8">
        My Wishlist ({wishlist.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="card group">
            <Link
              to={`/products/${product._id}`}
              className="block overflow-hidden aspect-square bg-dark-50"
            >
              <img
                src={product.image?.url || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="p-4">
              <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-1">
                {product.category}
              </p>
              <h3 className="font-semibold text-dark-900 text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-dark-900 mb-3">
                ₹{product.price?.toLocaleString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
                >
                  <HiOutlineShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="p-2 border border-dark-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart, HiOutlineStar } from "react-icons/hi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const wishlisted = isInWishlist(product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} className="card group">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-dark-50">
        <img
          src={product.image?.url || "https://via.placeholder.com/400x400?text=Product"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x400?text=Product";
          }}
        />
        {!isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlistToggle(e);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10"
          >
            {wishlisted ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-dark-600" />
            )}
          </button>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-dark-900 text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-dark-900">
            ₹{product.price?.toLocaleString()}
          </span>
          <div className="flex items-center space-x-1 text-amber-500">
            <HiOutlineStar className="w-4 h-4 fill-current" />
            <span className="text-xs font-medium text-dark-600">
              {product.ratings || 0}
            </span>
          </div>
        </div>
        {!isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(e);
            }}
            disabled={product.stock === 0}
            className="w-full btn-primary text-sm py-2 disabled:opacity-50 mt-auto"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        )}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/admin/products/edit/${product._id}`);
            }}
            className="w-full border border-dark-200 bg-white text-dark-900 hover:bg-dark-50 font-bold text-sm py-2 mt-auto rounded-xl transition-all"
          >
            Manage Product
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

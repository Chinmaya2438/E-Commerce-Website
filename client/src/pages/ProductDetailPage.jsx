import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, createProductReview, getProducts } from "../services/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  HiOutlineStar,
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingCart,
  HiMinus,
  HiPlus,
  HiOutlineArrowLeft,
} from "react-icons/hi";
import ProductCard from "../components/ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);
      if (data.category) {
        const related = await getProducts({ category: data.category, limit: 5 });
        if (related.data && related.data.products) {
          setRelatedProducts(
            related.data.products.filter((p) => p._id !== data._id).slice(0, 4)
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProduct();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await createProductReview(id, { rating, comment });
      toast.success("Review submitted successfully");
      setRating(5);
      setComment("");
      fetchProduct(); // refresh product to get new reviews
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product._id, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-dark-100 rounded-full mb-6 text-4xl shadow-sm">
          📦
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-3">
          Currently Unavailable
        </h2>
        <p className="text-dark-500 text-lg mb-8 max-w-lg mx-auto">
          We're sorry, this product is currently out of stock or has been retired from our active catalog. 
        </p>
        <button 
          onClick={() => navigate("/products")} 
          className="btn-primary shadow-md hover:shadow-lg transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-dark-500 hover:text-dark-700 mb-6 text-sm transition-colors"
      >
        <HiOutlineArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="card overflow-hidden">
          <div className="aspect-square bg-dark-50">
            <img
              src={product.image?.url || "https://via.placeholder.com/600x600?text=Product"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600x600?text=Product";
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-sm text-primary-600 font-medium uppercase tracking-wider mb-2">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <HiOutlineStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.ratings)
                      ? "text-amber-400 fill-current"
                      : "text-dark-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-dark-500">
              ({product.ratings} rating)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-dark-900">
              ₹{product.price?.toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-dark-700 mb-2">
              Description
            </h3>
            <p className="text-dark-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="badge bg-emerald-100 text-emerald-700">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="badge bg-red-100 text-red-700">
                ✕ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity + Actions */}
          {product.stock > 0 && !isAdmin && (
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-dark-200 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-dark-50 transition-colors rounded-l-lg"
                >
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 text-sm font-semibold min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="p-2.5 hover:bg-dark-50 transition-colors rounded-r-lg"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="flex flex-wrap gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
              >
                <HiOutlineShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg border-2 transition-all ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-dark-200 text-dark-600 hover:border-red-200 hover:text-red-500"
                }`}
              >
                {wishlisted ? (
                  <HiHeart className="w-5 h-5" />
                ) : (
                  <HiOutlineHeart className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
          
          {isAdmin && (
            <div className="mt-auto pt-6">
              <button
                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                className="w-full border-2 border-dark-200 bg-white text-dark-900 hover:bg-dark-50 font-bold py-3 rounded-xl transition-all shadow-sm"
              >
                Manage Product Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 lg:mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-8">
          Customer Reviews ({product.numReviews || 0})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews?.length === 0 ? (
              <div className="bg-dark-50 rounded-xl p-6 text-center text-dark-500">
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              product.reviews?.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-dark-900">{review.name}</h4>
                    <span className="text-xs text-dark-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-amber-400 fill-current"
                            : "text-dark-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-dark-600 text-sm whitespace-pre-line">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review */}
          <div>
            <div className="card p-6 sm:p-8 sticky top-24">
              <h3 className="text-lg font-bold text-dark-900 mb-4">
                Write a Review
              </h3>
              {user ? (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="input-field py-2.5"
                      required
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="input-field resize-none"
                      placeholder="Share your experience with this product..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="btn-primary w-full py-3"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="bg-primary-50 text-primary-900 p-4 rounded-xl text-sm">
                  Please{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="font-bold underline hover:text-primary-700"
                  >
                    sign in
                  </button>{" "}
                  to write a review.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- You May Also Like Engine --- */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-dark-100 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

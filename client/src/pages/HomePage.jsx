import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  HiOutlineArrowRight,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineSupport,
} from "react-icons/hi";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({ limit: 8, sort: "newest" }),
          getCategories(),
        ]);
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const features = [
    { icon: HiOutlineTruck, title: "Free Shipping", desc: "On orders above ₹499" },
    { icon: HiOutlineShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: HiOutlineSupport, title: "24/7 Support", desc: "Dedicated customer care" },
    { icon: HiOutlineShoppingBag, title: "Easy Returns", desc: "30-day return policy" },
  ];

  const categoryIconMap = {
    "Books & Stationery": "📚",
    "Electronics": "🖥️",
    "Fashion": "👗",
    "Home & Lifestyle": "🏠",
    "Sports & Outdoors": "⚽",
    "Gaming": "🎮",
    "Fitness": "🏋️",
    "Art": "🎨"
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Discover Your
              <br />
              <span className="text-accent-300">Perfect Style</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Shop the latest trends in electronics, fashion, home & lifestyle.
              Premium quality products at unbeatable prices with free shipping.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center bg-white text-primary-700 font-semibold py-3 px-8 rounded-full hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl">
                Shop Now
                <HiOutlineArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/products?sort=newest" className="inline-flex items-center border-2 border-white/30 text-white font-semibold py-3 px-8 rounded-full hover:bg-white/10 transition-all">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-900">{f.title}</p>
                  <p className="text-xs text-dark-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-900">
                Shop by Category
              </h2>
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View All <HiOutlineArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="card p-6 text-center group hover:border-primary-200 hover:shadow-md"
                >
                  <span className="text-3xl mb-3 block">
                    {categoryIconMap[cat] || "🛍️"}
                  </span>
                  <span className="text-sm font-semibold text-dark-800 group-hover:text-primary-600 transition-colors">
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section-padding bg-dark-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View All <HiOutlineArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <HiOutlineShoppingBag className="w-16 h-16 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-500 text-lg">No products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-900 text-white section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-dark-400 mb-8 text-lg">
            Join thousands of happy customers on ShopVerse.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center btn-primary py-3 px-10 text-base rounded-full"
          >
            Explore Products
            <HiOutlineArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

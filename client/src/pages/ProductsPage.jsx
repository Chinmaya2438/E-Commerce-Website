import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineX } from "react-icons/hi";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync state with URL if it changes from outside (e.g. Navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category) params.category = category;

        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Update URL params
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (page > 1) params.page = page;
    setSearchParams(params);
  }, [search, category, sort, page]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("newest");
    setPage(1);
  };

  const hasFilters = search || category || sort !== "newest";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900">
            {category || "All Products"}
          </h1>
          <p className="text-dark-500 text-sm mt-1">
            {products.length} products found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="sm:hidden p-2 border border-dark-200 rounded-lg"
          >
            <HiOutlineFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            filtersOpen ? "block" : "hidden"
          } sm:block w-full sm:w-56 flex-shrink-0`}
        >
          <div className="card p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-dark-900">Filters</h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="mb-5">
              <label className="text-sm font-medium text-dark-700 block mb-2">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="input-field py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium text-dark-700 block mb-2">
                Category
              </label>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setCategory("");
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !category
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-dark-600 hover:bg-dark-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-dark-600 hover:bg-dark-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Active Filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && (
                <span className="badge bg-primary-50 text-primary-700 px-3 py-1 flex items-center gap-1">
                  Search: {search}
                  <button onClick={() => setSearch("")}>
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="badge bg-primary-50 text-primary-700 px-3 py-1 flex items-center gap-1">
                  {category}
                  <button onClick={() => setCategory("")}>
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-dark-200 text-sm font-medium disabled:opacity-50 hover:bg-dark-50 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? "bg-primary-600 text-white"
                            : "border border-dark-200 hover:bg-dark-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-dark-200 text-sm font-medium disabled:opacity-50 hover:bg-dark-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <HiOutlineSearch className="w-16 h-16 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-500 text-lg mb-2">No products found</p>
              <p className="text-dark-400 text-sm">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 btn-outline text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

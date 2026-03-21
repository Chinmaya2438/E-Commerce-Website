import Product from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

// GET /api/products — search, filter, sort, paginate
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      let searchTerm = search.toLowerCase();
      
      // Simple synonym matcher for better UX
      const synonyms = {
        "tv": "television|monitor",
        "television": "tv|monitor",
        "monitor": "tv|television",
        "bicycle": "bike|cycle",
        "cycle": "bike|bicycle",
        "bike": "bicycle|cycle",
        "sneaker": "shoe|trainer",
        "shoe": "sneaker|trainer",
        "pc": "laptop|computer",
        "computer": "laptop|pc"
      };

      const regexPattern = synonyms[searchTerm] 
        ? `${searchTerm}|${synonyms[searchTerm]}` 
        : searchTerm;

      query.$or = [
        { name: { $regex: regexPattern, $options: "i" } },
        { description: { $regex: regexPattern, $options: "i" } },
        { category: { $regex: regexPattern, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { ratings: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/categories — distinct category list
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products (admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, ratings } = req.body;

    const productData = {
      name,
      description,
      price,
      category,
      stock: stock || 0,
      ratings: ratings || 0,
    };

    if (req.file) {
      productData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, category, stock, ratings } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.ratings = ratings !== undefined ? ratings : product.ratings;

    if (req.file) {
      // Delete old image from Cloudinary
      if (product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary
    if (product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products/:id/reviews (protected)
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

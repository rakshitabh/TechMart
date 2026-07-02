import Product from '../models/Product.js';
import uploadImage from '../utils/imageUpload.js';

// @desc    Fetch all products (with search & filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice, sort } = req.query;

    let query = {};

    // Search by name, category, description, and brand (with stemming/plural support)
    if (keyword) {
      const cleanKeyword = keyword.trim().toLowerCase();
      if (cleanKeyword) {
        // Simple stemming/plural rules
        const getStems = (term) => {
          const stems = new Set([term]);
          if (term.endsWith('ies') && term.length > 3) {
            stems.add(term.slice(0, -3) + 'y');
          } else if (term.endsWith('es') && term.length > 2) {
            stems.add(term.slice(0, -2));
            stems.add(term.slice(0, -1));
          } else if (term.endsWith('s') && !term.endsWith('ss') && term.length > 1) {
            stems.add(term.slice(0, -1));
          }
          return Array.from(stems);
        };

        const words = cleanKeyword.split(/[\s\-_,]+/);
        const searchTerms = new Set();

        getStems(cleanKeyword).forEach((t) => searchTerms.add(t));
        for (const word of words) {
          if (word.length > 1) {
            getStems(word).forEach((t) => searchTerms.add(t));
          }
        }

        const orConditions = [];
        for (const term of searchTerms) {
          const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = { $regex: escapedTerm, $options: 'i' };
          orConditions.push({ name: regex });
          orConditions.push({ category: regex });
          orConditions.push({ description: regex });
          orConditions.push({ brand: regex });
        }

        if (orConditions.length > 0) {
          query.$or = orConditions;
        }
      }
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by brand
    if (brand && brand !== 'All') {
      query.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let apiQuery = Product.find(query);

    // Sorting
    if (sort) {
      if (sort === 'price-asc') {
        apiQuery = apiQuery.sort('price');
      } else if (sort === 'price-desc') {
        apiQuery = apiQuery.sort('-price');
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort('-rating');
      } else {
        apiQuery = apiQuery.sort('-createdAt');
      }
    } else {
      apiQuery = apiQuery.sort('-createdAt');
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, brand, stock } = req.body;

    let imageUrl = '/images/sample.jpg';
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const product = new Product({
      name: name || 'Sample Product',
      price: price || 0,
      user: req.user._id,
      image: imageUrl,
      brand: brand || 'Sample Brand',
      category: category || 'Sample Category',
      stock: stock || 0,
      description: description || 'Sample Description',
      rating: 0,
      reviews: [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, brand, stock, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? stock : product.stock;

      if (req.file) {
        product.image = await uploadImage(req.file);
      } else if (image) {
        product.image = image;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400);
      throw new Error('Please add a rating and comment');
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed by you');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      // Recalculate rating
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories and brands (for dashboard/filter UI helper)
// @route   GET /api/products/meta/categories
// @access  Public
const getProductsMetadata = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    res.json({ categories, brands });
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductsMetadata,
};

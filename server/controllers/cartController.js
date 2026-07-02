import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper function to recalculate subtotal and total amount of a cart
const recalculateCartTotals = async (cart) => {
  let subtotal = 0;

  for (const item of cart.products) {
    const product = await Product.findById(item.product);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  }

  cart.subtotal = Number(subtotal.toFixed(2));
  cart.totalAmount = Number(subtotal.toFixed(2)); // Currently equal to subtotal
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'products.product',
      model: 'Product'
    });

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({
        user: req.user._id,
        products: [],
        subtotal: 0.0,
        totalAmount: 0.0,
      });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  try {
    const qty = Number(quantity) || 1;
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < qty) {
      res.status(400);
      throw new Error(`Insufficient stock. Only ${product.stock} items remaining.`);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [],
      });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists, update quantity
      cart.products[itemIndex].quantity = qty;
    } else {
      // Product does not exist, add to products array
      cart.products.push({ product: productId, quantity: qty });
    }

    await recalculateCartTotals(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'products.product',
      model: 'Product'
    });

    res.json(populatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== req.params.productId
      );

      await recalculateCartTotals(cart);
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'products.product',
        model: 'Product'
      });

      res.json(populatedCart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.products = [];
      cart.subtotal = 0.0;
      cart.totalAmount = 0.0;

      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getCart, addItemToCart, removeItemFromCart, clearCart };

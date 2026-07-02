import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  const {
    products,
    shippingAddress,
    totalPrice,
    paymentMethod,
    paymentStatus,
    transactionId,
    razorpayOrderId,
    razorpayPaymentId,
  } = req.body;

  try {
    if (!products || products.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    if (!shippingAddress) {
      res.status(400);
      throw new Error('Please provide shipping address');
    }

    // Verify stock and update inventory
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name}`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${item.name}`);
      }
    }

    // Process stock subtraction
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = new Order({
      userId: req.user._id,
      user: req.user._id, // Compatibility
      products,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentStatus || 'Pending',
      transactionId: transactionId || '',
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
      orderStatus: paymentMethod === 'Cash on Delivery' ? 'Order Placed' : (paymentStatus === 'Paid' ? 'Payment Confirmed' : 'Order Placed'),
    });

    const createdOrder = await order.save();

    // Empty user's cart upon successful order
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      cart.subtotal = 0.0;
      cart.totalAmount = 0.0;
      await cart.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Verify if order belongs to requesting user or admin
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid order status value');
      }

      order.orderStatus = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics stats
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    // Total Revenue (only from non-cancelled orders)
    const revenueQuery = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueQuery.length > 0 ? revenueQuery[0].total : 0;

    // Total orders count
    const totalOrders = await Order.countDocuments({});

    // Count by status
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Order Placed', 'Payment Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery'] }
    });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

    // Recent orders (last 5)
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(5);

    // Sales by day (last 7 days)
    const salesByDay = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      statusCounts: {
        Pending: pendingOrders,
        Processing: processingOrders,
        Shipped: shippedOrders,
        Delivered: deliveredOrders,
        Cancelled: cancelledOrders,
      },
      recentOrders,
      salesByDay,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to cancel this order');
    }

    const nonCancellableStatuses = ['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      res.status(400);
      throw new Error(`Order cannot be cancelled. Current status is: ${order.orderStatus}`);
    }

    // Restore stock inventory
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.orderStatus = 'Cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getAdminStats,
  cancelOrder,
};

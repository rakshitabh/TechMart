import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete administrative user accounts');
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (user.wishlist.includes(productId)) {
        res.status(400);
        throw new Error('Product already in wishlist');
      }

      user.wishlist.push(productId);
      await user.save();
      const populatedUser = await User.findById(user._id).populate('wishlist');
      res.json(populatedUser.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== req.params.id
      );
      await user.save();
      const populatedUser = await User.findById(user._id).populate('wishlist');
      res.json(populatedUser.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user role (user <-> admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const toggleUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent self-demotion
      if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot change your own admin role status');
      }

      user.role = user.role === 'admin' ? 'user' : 'admin';
      await user.save();
      res.json({ message: `User role updated to ${user.role}`, user });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getUsers, deleteUser, addToWishlist, removeFromWishlist, toggleUserRole };

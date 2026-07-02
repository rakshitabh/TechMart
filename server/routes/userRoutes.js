import express from 'express';
import {
  getUsers,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  toggleUserRole,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getUsers);

router.route('/wishlist')
  .post(protect, addToWishlist);

router.route('/wishlist/:id')
  .delete(protect, removeFromWishlist);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/role')
  .put(protect, admin, toggleUserRole);

export default router;

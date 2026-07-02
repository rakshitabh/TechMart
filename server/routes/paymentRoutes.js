import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/razorpay-key', protect, getRazorpayKey);
router.post('/razorpay-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

export default router;

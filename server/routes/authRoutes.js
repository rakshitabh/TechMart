import express from 'express';
import {
  registerUser,
  authUser,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateUserProfile,
  loginWithGoogle,
  completeProfile,
  sendOTPAny,
  verifyOTPAny,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/otp/send', sendOTPAny);
router.post('/otp/verify', verifyOTPAny);
router.post('/google', loginWithGoogle);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/complete-profile', protect, completeProfile);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;

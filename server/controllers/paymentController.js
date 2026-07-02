import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_T8W6TYNcGW2EBC',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'FElbwhefehDNECAAy5h3wP3t',
});

// @desc    Get Razorpay Client Key ID
// @route   GET /api/payments/razorpay-key
// @access  Private
const getRazorpayKey = async (req, res, next) => {
  try {
    res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_T8W6TYNcGW2EBC' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  const { amount } = req.body; // in USD

  try {
    if (!amount) {
      res.status(400);
      throw new Error('Please specify payment amount');
    }

    // Convert INR to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_rcpt_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error('Missing verification params');
    }

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'FElbwhefehDNECAAy5h3wP3t');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      res.json({ success: true, message: 'Payment signature verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
};

export { getRazorpayKey, createRazorpayOrder, verifyPayment };

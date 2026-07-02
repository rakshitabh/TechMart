import mongoose from 'mongoose';

const otpCacheSchema = new mongoose.Schema(
  {
    emailOrPhone: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpire: {
      type: Date,
      required: true,
      index: { expires: '5m' }, // Mongoose TTL index: automatically delete after 5 minutes
    },
  },
  {
    timestamps: true,
  }
);

const OtpCache = mongoose.model('OtpCache', otpCacheSchema);
export default OtpCache;

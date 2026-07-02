import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add a contact name'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone number'],
    },
    house: {
      type: String,
      required: [true, 'Please add house/flat/building number'],
    },
    street: {
      type: String,
      required: [true, 'Please add street details'],
    },
    landmark: {
      type: String,
      default: '',
    },
    area: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
    },
    state: {
      type: String,
      required: [true, 'Please add state'],
    },
    country: {
      type: String,
      required: [true, 'Please add country'],
      default: 'India',
    },
    pincode: {
      type: String,
      required: [true, 'Please add PIN code'],
    },
    type: {
      type: String,
      enum: ['Home', 'Work', 'Hostel', 'Other'],
      default: 'Home',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;

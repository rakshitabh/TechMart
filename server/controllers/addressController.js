import Address from '../models/Address.js';

// @desc    Get all addresses for logged in user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, updatedAt: -1 });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  const { fullName, phone, house, street, landmark, area, city, state, country, pincode, type, isDefault } = req.body;

  try {
    const addressCount = await Address.countDocuments({ userId: req.user._id });
    
    // If first address, make it default automatically
    const makeDefault = addressCount === 0 ? true : !!isDefault;

    if (makeDefault) {
      // Clear default status for other addresses
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = new Address({
      userId: req.user._id,
      fullName,
      phone,
      house,
      street,
      landmark: landmark || '',
      area: area || '',
      city,
      state,
      country: country || 'India',
      pincode,
      type: type || 'Home',
      isDefault: makeDefault,
    });

    const createdAddress = await address.save();
    res.status(201).json(createdAddress);
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
  const { fullName, phone, house, street, landmark, area, city, state, country, pincode, type, isDefault } = req.body;

  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this address');
    }

    if (isDefault && !address.isDefault) {
      // Clear default status for other addresses
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.house = house || address.house;
    address.street = street || address.street;
    address.landmark = landmark !== undefined ? landmark : address.landmark;
    address.area = area !== undefined ? area : address.area;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.pincode = pincode || address.pincode;
    address.type = type || address.type;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    const updatedAddress = await address.save();
    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this address');
    }

    const wasDefault = address.isDefault;
    await Address.deleteOne({ _id: address._id });

    // If default was deleted and user has other addresses, mark the most recently updated one as default
    if (wasDefault) {
      const remainingAddress = await Address.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });
      if (remainingAddress) {
        remainingAddress.isDefault = true;
        await remainingAddress.save();
      }
    }

    res.json({ message: 'Address removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    if (address.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to modify this address');
    }

    await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    address.isDefault = true;
    const updatedAddress = await address.save();
    
    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
};

export { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };

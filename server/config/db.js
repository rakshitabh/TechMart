// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techmart');
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     console.warn('WARNING: Running without database. Some database features might fail.');
//     console.warn('To fix this, make sure MongoDB is running locally or set MONGO_URI in server/.env');
//     // In production, we want to exit, but in dev/test we can let it run (or fail gracefully)
//     if (process.env.NODE_ENV === 'production') {
//       process.exit(1);
//     }
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      console.log('Skipping MongoDB connection during tests');
      return;
    }

    const mongoURI =
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/techmart';

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    console.warn(
      'Running without MongoDB (development mode)'
    );
  }
};

export default connectDB;
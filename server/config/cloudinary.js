import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isMock = !process.env.CLOUDINARY_CLOUD_NAME || 
               process.env.CLOUDINARY_CLOUD_NAME === 'mock' ||
               !process.env.CLOUDINARY_API_KEY ||
               process.env.CLOUDINARY_API_KEY === 'mock';

if (!isMock) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary Configured successfully.');
} else {
  console.log('Cloudinary API keys missing or set to mock. Running Cloudinary in mock mode (saving uploads locally).');
}

export { cloudinary, isMock };

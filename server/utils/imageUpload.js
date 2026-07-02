import fs from 'fs';
import path from 'path';
import { cloudinary, isMock } from '../config/cloudinary.js';

const uploadImage = async (file) => {
  if (isMock) {
    // Local mock uploading
    const uploadDir = './public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    const filepath = path.join(uploadDir, filename);

    // Save buffer to local file system
    await fs.promises.writeFile(filepath, file.buffer);

    // Return the relative URL (will be served statically by express)
    return `/uploads/${filename}`;
  } else {
    // Cloudinary uploading
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'techmart' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Cloudinary upload failed: ' + error.message));
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(file.buffer);
    });
  }
};

export default uploadImage;

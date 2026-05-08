const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log('--- UPLOAD MIDDLEWARE TRACE ---');
        console.log('Processing file:', file.originalname);
        return {
            folder: 'genius-school-assets',
            allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        };
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;

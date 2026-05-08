require('dotenv').config();
const cloudinary = require('./config/cloudinary');

(async () => {
    try {
        console.log('Testing Cloudinary configuration...');
        const result = await cloudinary.uploader.upload('https://via.placeholder.com/150', {
            folder: 'test-uploads'
        });
        console.log('Upload successful!');
        console.log('URL:', result.secure_url);
        process.exit(0);
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        process.exit(1);
    }
})();

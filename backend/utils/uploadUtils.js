/**
 * Extracts the image URL from Multer files or request body.
 * @param {Object} req - Express request object.
 * @param {string} fieldname - The field name used for the file upload (default: 'image').
 * @returns {string|null} - The normalized image URL or null.
 */
exports.extractImageUrl = (req, fieldname = 'image') => {
    let image_url = null;

    // 1. Check for files uploaded via Multer
    if (req.files && Array.isArray(req.files)) {
        const file = req.files.find(f => f.fieldname === fieldname);
        if (file) {
            // Normalize path for Cloudinary or Local storage
            image_url = file.path.replace(/\\/g, '/');
        }
    } else if (req.file && req.file.fieldname === fieldname) {
        // Single file upload
        image_url = req.file.path.replace(/\\/g, '/');
    }

    // 2. Fallback to image_url in body (if provided as a string/URL)
    if (!image_url && req.body.image_url) {
        image_url = req.body.image_url;
    }

    return image_url;
};

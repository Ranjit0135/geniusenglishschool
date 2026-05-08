const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
    try {
        const items = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        await item.destroy();
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const About = require('../models/About');
const path = require('path');
const fs = require('fs');

exports.getAbout = async (req, res) => {
    try {
        const about = await About.findOne();
        res.json(about || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAbout = async (req, res) => {
    try {
        let about = await About.findOne();
        const updates = { ...req.body };

        if (req.file) {
            // Delete old image if it exists
            if (about && about.imageUrl) {
                const oldPath = path.join('uploads', about.imageUrl);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            updates.imageUrl = req.file.filename;
        }

        if (about) {
            await about.update(updates);
            res.json(about);
        } else {
            about = await About.create(updates);
            res.status(201).json(about);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

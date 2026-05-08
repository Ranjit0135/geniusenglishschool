const { NewsItem } = require('../models');
const { v4: uuidv4 } = require('uuid');

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + uuidv4().slice(0, 8);
};

exports.getAllNews = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const query = school_id ? { where: { school_id } } : {};
        const news = await NewsItem.findAll({
            ...query,
            order: [['createdAt', 'DESC']]
        });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const news = await NewsItem.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: 'News item not found' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNewsBySlug = async (req, res) => {
    try {
        const news = await NewsItem.findOne({
            where: { slug: req.params.slug }
        });
        if (!news) return res.status(404).json({ message: 'News item not found' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createNews = async (req, res) => {
    try {
        console.log('--- CREATE NEWS ITEM TRACE ---');
        console.log('File:', req.file);
        console.log('Files:', req.files);
        console.log('Body:', req.body);

        const { title, content, excerpt, category, author_name, is_published } = req.body;
        const school_id = req.user.school_id;

        let image_url = null;

        if (req.files) {
            req.files.forEach(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                if (file.fieldname === 'image') image_url = normalizedPath;
            });
        }

        // If no file but URL provided in body
        if (!image_url && req.body.image_url) image_url = req.body.image_url;

        const news = await NewsItem.create({
            school_id,
            title,
            slug: generateSlug(title),
            content,
            excerpt,
            category,
            author_name,
            image_url,
            is_published: is_published === 'false' || is_published === false ? false : true
        });

        res.status(201).json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        console.log('--- UPDATE NEWS ITEM TRACE ---');
        console.log('File:', req.file);
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        const school_id = req.user.school_id;
        const news = await NewsItem.findOne({ where: { id: req.params.id, school_id } });
        if (!news) return res.status(404).json({ message: 'News item not found' });

        const { title, content, excerpt, category, author_name, is_published } = req.body;

        const updateData = {
            title,
            content,
            excerpt,
            category,
            author_name
        };

        if (is_published !== undefined) {
            updateData.is_published = (is_published === 'false' || is_published === false) ? false : true;
        }

        if (req.files) {
            req.files.forEach(file => {
                const normalizedPath = file.path.replace(/\\/g, '/');
                if (file.fieldname === 'image') updateData.image_url = normalizedPath;
            });
        }

        // If no new image but exists in body (as a URL), keep it
        if (!updateData.image_url && req.body.image_url) {
            updateData.image_url = req.body.image_url;
        }

        if (title && title !== news.title) {
            updateData.slug = generateSlug(title);
        }

        await news.update(updateData);
        res.json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const news = await NewsItem.findOne({ where: { id: req.params.id, school_id } });
        if (!news) return res.status(404).json({ message: 'News item not found' });
        await news.destroy();
        res.json({ message: 'News item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

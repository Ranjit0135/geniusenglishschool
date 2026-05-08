const News = require('../models/News');
const slugify = require('../utils/slugify');

exports.getNews = async (req, res) => {
    try {
        const news = await News.findAll({ order: [['createdAt', 'DESC']] });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNewsBySlug = async (req, res) => {
    try {
        const item = await News.findOne({ where: { slug: req.params.slug } });
        if (!item) return res.status(404).json({ message: "News not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createNews = async (req, res) => {
    try {
        const { title } = req.body;
        req.body.slug = slugify(title);
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: "News not found" });
        if (req.body.title) req.body.slug = slugify(req.body.title);
        await news.update(req.body);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) return res.status(404).json({ message: "News not found" });
        await news.destroy();
        res.json({ message: "News deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

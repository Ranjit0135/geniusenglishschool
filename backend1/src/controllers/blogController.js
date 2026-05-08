const Blog = require('../models/Blog');

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        await blog.update(req.body);
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        await blog.destroy();
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

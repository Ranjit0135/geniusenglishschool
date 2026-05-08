const { BlogPost, School } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Helper to generate slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + uuidv4().slice(0, 8);
};

exports.getAllPosts = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const posts = await BlogPost.findAll({
            where: { school_id },
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await BlogPost.findByPk(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post' });
    }
};

exports.getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await BlogPost.findOne({ where: { slug } });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post' });
    }
};

exports.createPost = async (req, res) => {
    try {
        console.log('--- CREATE BLOG POST TRACE ---');
        console.log('File:', req.file);
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        const school_id = req.user.school_id;
        const { title, content, excerpt, author_name, category, tags, is_published } = req.body;

        // Handle image extraction (Gallery-style pattern)
        let image_url = null;
        if (req.file) {
            image_url = req.file.path.replace(/\\/g, '/');
        } else if (req.body.image_url) {
            image_url = req.body.image_url;
        }

        const newPost = await BlogPost.create({
            school_id,
            title,
            slug: generateSlug(title),
            content,
            excerpt,
            author_name,
            category,
            tags,
            is_published: is_published === 'false' || is_published === false ? false : true,
            image_url
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Error creating blog post', error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        console.log('--- UPDATE BLOG POST TRACE ---');
        console.log('File:', req.file);
        console.log('Files:', req.files);
        console.log('Body:', req.body);
        const school_id = req.user.school_id;
        const { id } = req.params;
        const { title, content, excerpt, author_name, category, tags, is_published } = req.body;

        const post = await BlogPost.findOne({ where: { id, school_id } });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const updateData = {
            title,
            content,
            excerpt,
            author_name,
            category,
            tags
        };

        if (is_published !== undefined) {
            updateData.is_published = (is_published === 'false' || is_published === false) ? false : true;
        }

        // Handle image extraction (Gallery-style pattern)
        if (req.file) {
            updateData.image_url = req.file.path.replace(/\\/g, '/');
        } else if (req.body.image_url) {
            updateData.image_url = req.body.image_url;
        }

        await post.update(updateData);
        res.json(post);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ message: 'Error updating blog post', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const post = await BlogPost.findOne({ where: { id, school_id } });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ message: 'Error deleting blog post', error: error.message });
    }
};

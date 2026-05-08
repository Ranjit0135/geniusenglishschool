const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    school_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'schools',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'blog_post_slug_unique'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    excerpt: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    author_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags: {
        type: DataTypes.STRING, // Stored as comma-separated string for simplicity
        allowNull: true
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'blog_posts'
});

module.exports = BlogPost;

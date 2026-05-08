const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Blog = sequelize.define('Blog', {
    title: { type: DataTypes.STRING, required: true },
    content: { type: DataTypes.TEXT, required: true },
    author: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'published' }
}, {
    timestamps: true
});

module.exports = Blog;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NewsItem = sequelize.define('NewsItem', {
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
        unique: 'news_item_slug_unique'
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
        allowNull: true,
        defaultValue: 'School News'
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
    tableName: 'news_items'
});

module.exports = NewsItem;

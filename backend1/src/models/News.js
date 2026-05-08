const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const News = sequelize.define('News', {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    content: { type: DataTypes.TEXT },
    imageUrl: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    isAnnouncement: { type: DataTypes.BOOLEAN, defaultValue: false },
    buttonText: { type: DataTypes.STRING, defaultValue: 'Read More' }
});

module.exports = News;

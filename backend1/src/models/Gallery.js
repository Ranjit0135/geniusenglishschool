const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Gallery = sequelize.define('Gallery', {
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    caption: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING }
});

module.exports = Gallery;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Hero = sequelize.define('Hero', {
    videoUrl: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    subtitle: { type: DataTypes.STRING },
    isMuted: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Hero;

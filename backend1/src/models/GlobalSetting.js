const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GlobalSetting = sequelize.define('GlobalSetting', {
    schoolName: { type: DataTypes.STRING, defaultValue: 'Genius English School' },
    tagline: { type: DataTypes.STRING, defaultValue: 'Fostering Excellence' },
    logoUrl: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    mapUrl: { type: DataTypes.TEXT },
    facebookUrl: { type: DataTypes.STRING },
    instagramUrl: { type: DataTypes.STRING },
    youtubeUrl: { type: DataTypes.STRING }
});

module.exports = GlobalSetting;

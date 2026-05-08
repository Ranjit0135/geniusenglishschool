const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const About = sequelize.define('About', {
    title: { type: DataTypes.STRING, defaultValue: 'About Us' },
    content: { type: DataTypes.TEXT },
    mission: { type: DataTypes.TEXT },
    vision: { type: DataTypes.TEXT },
    objectives: { type: DataTypes.JSON },
    imageUrl: { type: DataTypes.STRING }
});

module.exports = About;

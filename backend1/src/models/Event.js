const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    imageUrl: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, defaultValue: 'General' },
    status: { type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'), defaultValue: 'upcoming' }
}, {
    timestamps: true
});

module.exports = Event;

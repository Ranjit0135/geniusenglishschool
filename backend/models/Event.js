const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
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
        unique: 'event_slug_unique'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY, // Store date separately
        allowNull: false
    },
    time_range: {
        type: DataTypes.STRING, // e.g., "8:00am - 5:00pm"
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Academic'
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
    tableName: 'events'
});

module.exports = Event;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AboutContent = sequelize.define('AboutContent', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mission: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vision: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tour_title: {
        type: DataTypes.STRING,
        defaultValue: 'Special School Tour'
    },
    tour_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tour_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'about_contents'
});

module.exports = AboutContent;

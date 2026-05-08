const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GalleryItem = sequelize.define('GalleryItem', {
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
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    media_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    media_type: {
        type: DataTypes.ENUM('image', 'video'),
        defaultValue: 'image'
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'gallery_items'
});

module.exports = GalleryItem;

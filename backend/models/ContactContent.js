const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactContent = sequelize.define('ContactContent', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    school_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'schools',
            key: 'id'
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    map_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'contact_contents',
    timestamps: true
});

module.exports = ContactContent;

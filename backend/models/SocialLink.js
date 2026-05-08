const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialLink = sequelize.define('SocialLink', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    school_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'social_links',
    timestamps: true
});

module.exports = SocialLink;

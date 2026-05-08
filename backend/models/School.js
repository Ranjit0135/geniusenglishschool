const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const School = sequelize.define('School', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subdomain: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: 'idx_schools_subdomain'
    },
    custom_domain: {
        type: DataTypes.STRING,
        unique: 'idx_schools_custom_domain',
        allowNull: true
    },
    logo_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    theme_config: {
        type: DataTypes.JSON,
        defaultValue: {
            primaryColor: '#ff9d01',
            secondaryColor: '#001c3d',
            font: 'Inter'
        }
    },
    subscription_status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TRIAL'),
        defaultValue: 'ACTIVE'
    },
    template_id: {
        type: DataTypes.STRING,
        defaultValue: 'kingster'
    },
    setup_status: {
        type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
        defaultValue: 'PENDING'
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    general_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    event_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    blog_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    gallery_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    news_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    about_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contact_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    school_life_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    courses_hero_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'schools',
    timestamps: true
});

module.exports = School;

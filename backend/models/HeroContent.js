const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HeroContent = sequelize.define('HeroContent', {
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
    subtitle: {
        type: DataTypes.STRING,
        defaultValue: 'Welcome to'
    },
    title_main: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Genius English'
    },
    title_highlight: {
        type: DataTypes.STRING,
        defaultValue: 'School'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    button_text: {
        type: DataTypes.STRING,
        defaultValue: 'Take a Tour'
    },
    button_link: {
        type: DataTypes.STRING,
        defaultValue: '#tour'
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    principal_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Newman Sarah'
    },
    principal_role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Principal'
    },
    principal_message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    principal_image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    principal_facebook: {
        type: DataTypes.STRING,
        allowNull: true
    },
    principal_twitter: {
        type: DataTypes.STRING,
        allowNull: true
    },
    principal_linkedin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    principal_instagram: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'hero_content',
    timestamps: true
});

module.exports = HeroContent;

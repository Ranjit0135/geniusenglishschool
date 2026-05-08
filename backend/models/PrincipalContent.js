const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrincipalContent = sequelize.define('PrincipalContent', {
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
        },
        onDelete: 'CASCADE'
    },
    principal_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Subodh Raimajhi'
    },
    principal_role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Principal'
    },
    principal_message: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'Education is not just about books; it\'s about building character and igniting a lifelong passion for learning in every child.'
    },
    principal_image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    facebook_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twitter_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedin_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    social_links: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'principal_contents',
    timestamps: true
});

module.exports = PrincipalContent;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
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
    author_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author_role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Parent'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'testimonials',
    timestamps: true
});

module.exports = Testimonial;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const School = require('./School');

const Course = sequelize.define('Course', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teacher: {
        type: DataTypes.STRING,
        allowNull: true
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sub_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    detailed_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    curriculum: {
        type: DataTypes.JSON,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'courses',
    timestamps: true
});

Course.belongsTo(School, { foreignKey: 'school_id' });

module.exports = Course;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const School = require('./School');

const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    name: {
        type: DataTypes.STRING,
        allowNull: false // e.g., "Class 10"
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false // e.g., "A"
    },
    class_teacher_id: {
        type: DataTypes.UUID,
        allowNull: true
        // references teachers table (circular dependency handling needed if strict)
    }
}, {
    tableName: 'classes',
    timestamps: false
});

Class.belongsTo(School, { foreignKey: 'school_id' });

module.exports = Class;

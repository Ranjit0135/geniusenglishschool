const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const School = require('./School');

const Subject = sequelize.define('Subject', {
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
        allowNull: false // e.g., "Mathematics"
    },
    code: {
        type: DataTypes.STRING // e.g., "MTH101"
    },
    type: {
        type: DataTypes.ENUM('THEORY', 'PRACTICAL'),
        defaultValue: 'THEORY'
    }
}, {
    tableName: 'subjects',
    timestamps: false
});

Subject.belongsTo(School, { foreignKey: 'school_id' });

module.exports = Subject;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const School = require('./School');

const NavigationItem = sequelize.define('NavigationItem', {
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
    label: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // Self-reference for dropdown submenus
    },
    is_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'navigation_items',
    timestamps: false
});

NavigationItem.belongsTo(School, { foreignKey: 'school_id' });
School.hasMany(NavigationItem, { foreignKey: 'school_id' });

// Self-association for submenus
NavigationItem.hasMany(NavigationItem, { as: 'subItems', foreignKey: 'parent_id' });
NavigationItem.belongsTo(NavigationItem, { as: 'parent', foreignKey: 'parent_id' });

module.exports = NavigationItem;

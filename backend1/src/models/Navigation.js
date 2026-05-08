const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Navigation = sequelize.define('Navigation', {
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
        references: {
            model: 'Navigations',
            key: 'id'
        }
    },
    is_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Self-referential relationship for sub-menus
Navigation.hasMany(Navigation, { as: 'subItems', foreignKey: 'parent_id' });
Navigation.belongsTo(Navigation, { as: 'parent', foreignKey: 'parent_id' });

module.exports = Navigation;

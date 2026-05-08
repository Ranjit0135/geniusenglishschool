const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const School = require('./School');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
        defaultValue: 'STUDENT'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verification_otp: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email'] // Email must be globally unique
        }
    ],
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        }
    }
});

// Method to compare password
User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
};

// Define Association
User.belongsTo(School, { foreignKey: 'school_id' });
School.hasMany(User, { foreignKey: 'school_id' });

module.exports = User;

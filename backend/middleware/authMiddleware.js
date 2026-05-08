const jwt = require('jsonwebtoken');
const { User, School } = require('../models');

exports.optionalProtect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret');
            const currentUser = await User.findByPk(decoded.id, {
                include: [{ model: School }]
            });
            if (currentUser) {
                req.user = currentUser;
            }
        }
        next();
    } catch (err) {
        next();
    }
};

exports.protect = async (req, res, next) => {
    try {
        // 1. Get token and check if it exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2. Verification of token
        const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret';
        console.log('--- AUTH DEBUG ---');
        console.log('Using secret:', secret === 'your_jwt_secret_key_change_in_production' ? 'PROD_FALLBACK' : 'ACCESS_OR_LOCAL');
        const decoded = jwt.verify(token, secret);
        console.log('Token decoded for ID:', decoded.id);

        // 3. Check if user still exists
        const currentUser = await User.findByPk(decoded.id, {
            include: [{ model: School }]
        });

        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.'
            });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            status: 'fail',
            message: 'Invalid token or session expired'
        });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

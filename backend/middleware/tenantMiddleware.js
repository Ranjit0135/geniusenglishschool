const { School } = require('../models');

/**
 * Middleware to resolve the school (tenant) for a request.
 * 1. If req.user exists (from protect middleware), use req.user.school_id.
 * 2. Otherwise, look for 'x-school-id' header.
 * 3. FALLBACK: For development, use School.findOne() if no other way.
 */
exports.resolveSchool = async (req, res, next) => {
    try {
        // 1. If already authenticated via protect middleware
        if (req.user && req.user.school_id) {
            return next();
        }

        // 2. Try to get school_id from headers (explicitly passed)
        let schoolId = req.headers['x-school-id'];

        // 3. Try to get subdomain from headers or host
        const subdomainHeader = req.headers['x-subdomain'];
        const host = req.get('host');
        const subdomain = subdomainHeader || (host && host.includes('.') ? host.split('.')[0] : null);

        if (schoolId) {
            const school = await School.findByPk(schoolId);
            if (school) {
                req.school = school;
                if (!req.user) req.user = { school_id: school.id };
                return next();
            }
        }

        if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
            const school = await School.findOne({ where: { subdomain } });
            if (school) {
                req.school = school;
                if (!req.user) req.user = { school_id: school.id };
                return next();
            }
        }

        // 4. FALLBACK: For development, use the first school if no context found
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            const school = await School.findOne();
            if (school) {
                console.info(`Development Fallback: Using school ${school.name} (ID: ${school.id})`);
                req.school = school;
                if (!req.user) req.user = { school_id: school.id };
                return next();
            }
        }

        console.warn(`Tenant resolution failed. Path: ${req.originalUrl}, host: ${host}, subdomain: ${subdomain}, x-school-id: ${schoolId || 'None'}`);
        res.status(404).json({ message: 'School context not found. Please check the URL or provide school-id.' });
    } catch (error) {
        console.error('Tenant resolution error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

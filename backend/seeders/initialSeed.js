const { sequelize, School, NavigationItem } = require('../models');

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // WARNING: This drops tables!
        console.log('Database synced.');

        // 1. Create Default School
        const school = await School.create({
            name: 'Genius School',
            subdomain: 'genius',
            custom_domain: 'www.geniusschool.com',
            logo_url: '/assets/logo.png',
            theme_config: {
                primaryColor: '#ff9d01',
                secondaryColor: '#001c3d',
                font: 'Inter'
            }
        });
        console.log('School created:', school.name);

        // 2. Create Navigation Items
        const items = [
            { label: 'Home', path: '/', order: 1 },
            { label: 'About Us', path: '/about', order: 2 },
            { label: 'Students', path: '/students', order: 3 },
            { label: 'Teachers', path: '/teachers', order: 4 },
            { label: 'Parents', path: '/parents', order: 5 },
            { label: 'Academic', path: '/academic', order: 6 },
            { label: 'Gallery', path: '/gallery', order: 7 },
            { label: 'Blog', path: '/blog', order: 8 },
            { label: 'Courses', path: '/courses', order: 9 },
            { label: 'Dashboard', path: '/dashboard', order: 10 },
            { label: 'Contact', path: '/contact', order: 11 },
            { label: 'Admissions', path: '/admissions', order: 12 }
        ];

        for (const item of items) {
            await NavigationItem.create({
                school_id: school.id,
                ...item
            });
        }
        console.log('Navigation items seeded.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();

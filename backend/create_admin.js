const { sequelize, School, User } = require('./models');

async function createAdmin() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 1. Ensure at least one school exists
        let school = await School.findOne();
        if (!school) {
            console.log('No school found. Creating default Genius School...');
            school = await School.create({
                name: 'Genius School',
                subdomain: 'genius',
                custom_domain: 'www.geniusschool.com',
                logo_url: '/assets/logo.png',
                theme_config: {
                    primaryColor: '#ff9d01',
                    secondaryColor: '#001c3d',
                    font: 'Inter'
                },
                is_approved: true,
                setup_status: 'COMPLETED'
            });
            console.log('Default School created with ID:', school.id);
        } else {
            console.log('Existing School found:', school.name, 'ID:', school.id);
        }

        // 2. Create Admin User
        const email = 'alok@gmail.com';
        const password_hash = '123456'; // Hook in User.js handles hashing

        const [user, created] = await User.findOrCreate({
            where: { email: email },
            defaults: {
                school_id: school.id,
                name: 'Alok Admin',
                password_hash: password_hash,
                role: 'SUPER_ADMIN',
                is_active: true,
                is_verified: true
            }
        });

        if (created) {
            console.log('Admin user created successfully:', email);
        } else {
            console.log('Admin user already exists:', email);
            // Optionally update password if needed, but let's stick to creation for now
            user.password_hash = password_hash;
            user.role = 'SUPER_ADMIN';
            user.is_active = true;
            user.is_verified = true;
            await user.save();
            console.log('Admin user updated successfully:', email);
        }

    } catch (error) {
        console.error('Operation failed:', error);
    } finally {
        await sequelize.close();
    }
}

createAdmin();

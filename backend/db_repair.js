const { sequelize } = require('./models');

async function repairDB() {
    try {
        await sequelize.authenticate();
        console.log('COMPREHENSIVE Repair starting...');

        // Disable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

        const tables = [
            'about_contents',
            'blog_posts',
            'classes',
            'events',
            'gallery_items',
            'hero_content',
            'navigation_items',
            'news_items',
            'subjects',
            'testimonials',
            'users'
        ];

        // First, drop known constraints that might block modification
        const constraints = [
            { table: 'classes', name: 'classes_ibfk_1' },
            { table: 'navigation_items', name: 'navigation_items_ibfk_148' },
            { table: 'navigation_items', name: 'navigation_items_ibfk_132' },
            { table: 'subjects', name: 'subjects_ibfk_1' },
            { table: 'users', name: 'users_ibfk_1' },
            { table: 'about_contents', name: 'about_contents_ibfk_1' }, // Might exist
            { table: 'gallery_items', name: 'gallery_items_ibfk_1' } // Might exist
        ];

        for (const conn of constraints) {
            try {
                await sequelize.query(`ALTER TABLE \`${conn.table}\` DROP FOREIGN KEY \`${conn.name}\`;`);
                console.log(`Dropped FK ${conn.name} on ${conn.table}`);
            } catch (e) { }
        }

        // Now modify ALL school_id columns to CHAR(36) BINARY
        for (const table of tables) {
            try {
                await sequelize.query(`ALTER TABLE \`${table}\` MODIFY \`school_id\` CHAR(36) BINARY;`);
                console.log(`Success: ${table}.school_id is now CHAR(36) BINARY`);
            } catch (e) {
                console.log(`Error on ${table}: ${e.message}`);
            }
        }

        // Standardize schools.id
        await sequelize.query(`ALTER TABLE \`schools\` MODIFY \`id\` CHAR(36) BINARY NOT NULL;`);

        // Fix orphans: Update any non-UUID or non-matching school_id to the first school's UUID
        const firstSchoolId = '079f6234-cfd9-4124-a5fe-1b7de6452170';
        for (const table of tables) {
            try {
                const [result] = await sequelize.query(`UPDATE \`${table}\` SET \`school_id\` = '${firstSchoolId}' WHERE \`school_id\` NOT IN (SELECT \`id\` FROM \`schools\`)`);
                console.log(`Fixed orphans in ${table}: ${result.affectedRows} rows updated`);
            } catch (e) {
                console.log(`Failed to fix orphans in ${table}: ${e.message}`);
            }
        }

        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        console.log('Repair finished. Attempting sync...');
        // We use force: false to avoid dropping tables, alter: true to adjust schema
        await sequelize.sync({ alter: true });
        console.log('SYNC SUCCESSFUL!');

    } catch (error) {
        console.error('REPAIR FAILED:', error.message);
        if (error.original) console.error('SQL ERROR:', error.original.sqlMessage);
    } finally {
        await sequelize.close();
    }
}

repairDB();

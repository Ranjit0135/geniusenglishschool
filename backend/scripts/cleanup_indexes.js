const { sequelize } = require('../models');

async function cleanup() {
    const tables = ['blog_posts', 'events', 'news_items'];

    for (const table of tables) {
        console.log(`Cleaning up indexes for table: ${table}...`);
        try {
            const [results] = await sequelize.query(`SHOW INDEX FROM ${table}`);
            const indexNames = [...new Set(results.map(r => r.Key_name))];

            // We want to find indexes like 'slug', 'slug_2', 'slug_3', etc.
            // and drop them so sequelize can recreate a clean one with our new explicit name.
            const slugIndexes = indexNames.filter(name => name === 'slug' || /^slug_\d+$/.test(name));

            for (const indexName of slugIndexes) {
                console.log(`  Dropping index: ${indexName} from ${table}`);
                try {
                    await sequelize.query(`ALTER TABLE ${table} DROP INDEX ${indexName}`);
                } catch (dropErr) {
                    console.error(`    Failed to drop ${indexName}: ${dropErr.message}`);
                }
            }
        } catch (err) {
            console.error(`Error processing table ${table}: ${err.message}`);
        }
    }

    console.log('Cleanup completed.');
    await sequelize.close();
}

cleanup();

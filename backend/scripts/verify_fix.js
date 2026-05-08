const { sequelize } = require('../models');

async function verify() {
    try {
        const [results] = await sequelize.query('SHOW INDEX FROM blog_posts');
        console.log('Current indexes on blog_posts:');
        results.forEach(r => console.log(`- ${r.Key_name}`));

        const uniqueNames = new Set(results.map(r => r.Key_name));
        if (uniqueNames.has('blog_post_slug_unique')) {
            console.log('SUCCESS: Explicit unique index found.');
        } else {
            console.log('WARNING: Expected explicit index not found yet.');
        }

        if (uniqueNames.size < 10) {
            console.log(`Index count is healthy: ${uniqueNames.size}`);
        } else {
            console.log(`Index count is still high: ${uniqueNames.size}`);
        }
    } catch (err) {
        console.error('Verification failed:', err.message);
    } finally {
        await sequelize.close();
    }
}

verify();

const { sequelize } = require('./models');

async function checkData() {
    try {
        await sequelize.authenticate();

        const [schools] = await sequelize.query('SELECT id, name FROM schools');
        console.log('Schools in DB:', schools);

        const tables = [
            'users',
            'about_contents',
            'blog_posts',
            'classes',
            'events',
            'gallery_items',
            'hero_content',
            'navigation_items',
            'news_items',
            'subjects',
            'testimonials'
        ];

        for (const table of tables) {
            try {
                const [count] = await sequelize.query(`SELECT COUNT(*) as cnt FROM \`${table}\``);
                const [orphans] = await sequelize.query(`SELECT COUNT(*) as cnt FROM \`${table}\` WHERE school_id NOT IN (SELECT id FROM schools)`);
                console.log(`Table ${table}: total=${count[0].cnt}, orphans=${orphans[0].cnt}`);
            } catch (e) {
                console.log(`Table ${table} might not exist or has issues: ${e.message}`);
            }
        }

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();

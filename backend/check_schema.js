const sequelize = require('./config/database');
const fs = require('fs');

(async () => {
    try {
        const [results] = await sequelize.query("DESCRIBE blog_posts");
        fs.writeFileSync('schema_blog.json', JSON.stringify(results, null, 2));
        console.log('Schema written to schema_blog.json');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

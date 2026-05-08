const sequelize = require('./config/database');
const { School } = require('./models');

async function cleanup() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // 1. Convert any empty string subdomains to NULL
        const [result] = await sequelize.query("UPDATE schools SET subdomain = NULL WHERE subdomain = ''");
        console.log('Subdomain cleanup successful:', result);

        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

cleanup();

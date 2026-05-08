const { syncDatabase } = require('./models');

(async () => {
    console.log('Starting Force Sync...');
    await syncDatabase();
    console.log('Force Sync Complete.');
    process.exit(0);
})();

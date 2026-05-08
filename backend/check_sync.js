const { sequelize, PrincipalContent } = require('./models');

async function checkSync() {
    try {
        console.log('Starting FINAL manual sync check...');
        await sequelize.authenticate();
        console.log('Connected.');

        await sequelize.sync({ alter: true });
        console.log('Sync completed successfully.');

        const [results] = await sequelize.query("SHOW TABLES LIKE 'principal_contents'");
        console.log('PrincipalContents table check:', results);

    } catch (error) {
        console.error('SYNC FAILED!');
        console.error('Error Message:', error.message);
        if (error.original) {
            console.error('Original SQL Error:', error.original.sqlMessage);
            console.error('SQL State:', error.original.sqlState);
        }
    } finally {
        await sequelize.close();
    }
}

checkSync();

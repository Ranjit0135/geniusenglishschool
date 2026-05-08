const Hero = require('./src/models/Hero');
const { sequelize } = require('./src/config/db');

async function check() {
    try {
        const [results] = await sequelize.query("DESCRIBE heros");
        console.table(results);
        const heros = await Hero.findAll();
        console.log('--- ALL HEROS ---');
        console.log(JSON.stringify(heros, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
check();

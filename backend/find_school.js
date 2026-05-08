const sequelize = require('./config/database');
const School = require('./models/School');

async function findSchool() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const schools = await School.findAll();
        if (schools.length === 0) {
            console.log('No schools found.');
        } else {
            console.log('Schools found:');
            schools.forEach(s => {
                console.log(`ID: ${s.id}, Name: ${s.name}, Subdomain: ${s.subdomain}`);
            });
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

findSchool();

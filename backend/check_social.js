const { SocialLink, School } = require('./models');
const fs = require('fs');

async function checkDB() {
    try {
        const schools = await School.findAll();
        const links = await SocialLink.findAll();

        const data = {
            schools: schools.map(s => ({ id: s.id, name: s.name, subdomain: s.subdomain })),
            links: links.map(l => ({ id: l.id, platform: l.platform, url: l.url, school_id: l.school_id, is_active: l.is_active }))
        };

        fs.writeFileSync('db_check.json', JSON.stringify(data, null, 2));
        console.log('Database data written to db_check.json');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkDB();

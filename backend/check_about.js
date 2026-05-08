const { AboutContent } = require('./models');

async function checkAbout() {
    try {
        const about = await AboutContent.findAll();
        console.log(JSON.stringify(about, null, 2));
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        process.exit();
    }
}

checkAbout();

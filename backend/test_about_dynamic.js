const { AboutContent, School } = require('./models');

async function verifyAbout() {
    try {
        // Find a school
        const school = await School.findOne();
        if (!school) {
            console.error('No school found to associate about content with.');
            return;
        }

        const school_id = school.id;
        console.log(`Using School ID: ${school_id}`);

        // Data to update/create
        const testData = {
            school_id,
            title: "Dynamic About Title",
            description: "This is a dynamically updated description for our school.",
            mission: "Our dynamic mission statement.",
            vision: "Our dynamic vision statement.",
            history_title: "Our Dynamic Story",
            tour_title: "Our Dynamic School Tour",
            tour_description: "Experience our school through this dynamically described tour.",
        };

        // Find existing or create new
        let about = await AboutContent.findOne({ where: { school_id } });
        if (about) {
            console.log('Updating existing About content...');
            await about.update(testData);
        } else {
            console.log('Creating new About content...');
            about = await AboutContent.create(testData);
        }

        console.log('Verification: Fetching updated content...');
        const updatedAbout = await AboutContent.findOne({ where: { school_id } });
        console.log(JSON.stringify(updatedAbout, null, 2));

        if (updatedAbout.history_title === testData.history_title &&
            updatedAbout.tour_title === testData.tour_title) {
            console.log('SUCCESS: Dynamic fields verified in database.');
        } else {
            console.log('FAILURE: Dynamic fields not correctly saved.');
        }

    } catch (error) {
        console.error('VERIFICATION ERROR:', error);
    } finally {
        process.exit();
    }
}

verifyAbout();

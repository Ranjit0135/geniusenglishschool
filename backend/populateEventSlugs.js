const { Event } = require('./models');
const { v4: uuidv4 } = require('uuid');

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + uuidv4().slice(0, 8);
};

(async () => {
    try {
        const events = await Event.findAll({ where: { slug: null } });
        console.log(`Found ${events.length} events without slugs.`);
        for (const event of events) {
            event.slug = generateSlug(event.title);
            await event.save();
            console.log(`Populated slug for: ${event.title} -> ${event.slug}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error populating slugs:', error);
        process.exit(1);
    }
})();

const { NewsItem, BlogPost, Event } = require('./models');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';

(async () => {
    try {
        const updateAll = async (Model, name) => {
            const items = await Model.findAll({ where: { image_url: null } });
            console.log(`Found ${items.length} ${name} without images.`);
            for (const item of items) {
                item.image_url = DEFAULT_IMAGE;
                await item.save();
                console.log(`Set default image for ${name}: ${item.title}`);
            }
        };

        await updateAll(NewsItem, 'News');
        await updateAll(BlogPost, 'Blog');
        await updateAll(Event, 'Event');

        process.exit(0);
    } catch (e) {
        console.error('Update failed:', e);
        process.exit(1);
    }
})();

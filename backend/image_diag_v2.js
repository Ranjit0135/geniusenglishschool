const { NewsItem, BlogPost, Event } = require('./models');
(async () => {
    try {
        const news = await NewsItem.findAll();
        const blogs = await BlogPost.findAll();
        const events = await Event.findAll();
        console.log('--- DIAGNOSTIC RESULTS ---');
        console.log('NEWS:', JSON.stringify(news.map(i => ({ id: i.id, title: i.title, image: i.image_url })), null, 2));
        console.log('BLOGS:', JSON.stringify(blogs.map(i => ({ id: i.id, title: i.title, image: i.image_url })), null, 2));
        console.log('EVENTS:', JSON.stringify(events.map(i => ({ id: i.id, title: i.title, image: i.image_url })), null, 2));
        process.exit(0);
    } catch (e) {
        console.error('Diagnostic failed:', e);
        process.exit(1);
    }
})();

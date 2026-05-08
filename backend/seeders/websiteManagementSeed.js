const { sequelize, School, AboutContent, GalleryItem, BlogPost, Event } = require('../models');

const seedWebsiteData = async () => {
    try {
        // Sync models (ensures new tables exist)
        await sequelize.sync();
        console.log('Database synced.');

        // 1. Get or Create Default School
        let school = await School.findOne();
        if (!school) {
            school = await School.create({
                name: 'Genius School',
                subdomain: 'genius',
                logo_url: '/assets/logo.png'
            });
            console.log('Created default school.');
        }

        // 2. Seed About Content
        await AboutContent.create({
            school_id: school.id,
            title: 'Welcome to Genius School',
            description: 'We provide a world-class education for students from all walks of life. Our curriculum is designed to foster creativity, critical thinking, and leadership.',
            mission: 'To empower students to reach their full potential through innovative teaching and a supportive environment.',
            vision: 'To be a global leader in transformative education, shaping the future leaders of tomorrow.',
            image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
        });
        console.log('About content seeded.');

        // 3. Seed Gallery Items
        const galleryItems = [
            { title: 'Modern Library', media_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800', media_type: 'IMAGE', category: 'Facilities' },
            { title: 'Computer Lab', media_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', media_type: 'IMAGE', category: 'Academic' },
            { title: 'Sports Grounds', media_url: 'https://images.unsplash.com/photo-1511406361295-0a5ff814c00b?w=800', media_type: 'IMAGE', category: 'Sports' }
        ];
        for (const item of galleryItems) {
            await GalleryItem.create({ school_id: school.id, ...item });
        }
        console.log('Gallery items seeded.');

        // 4. Seed Blog Posts (News & Updates)
        const blogPosts = [
            {
                school_id: school.id,
                title: 'Learn about the year-end creative show for our children',
                slug: 'year-end-creative-show-' + Math.random().toString(36).substr(2, 5),
                content: 'Join us for an exciting showcase of our students\' artistic talents and creative projects. The event will feature visual arts, music performances, and more.',
                excerpt: 'Join us for an exciting showcase of our students\' artistic talents and creative projects.',
                author_name: 'Admin',
                category: 'School News',
                image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
                is_sticky: true,
                is_published: true
            },
            {
                school_id: school.id,
                title: 'Annual parent-teacher conference announcement',
                slug: 'parent-teacher-conference-' + Math.random().toString(36).substr(2, 5),
                content: 'Mark your calendars for our upcoming parent-teacher meetings this month. This is a great opportunity to discuss your child\'s progress and school future.',
                excerpt: 'Mark your calendars for our upcoming parent-teacher meetings this month.',
                author_name: 'Principal',
                category: 'Events',
                image_url: 'https://images.unsplash.com/photo-1544640808-32215145390d?w=1200',
                is_published: true
            }
        ];
        for (const post of blogPosts) {
            await BlogPost.create(post);
        }
        console.log('Blog posts seeded.');

        // 5. Seed Events
        const events = [
            {
                school_id: school.id,
                title: 'Founders Day & Genius Alumni Class Day',
                date: '2026-02-15',
                time_range: '8:00am - 5:00pm',
                location: 'Main Auditorium'
            },
            {
                school_id: school.id,
                title: "Genius's Day of Full Life",
                date: '2026-02-22',
                time_range: '9:00am - 4:00pm',
                location: 'School Grounds'
            }
        ];
        for (const event of events) {
            await Event.create(event);
        }
        console.log('Events seeded.');

        console.log('All website dummy data seeded successfully!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
};

seedWebsiteData();

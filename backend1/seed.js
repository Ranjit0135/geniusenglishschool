const { sequelize, connectDB } = require('./src/config/db');
const User = require('./src/models/User');
const GlobalSetting = require('./src/models/GlobalSetting');
const Hero = require('./src/models/Hero');
const News = require('./src/models/News');
const Gallery = require('./src/models/Gallery');
const About = require('./src/models/About');
const Navigation = require('./src/models/Navigation');
const slugify = require('./src/utils/slugify');

const seed = async () => {
    try {
        await connectDB();
        await sequelize.sync({ force: true });

        console.log('Seeding initial data...');

        // Create Admin
        await User.create({
            name: 'Genius Admin',
            email: 'admin@genius.edu.np',
            password: 'adminpassword123',
            role: 'admin'
        });

        // Create Default Settings
        await GlobalSetting.create({
            schoolName: 'Genius English School',
            tagline: 'Fostering Excellence in Every Child',
            address: 'Nayabazar, Kathmandu, Nepal',
            phone: '+977-9813990060',
            email: 'info@genius.edu.np',
            facebookUrl: 'https://www.facebook.com/ourgeniuskids',
            youtubeUrl: 'https://www.youtube.com/@genius.englishschool'
        });

        // Create Default Hero
        await Hero.create({
            title: 'Experience Excellence in Education',
            subtitle: 'Fostering academic brilliance and holistic development since 2000.',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-children-playing-and-learning-with-clay-in-a-pottery-class-42617-large.mp4',
            imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop'
        });

        // Create News Items
        const newsItems = [
            {
                title: 'Annual Sports Meet 2024',
                content: 'Our annual sports meet was a grand success with participation from all grades. Students showcased incredible teamwork and athletic prowess.',
                category: 'Sports',
                imageUrl: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?q=80&w=800&auto=format&fit=crop',
                isAnnouncement: false
            },
            {
                title: 'New Science Lab Inauguration',
                content: 'We are thrilled to announce the opening of our state-of-the-art Science Laboratory, equipped with the latest tools for practical learning.',
                category: 'Academic',
                imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
                isAnnouncement: true
            },
            {
                title: 'Admission Open for Session 2024-25',
                content: 'Admissions are now open for the upcoming academic session. Visit our campus for more details and registration forms.',
                category: 'General',
                imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
                isAnnouncement: true
            }
        ];

        for (const item of newsItems) {
            await News.create({
                ...item,
                slug: slugify(item.title)
            });
        }

        // Create Gallery Items
        const galleryItems = [
            { imageUrl: 'https://images.unsplash.com/photo-1577896335477-b5e08b77a3d9?q=80&w=800&auto=format&fit=crop', caption: 'Interactive Classroom', category: 'Campus' },
            { imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop', caption: 'Student Art Exhibition', category: 'Academic' },
            { imageUrl: 'https://images.unsplash.com/photo-1526379566213-3932fa2ed586?q=80&w=800&auto=format&fit=crop', caption: 'Annual Cultural Program', category: 'Events' },
            { imageUrl: 'https://images.unsplash.com/photo-1542385108-7b9ec3471021?q=80&w=800&auto=format&fit=crop', caption: 'Cricket Tournament', category: 'Sports' }
        ];
        await Gallery.bulkCreate(galleryItems);

        // Create About Content
        await About.create({
            title: 'Since 2000',
            content: 'Genius English School is a top affiliated school with a beautiful, centrally located campus in Nayabazar, Kathmandu, Nepal.',
            objectives: [
                'Fostering excellence in every child',
                'Nurturing a global perspective in education',
                'Building character and leadership skills'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1541339905195-062f5570c872?q=80&w=1200&auto=format&fit=crop'
        });

        // Create Default Navigation
        const defaultNav = [
            { label: 'Home', path: '/', order: 1 },
            { label: 'About Us', path: '/about', order: 2 },
            { label: 'Updates & Events', path: '/news-events', order: 3 },
            { label: 'Gallery', path: '/gallery', order: 4 },
            { label: 'Contact Us', path: '/contact', order: 5 },
        ];
        await Navigation.bulkCreate(defaultNav);

        console.log('✅ Full seeding completed with dummy data.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();

const sequelize = require('../config/database');
const School = require('./School');
const User = require('./User');
const NavigationItem = require('./NavigationItem');
const Class = require('./Class');
const Subject = require('./Subject');
const AboutContent = require('./AboutContent');
const GalleryItem = require('./GalleryItem');
const BlogPost = require('./BlogPost');
const Event = require('./Event');
const NewsItem = require('./NewsItem');
const HeroContent = require('./HeroContent');
const PrincipalContent = require('./PrincipalContent');
const Testimonial = require('./Testimonial');
const SocialLink = require('./SocialLink');
const ContactContent = require('./ContactContent');
const Course = require('./Course');

// Define Relationships
School.hasMany(BlogPost, { foreignKey: 'school_id' });
BlogPost.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(Event, { foreignKey: 'school_id' });
Event.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(NewsItem, { foreignKey: 'school_id' });
NewsItem.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(GalleryItem, { foreignKey: 'school_id' });
GalleryItem.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(User, { foreignKey: 'school_id' });
User.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(NavigationItem, { foreignKey: 'school_id' });
NavigationItem.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(Class, { foreignKey: 'school_id' });
Class.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(Subject, { foreignKey: 'school_id' });
Subject.belongsTo(School, { foreignKey: 'school_id' });

School.hasOne(AboutContent, { foreignKey: 'school_id' });
AboutContent.belongsTo(School, { foreignKey: 'school_id' });

School.hasOne(HeroContent, { foreignKey: 'school_id' });
HeroContent.belongsTo(School, { foreignKey: 'school_id' });

School.hasOne(PrincipalContent, { foreignKey: 'school_id' });
PrincipalContent.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(Testimonial, { foreignKey: 'school_id' });
Testimonial.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(SocialLink, { foreignKey: 'school_id' });
SocialLink.belongsTo(School, { foreignKey: 'school_id' });

School.hasOne(ContactContent, { foreignKey: 'school_id' });
ContactContent.belongsTo(School, { foreignKey: 'school_id' });

School.hasMany(Course, { foreignKey: 'school_id' });
Course.belongsTo(School, { foreignKey: 'school_id' });

// Sync all models
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Enable alter to force schema updates (e.g. TEXT for images)
        console.log('Database synced successfully (alter: true)');
    } catch (error) {
        console.error('Database sync failed:', error);
    }
};

module.exports = {
    sequelize,
    syncDatabase,
    School,
    User,
    NavigationItem,
    Class,
    Subject,
    AboutContent,
    GalleryItem,
    BlogPost,
    Event,
    NewsItem,
    HeroContent,
    PrincipalContent,
    Testimonial,
    SocialLink,
    ContactContent,
    Course
};


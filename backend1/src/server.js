const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/hero', require('./routes/heroRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api', require('./routes/navigationRoutes'));

// Root Check
app.get('/', (req, res) => {
    res.json({ message: "Genius School Backend1 (v2) is Running 🚀" });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await connectDB();

        // Ensure all models are loaded before sync
        require('./models/User');
        require('./models/Hero');
        require('./models/News');
        require('./models/Gallery');
        require('./models/About');
        require('./models/Blog');
        require('./models/Event');
        require('./models/GlobalSetting');
        require('./models/Navigation');

        // Sync models
        console.log('--- Syncing Database ---');
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized.');

        // Debug table structure
        try {
            const [results] = await sequelize.query("DESCRIBE heros");
            console.log('--- [DB DEBUG] Table Structure (heros) ---');
            console.table(results);
        } catch (dbErr) {
            console.error('--- [DB DEBUG] Failed to describe table ---', dbErr.message);
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Startup error:', error);
    }
};

startServer();

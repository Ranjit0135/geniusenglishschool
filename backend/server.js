require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const upload = require('./middleware/uploadMiddleware');
const cookieParser = require('cookie-parser');
const { syncDatabase } = require('./models');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:5175',
            'http://127.0.0.1:3000'
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-school-id', 'x-subdomain']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/public', require('./routes/navigationRoutes'));
app.use('/api/ui', require('./routes/uiRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/social-links', require('./routes/socialRoutes'));


// Test Route
app.get('/', (req, res) => {
    res.send({ message: 'Genius School SaaS Backend is Running 🚀' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Start Server and Sync DB
const server = app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await syncDatabase();
    } catch (err) {
        console.error('CRITICAL: Sync Database failed during startup:', err);
    }
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`ERROR: Port ${PORT} is already in use. Please kill the process using this port.`);
    } else {
        console.error('ERROR: Server failed to start:', error);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

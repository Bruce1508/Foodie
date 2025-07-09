import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Foodie API is running',
        version: 'Express v4'
    });
});

// Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Basic server working!' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
    
    // Test database connection
    try {
        await testConnection();
        console.log('✅ Database connection successful!');
    } catch (error) {
        console.log('⚠️  Database connection failed (this is OK for now)');
        console.log('   Create .env file and setup PostgreSQL when ready');
    }
    
    console.log('📱 CORS enabled for all origins (development mode)');
    console.log('🔐 Auth routes enabled:');
    console.log(`   POST /auth/google - Google authentication`);
    console.log(`   GET  /auth/me - Get current user`);
    console.log(`   POST /auth/signout - Sign out`);
    console.log('👥 Users routes enabled:');
    console.log(`   GET  /users - Get all users`);
    console.log(`   GET  /users/:id - Get user by ID`);
    console.log(`   POST /users - Create new user`);
    console.log('✅ EXPRESS V4 - NO ERROR HANDLERS (PRODUCTION NEEDS THEM)');
});


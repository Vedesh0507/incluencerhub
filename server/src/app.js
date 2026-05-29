const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// CORS configuration - Allow frontend connection from localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Initialize Passport middleware
app.use(passport.initialize());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;

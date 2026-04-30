const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

// Rate limiting configuration
const rateLimitStore = new Map();

const authRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;
  
  const key = `auth_${ip}`;
  const record = rateLimitStore.get(key);
  
  if (!record || now - record.startTime > windowMs) {
    rateLimitStore.set(key, { startTime: now, count: 1 });
    return next();
  }
  
  if (record.count >= maxRequests) {
    const resetTime = new Date(record.startTime + windowMs);
    return res.status(429).json({
      success: false,
      message: `Too many login attempts. Please try again after ${Math.ceil((record.startTime + windowMs - now) / 60000)} minutes`,
      payload: null,
    });
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  next();
};

// Import routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Helmet - security headers untuk semua route
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/user', userRoutes);
app.use('/items', itemRoutes);
app.use('/transaction', transactionRoutes);
app.use('/reports', reportRoutes);
app.use('/auth', authRateLimiter, authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    payload: null,
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
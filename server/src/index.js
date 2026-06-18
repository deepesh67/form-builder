// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/form');
const responseRoutes = require('./routes/response');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow Vite's dynamic ports (5173, 5174, 5175, 5176) + configured CLIENT_URL
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter(Boolean);

// Middleware
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

// Health check
app.get('/', (req, res) => res.send('API is running'));

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});

// Graceful error handling — prevents silent crashes on port conflict
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run this command to free it: taskkill /F /PID $(netstat -ano | findstr :${PORT})`);
    console.error(`   Then restart with: npm run dev\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

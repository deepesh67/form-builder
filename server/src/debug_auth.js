// C:/Users/user/OneDrive/Desktop/form management/server/src/debug_auth.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

const debug = async () => {
  await connectDB();
  const user = await User.findOne({ email: 'admin@example.com' });
  if (!user) {
    console.log('User not found');
  } else {
    console.log('Found user:', user.email);
    console.log('Hashed Password in DB:', user.password);
    const isMatch = await bcrypt.compare('password123', user.password);
    console.log('Does "password123" match?', isMatch);
    
    // Test matchPassword method
    const isMatchMethod = await user.matchPassword('password123');
    console.log('Does matchPassword method work?', isMatchMethod);
  }
  process.exit(0);
};

debug();

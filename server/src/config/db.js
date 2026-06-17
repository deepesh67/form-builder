const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    console.log('--- Database Connection Diagnostic ---');
    console.log(`Target URI: ${uri.split('@').pop()}`); 
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database Name: ${conn.connection.name}`);
    console.log(`📊 Connection State: ${mongoose.STATES[conn.connection.readyState]}`);
    console.log('--------------------------------------');

    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('💡 Tip: No collections found. Creating "system_init"...');
      await db.createCollection('system_init');
      await db.collection('system_init').insertOne({ 
        message: 'Database initialized successfully', 
        timestamp: new Date() 
      });
    }

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
let MongoMemoryServer;
try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {
  console.log('mongodb-memory-server not found, skipping in-memory fallback');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/intern-portal';

  try {
    // Try connecting to local MongoDB first
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected (Local)');
  } catch (err) {
    console.log('Local MongoDB connection failed/timeout.');

    if (MongoMemoryServer) {
      console.log('Attempting to start in-memory database fallback...');
      try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('MongoDB Connected (In-Memory Fallback)');
        console.log('NOTE: Data will be lost when server restarts.');
      } catch (memErr) {
        console.error('Failed to start in-memory database:', memErr);
      }
    } else {
      console.error('Please ensure MongoDB is running or install mongodb-memory-server.');
    }
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/applications', require('./routes/applications'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Intern Portal API Running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
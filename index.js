require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();


// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://127.0.0.1:5500', 'https://heyfey-dev.github.io', 'https://csvupload-backend.onrender.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


app.use(express.json());

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
     
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

connectToDatabase();

// Endpoint to receive and store records directly without a schema
app.post('/api/addRecord', async (req, res) => {
    try {
      console.log("Received data:", req.body); // Check the structure of req.body here
  
      // Extract fields if they are nested within 'fields'
      const data = req.body.fields || req.body; // Use req.body.fields if it exists, else use req.body directly
  
      // Access the 'records' collection directly
      const db = mongoose.connection.db;
      const result = await db.collection('records').insertOne(data);
  
      res.status(200).json({ message: 'Record added successfully', result });
    } catch (error) {
      console.error('Error inserting record:', error);
      res.status(500).json({ error: 'Failed to add record to MongoDB' });
    }
  });

  app.get('/', (req, res) => {
    res.send("Server is running!");
});

  
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.warn(`App listening on http://localhost:${port}`);
});

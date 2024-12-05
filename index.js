require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();


// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://127.0.0.1:5500', 'https://diwy24.github.io', 'https://csv-backend-6qy5.onrender.com'];
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

// Define the GET route
app.get('/api/getRecords', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const records = await db.collection('records').find({}, { projection: { _id: 0, phoneNumber: 1, email: 1, firstName: 1 } }).toArray();

    if (records.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }

    // Sending data to the external URL
    const targetUrl = 'https://hook.eu2.make.com/ratbvk2fp522tas16zzvsi16tmzwwnn9'; // Replace with your target URL
    try {
      const response = await axios.post(targetUrl, records);
      console.log('Data sent successfully to the external URL:', response.data);
    } catch (error) {
      console.error('Error sending data to the external URL:', error.message);
    }

    res.status(200).json({ message: 'Records fetched and sent successfully', records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records from MongoDB' });
  }
});

// Endpoint to add records
app.post('/api/addRecord', async (req, res) => {
  try {
    const data = req.body.fields || req.body;
    const db = mongoose.connection.db;
    const result = await db.collection('records').insertOne(data);
    res.status(200).json({ message: 'Record added successfully', result });
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({ error: 'Failed to add record to MongoDB' });
  }
});

// Endpoint to receive and store records directly without a schema
// app.post('/api/addRecord', async (req, res) => {
//     try {
//       console.log("Received data:", req.body); // Check the structure of req.body here
  
//       // Extract fields if they are nested within 'fields'
//       const data = req.body.fields || req.body; // Use req.body.fields if it exists, else use req.body directly
  
//       // Access the 'records' collection directly
//       const db = mongoose.connection.db;
//       const result = await db.collection('records').insertOne(data);
  
//       res.status(200).json({ message: 'Record added successfully', result });
//     } catch (error) {
//       console.error('Error inserting record:', error);
//       res.status(500).json({ error: 'Failed to add record to MongoDB' });
//     }
//   });

  app.get('/', (req, res) => {
    res.send("Server is running!");
});

  
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.warn(`App listening on http://localhost:${port}`);
});

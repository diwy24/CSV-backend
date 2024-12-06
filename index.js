require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Import axios for HTTP requests

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
app.use(express.json()); // Parse incoming JSON requests

// Endpoint to receive data and send it to the specified URL
app.post('/api/addRecord', async (req, res) => {
  try {
    const targetUrl = 'https://hook.eu2.make.com/ratbvk2fp522tas16zzvsi16tmzwwnn9';

    // Log received data for debugging
    console.log('Received data:', req.body);

    // Send data to the external URL
    const response = await axios.post(targetUrl, req.body);
    console.log('Data successfully sent to the target URL:', response.data);

    res.status(200).json({
      message: 'Data sent successfully to the external URL',
      sentData: req.body,
      response: response.data
    });
  } catch (error) {
    console.error('Error sending data to the external URL:', error.message);
    res.status(500).json({
      error: 'Failed to send data to the external URL',
      details: error.message
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.warn(`App listening on http://localhost:${port}`);
});

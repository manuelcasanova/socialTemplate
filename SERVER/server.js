const express = require('express');
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3500;


// Apply CORS middleware with custom options
 app.use(cors(corsOptions));

// Parse JSON in incoming requests
app.use(express.json());

// Simple /ping endpoint
app.get('/ping', (req, res) => {
  res.status(200).send('pong! The server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server listening on the specified port
app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}.`);
});



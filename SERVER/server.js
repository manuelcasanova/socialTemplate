require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module

const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware configuration
app.use(credentials); // Handle CORS credentials
app.use(cors(corsOptions)); // Apply CORS middleware with custom options
app.use(express.json()); // Parse JSON in incoming requests
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data
app.use(logger); // Custom middleware logger


// Simple /ping endpoint
app.get('/ping', (req, res) => {
    res.status(200).send('pong! The server is running!');
});

// Catch-all route for 404 errors
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Error handling middleware
app.use(errorHandler);

// Server listening on the specified port
const server = app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}.`);
});

// Graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
process.on('SIGINT', () => {
  server.close(() => {
      console.log('Server shut down gracefully.');
      process.exit(0);
  });
});
process.on('SIGTERM', () => {
  server.close(() => {
      console.log('Server shut down gracefully.');
      process.exit(0);
  });
});

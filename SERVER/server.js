require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // for constructing the path to the 404.html error page

const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const customJsonParser = require('./middleware/customJsonParser');

const app = express();
const PORT = process.env.PORT || 3500;

// Middleware configuration
app.use(credentials); // Handle CORS credentials
app.use(cors(corsOptions)); // Apply CORS middleware with custom options
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data
app.use(logger); // Custom middleware logger
app.use(customJsonParser);


// Custom middleware for handling JSON parsing errors
app.use((req, res, next) => {
    express.json()(req, res, (err) => {
        if (err) {
            // Pass the error to the error handling middleware
            return next(err);
        }
        next();
    });
});

// Simple /ping endpoint
app.get('/ping', (req, res) => {
    res.status(200).send('pong! The server is running!');
});

// Define the /some-endpoint route
app.post('/some-endpoint', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    res.status(200).send('Success!'); 
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
  console.log('Received SIGINT. Initiating graceful shutdown...');
  shutdown();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Initiating graceful shutdown...');
  shutdown();
});

const shutdown = () => {
  server.close((err) => {
      if (err) {
          console.error('Error while shutting down:', err);
          process.exit(1); // Exit with failure code
      }
      console.log('Closed out remaining connections. Server shut down gracefully.');
      process.exit(0); // Exit with success code
  });

  // Set a timeout to force shutdown if it takes too long
  setTimeout(() => {
      console.error('Forcing shutdown after timeout.');
      process.exit(1);
  }, 10000); // 10 seconds
};

// Mocha can access it directly
module.exports = server;

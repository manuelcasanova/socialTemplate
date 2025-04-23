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
const verifyJWT = require('./middleware/verifyJWT')

const app = express();
const PORT = process.env.PORT || 3500;
const pool = require('./config/db')
const scheduleSubscriptionUpdates = require('./routes/subscriptionScheduler')


// Middleware for production: Redirect HTTP to HTTPS
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

// Middleware configuration
app.use(credentials); // Handle CORS credentials
app.use(cors(corsOptions)); // Apply CORS middleware with custom options

// Handle CORS preflight requests for specific routes
app.options('/some-endpoint', cors(corsOptions)); // Explicitly handle preflight request


app.use(cookieParser()); // Middleware to parse cookies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data
app.use(logger); // Custom middleware logger
app.use(customJsonParser);

// Serve static files from the 'media' folder
app.use('/media', express.static(path.join(__dirname, 'media')));


// Simple /ping endpoint
app.get('/ping', (req, res) => {
    res.status(200).send('pong! The server is running!');
});

//Triggers at midnight every day to update subscription status to is_active false if due_date is in the past.
scheduleSubscriptionUpdates();

app.use('/signup', require('./routes/auth/signup'));

app.use('/restore-account', require('./routes/auth/restore-account'));

app.use('/auth', require('./routes/auth/auth'));
app.use('/refresh', require('./routes/auth/refresh'));
app.use('/logout', require('./routes/auth/logout'))
app.use('/forgot-password', require('./routes/auth/forgot-password'));
app.use('/verify-email', require('./routes/auth/verify-email'));
app.use('/resend-verification-email', require('./routes/auth/auth'));


app.use(verifyJWT);

app.use('/users', require('./routes/api/users'));  
app.use('/social', require('./routes/api/social')); 
app.use('/messages', require('./routes/api/messages')); 
app.use('/posts', require('./routes/api/posts')); 
app.use('/reports', require('./routes/api/reports'));
app.use('/reports-comments', require('./routes/api/reports-comments'));
app.use('/roles', require('./routes/api/roles'));
app.use('/log-events', require('./routes/api/log-events'));


// app.use('/login-history', (req, res, next) => {
//     console.log("Request is hitting /login-history route:", req.originalUrl); // Log the URL
//     next(); 
//   });

app.use('/login-history', require('./routes/api/login-history'));




// Define the /some-endpoint route specifically with type checks
app.post('/some-endpoint', (req, res) => {
    // Check for JSON content type
    if (req.is('application/json')) {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Invalid JSON' });
        }
        return res.status(200).send('Success!');
    }

    // Check for URL-encoded content type
    if (req.is('application/x-www-form-urlencoded')) {
        return res.status(200).send('Success!');
    }

    // Return 415 if neither JSON nor URL-encoded content type
    return res.status(415).json({ error: 'Unsupported Media Type' });
});

// Catch-all for unsupported methods on /some-endpoint
app.all('/some-endpoint', (req, res) => {
    res.set('Allow', 'POST'); // Indicate allowed methods
    res.status(405).send('Method Not Allowed');
});

// Comment in for test (comment in test, as well: "Test error handling middleware")
// app.get('/error', (req, res, next) => {
//     next(new Error('This is a forced error'));
// });


// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory (optional, defaults to "views" in your root directory)
app.set('views', path.join(__dirname, 'views'));

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

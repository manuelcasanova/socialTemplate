//middleware that can handle JSON parsing errors gracefully before they reach the default error handler. For testing purposes.

const bodyParser = require('body-parser');

const customJsonParser = (req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err) {
            // Return a custom error response for invalid JSON
            return res.status(400).json({ error: 'Invalid JSON' });
        }
        next();
    });
};

module.exports = customJsonParser;


//Before, I used to just have this code below in server.js, but I created a custom middleware, to avoid errors on testing.

// app.use(express.json()); // Parse JSON in incoming requests
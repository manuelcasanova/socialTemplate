//middleware that can handle JSON parsing errors gracefully before they reach the default error handler. For testing purposes.

// middleware/customJsonParser.js
const bodyParser = require('body-parser');

const customJsonParser = (req, res, next) => {
    // Use body-parser's JSON parser for parsing the request body
    bodyParser.json()(req, res, (err) => {
        if (err) {
            // Handle JSON parsing errors by returning a custom error message
            return res.status(400).json({ error: 'Invalid JSON' });
        }
        next();  // Proceed to the next middleware or route handler if JSON parsing is successful
    });
};

module.exports = customJsonParser;



//Before, I used to just have this code below in server.js, but I created a custom middleware, to avoid errors on testing.

// app.use(express.json()); // Parse JSON in incoming requests
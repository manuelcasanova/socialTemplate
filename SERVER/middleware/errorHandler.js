const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    // Handle SyntaxErrors (which includes invalid JSON)
    if (err instanceof SyntaxError) {
        logEvents(`${err.name}: ${err.message}`, 'errLog.txt'); // Log the error
        console.error(err.stack); // Log the stack trace
        return res.status(400).json({ error: 'Invalid JSON' }); // Respond with 400 for invalid JSON
    }
    
    // Handle other errors (500 Internal Server Error)
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt'); // Log the error
    console.error(err.stack); // Log the stack trace
    res.status(500).send(err.message); // Respond with 500 for internal server errors
};

module.exports = errorHandler;

const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        console.log('Origin:', origin); // Log the origin to see if the request is coming through
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.warn(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 204,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
    allowedHeaders: 'Content-Type, Authorization' // Specify allowed headers
};

module.exports = corsOptions;



const rateLimit = require('express-rate-limit');

const signinAttemptsLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.', // Default message
  handler: (req, res, next) => {
    // Customize the error response for rate-limiting
    res.status(429).json({
      error: 'You have exceeded the maximum number of login attempts. Please try again after 15 minutes.',
    });
  },
});

module.exports = { signinAttemptsLimit };
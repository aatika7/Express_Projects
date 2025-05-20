const rateLimit = require('express-rate-limit');

// Define rate limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

module.exports = limiter;




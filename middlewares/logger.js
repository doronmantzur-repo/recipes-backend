const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream for logging (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'),
  { flags: 'a' }
);

// Export Morgan middleware
const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger;

'use strict';

require('dotenv').config();
const { parseIntOrDefault } = require('../utils');

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  SHUTDOWN_TIMEOUT: parseIntOrDefault(process.env.SHUTDOWN_TIMEOUT, 5000),
};

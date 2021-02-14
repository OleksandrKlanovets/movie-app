'use strict';

const parseIntOrDefault = (num, def, radix = 10) => {
  if (!num) return def;
  const parsed = parseInt(num, radix);
  return Number.isNaN(parsed) ? def : parsed;
};

module.exports = {
  parseIntOrDefault,
};

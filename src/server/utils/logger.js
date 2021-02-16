'use strict';

const path = require('path');
const fs = require('fs');

const DATE_ONLY_LENGTH = 10;
const DATE_WITH_TIME_LENGTH = 19;

class Logger {
  constructor(logPath) {
    const date = new Date().toISOString().substring(0, DATE_ONLY_LENGTH);
    const filePath = path.resolve(path.join(logPath, `${date}.log`));
    fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    this.stream = fs.createWriteStream(filePath, { flags: 'a' });
  }

  write(type = 'info', message) {
    const now = new Date().toISOString();
    const date = now.substring(0, DATE_WITH_TIME_LENGTH);
    const record = { date, type, message };
    const out = JSON.stringify(record);
    this.stream.write(`${out}\n`);
  }

  log(message) {
    this.write('info', message);
  }

  error(message) {
    this.write('error', message);
  }

  close() {
    return new Promise((resolve) => this.stream.end(resolve));
  }
}

module.exports = Logger;

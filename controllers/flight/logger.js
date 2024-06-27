const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'application.log');

function logMessage(message) {  
  const logEntry = `${message}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

module.exports = logMessage;

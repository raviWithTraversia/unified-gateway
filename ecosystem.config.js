module.exports = {
  apps: [
    {
      name: "mongod",
      script: "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe",
      exec_mode: "fork", // Use "fork" for single instance
      watch: false,      // Disable watching for changes
      autorestart: true, // Automatically restart if process crashes
    }
  ]
};

  
//   npm install pm2 -g
//   pm2 start ecosystem.config.js
//   pm2 status
//   pm2 restart mongod
//   pm2 stop mongod
//   pm2 save
//   pm2 startup
  
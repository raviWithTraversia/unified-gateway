module.exports = {
    apps: [
      {
        name: 'mongod',
        script: 'mongod',
        args: '--config "C:/Program Files/MongoDB/Server/7.0/bin/mongod.conf"',
        exec_mode: 'fork',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    ],
  };
  
//   npm install pm2 -g
//   pm2 start ecosystem.config.js
//   pm2 status
//   pm2 restart mongod
//   pm2 stop mongod
//   pm2 save
//   pm2 startup
  
const express = require("express");
const cors = require("cors");

class ExpressLoader {
    static init () {
        const app = express();

        // Middleware that transforms the raw string of req.body into json
        app.use(express.json());

     app.disable('x-powered-by');
     
     app.use(express.urlencoded({ limit: '100mb', extended: true }))
        
        const allowedOrigins = ["https://kafilaui.traversia.net","http://localhost:4200","https://agent.kafilaholidays.in"];
        
        // Place your cache control middleware here // remove after dev to pro
        app.use(
          cors({
            origin: function (origin, callback) {
              if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
              } else {
                callback(new Error("Not allowed by CORS"));
              }
            },
            credentials: true,
          })
        );
        
        // parses incoming requests with JSON payloads
        // app.use(cors());
        // app.options("*", cors());

   app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://code.jquery.com 'unsafe-inline'; connect-src 'self' https://kafila.traversia.net");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.removeHeader("X-Powered-By");
      next();
    });

        return app;
    }
}

module.exports = { ExpressLoader };
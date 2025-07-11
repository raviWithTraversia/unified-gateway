const express = require("express");
const cors = require("cors");

class ExpressLoader {
    static init () {
        const app = express();

        // Middleware that transforms the raw string of req.body into json
        app.use(express.json());

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

        return app;
    }
}

module.exports = { ExpressLoader };
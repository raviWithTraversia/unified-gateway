const userRoute = require("../routes/userRoute");
const smtpRoute = require("../routes/smtpRoute");

class RoutesLoader {
    static initRoutes (app) { 
        
        // user route
        app.use('/api', userRoute);

        //  smtp route 

        app.use('/api',smtpRoute);

    }
}

module.exports = {RoutesLoader};
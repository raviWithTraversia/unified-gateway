/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

    }
}

module.exports = {RoutesLoader};
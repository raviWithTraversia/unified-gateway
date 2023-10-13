/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
const registrationRoute = require('../routes/registrationRoute')

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

        // Product route by AlamShah
        app.use('/api' , productRoute);
        
        // Registration route by Shashi
        app.use('/api', registrationRoute);

    }
}

module.exports = {RoutesLoader};
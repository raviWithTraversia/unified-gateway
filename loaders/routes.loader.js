/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
const privilageRoute = require('../routes/privilageRoute');

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

        // Product route by AlamShah
        app.use('/api' , productRoute);

        // Privilage Route created by AlamShah
        app.use('/api' , privilageRoute);

    }
}

module.exports = {RoutesLoader};
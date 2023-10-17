/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
const privilageRoute = require('../routes/privilageRoute');
const creditRoute = require('../routes/creditRoute');
const productPlanController = require('../routes/productPlanRoute');

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

        // Product route by AlamShah
        app.use('/api' , productRoute);

        // Privilage Route created by AlamShah
        app.use('/api' , privilageRoute);

        // Credit route created by AlamShah
        app.use('/api' ,creditRoute);

        // Product Plan Route
        app.use('/api' ,productPlanController);
    }
}

module.exports = {RoutesLoader};
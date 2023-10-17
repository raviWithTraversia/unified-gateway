/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
const registrationRoute = require('../routes/registrationRoute');
const statusRoute = require('../routes/statusRoute');
const privilageRoute = require('../routes/privilageRoute');
const creditRoute = require('../routes/creditRoute');

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

        // Product route by AlamShah
        app.use('/api' , productRoute);
        
        // Registration route by Shashi
        app.use('/api', registrationRoute);

        // Ststus route by Shashi
         app.use('/api',statusRoute);


        // Privilage Route created by AlamShah
        app.use('/api' , privilageRoute);

        // Credit route created by AlamShah
        app.use('/api' ,creditRoute);
    }
}

module.exports = {RoutesLoader};
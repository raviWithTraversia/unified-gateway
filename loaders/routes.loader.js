/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
<<<<<<< HEAD
const registrationRoute = require('../routes/registrationRoute');
const statusRoute = require('../routes/statusRoute');
const privilageRoute = require('../routes/privilageRoute');
const creditRoute = require('../routes/creditRoute');
=======
const registrationRoute = require('../routes/registrationRoute')
>>>>>>> 62eb340abea3ac049e6b5961eca2047e9775f9fd

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);

        //  logs route By AlamShah 
        app.use('/api', logRoute);

        // Product route by AlamShah
        app.use('/api' , productRoute);
        
        // Registration route by Shashi
        app.use('/api', registrationRoute);

<<<<<<< HEAD
        // Ststus route by Shashi
         app.use('/api',statusRoute);


        // Privilage Route created by AlamShah
        app.use('/api' , privilageRoute);

        // Credit route created by AlamShah
        app.use('/api' ,creditRoute);
=======
>>>>>>> 62eb340abea3ac049e6b5961eca2047e9775f9fd
    }
}

module.exports = {RoutesLoader};
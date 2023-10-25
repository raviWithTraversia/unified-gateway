/* Routes */
const userRoute = require("../routes/userRoute");
const logRoute = require("../routes/logRoute");
const productRoute = require('../routes/productRoute');
const registrationRoute = require('../routes/registrationRoute');
const statusRoute = require('../routes/statusRoute');
const privilageRoute = require('../routes/privilageRoute');
const creditRoute = require('../routes/creditRoute');
const productPlanRoute = require('../routes/productPlanRoute');
const emailConfigRoute = require('../routes/emailConfigRoute');
const emailConfigDecriptionRoute = require("../routes/emailConfigDiscriptionRoute");
<<<<<<< Updated upstream
const smtpRoute = require('../routes/smtpRoute');
=======
const CountryRoute = require('../routes/countryRoute');
const CabinClassMasterRoute = require('../routes/cabinClassMasterRoute');
const websiteManagerRoute = require('../routes/websiteManagerRoute');
>>>>>>> Stashed changes

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

        // Product Plan Route
        app.use('/api' ,productPlanRoute);

        // emailConfig Route by shahsi
        app.use('/api',emailConfigRoute);

        // emailConfigDescription Route by shashi
<<<<<<< Updated upstream
        app.use('/api', emailConfigDecriptionRoute);

        // smtp Route by shashi
        app.use('/api',smtpRoute);
=======
        app.use('/api', emailConfigDecriptionRoute)

        // Country route by alamShah
        app.use('/api', CountryRoute);

        // CabinClassMaster route by alam
        app.use('/api', CabinClassMasterRoute);

        // website Manager Route by alam Shah
        app.use('/api', websiteManagerRoute);
>>>>>>> Stashed changes
    }
}

module.exports = {RoutesLoader};
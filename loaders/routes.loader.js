/* Routes */
const userRoute = require("../routes/userRoute");

class RoutesLoader {
    static initRoutes (app) {        
        app.use('/api', userRoute);
    }
}

module.exports = {RoutesLoader};
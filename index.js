const { ExpressLoader } = require('./loaders/express.loader');
const { RoutesLoader } = require('./loaders/routes.loader');
const { MiddlewareLoader } = require('./loaders/middleware.loader');
const { Config } = require('./configs/config');
const { connectionMongoDb } = require("./connection");
connectionMongoDb(Config.MONGODB_URL);

// const { migrate } = require("./migrations/userMigration");
// migrate();
// load express
const app = ExpressLoader.init();

const runSeeders = require("./seeders");

// init routes
RoutesLoader.initRoutes(app);

// init middleware
//MiddlewareLoader.init(app);

runSeeders().then(() => {
    console.log('Seeders executed.');
});

const port = Number(Config.PORT);
app.listen(port, function(){
    console.log(`Server is running on port ${port}`);  
})


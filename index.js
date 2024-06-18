const { ExpressLoader } = require('./loaders/express.loader');
const { RoutesLoader } = require('./loaders/routes.loader');
const { Config } = require('./configs/config');
const { connectionMongoDb } = require("./connection");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const basicAuth = require('express-basic-auth');

let MongoUrl = Config.MONGODB_URL
if (Config.MODE === "LIVE") { MongoUrl = Config.MONGODB_URL_2 }
connectionMongoDb(MongoUrl);

const app = ExpressLoader.init();

const runSeeders = require("./seeders");

// init routes
RoutesLoader.initRoutes(app);

// init middleware
//MiddlewareLoader.init(app);

runSeeders().then(() => {
    console.log('Seeders executed.');
});


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "B2B Portal",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'Bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [
        "./routes/creditRoute.js",
        "./routes/emailConfigRoute.js",
        "./routes/emailConfigDescriptionRoute.js", // Corrected route name
        "./routes/logRoute.js",
        "./routes/privilageRoute.js",
        "./routes/productPlanRoute.js",
        "./routes/productRoute.js",
        "./routes/registrationRoute.js",
        "./routes/statusRoute.js",
        "./routes/userRoute.js",
        "./routes/countryRoute.js",
        "./routes/websiteManagerRoute.js",
        "./routes/stateRoute.js",
        "./routes/cityRoute.js",
        "./routes/registrationRoute.js",
        "./routes/cabinClassMasterRoute.js",
        "./routes/permissionRoute.js",
        "./routes/roleRoute.js",
        "./routes/salesRoute.js",
        "./routes/verifyOtpRoute.js",
        "./routes/carrierRoute.js"

    ]
};

const swaggerDocs = swaggerJSDoc(options);
const swaggerUiOptions = {
    displayOperationId: true,
    deepLinking: true,
};

// Place your cache control middleware here // remove after dev to pro
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});

app.use("/api-docs", basicAuth({
    users: { 'admin': 'admin@1234' },
    challenge: true,

}), swaggerUI.serve, swaggerUI.setup(swaggerDocs, swaggerUiOptions));

app.use("/b2b/api-docs", basicAuth({
    users: { 'admin': 'Ttpl@2023' },
    challenge: true,
}), swaggerUI.serve, swaggerUI.setup(swaggerDocs, swaggerUiOptions));

const port = process.env.PORT || 3111;
//let host = '192.168.1.8'
app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
})
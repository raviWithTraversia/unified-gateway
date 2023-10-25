const { ExpressLoader } = require('./loaders/express.loader');
const { RoutesLoader } = require('./loaders/routes.loader');
const { MiddlewareLoader } = require('./loaders/middleware.loader');
const { Config } = require('./configs/config');
const { connectionMongoDb } = require("./connection");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const basicAuth = require('express-basic-auth');
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
    ],
    // parameters: [
    //     {
    //         in: "header",
    //         name: "X-Request-ID",
    //         description: "The unique request identifier.",
    //         required: true,
    //         schema: {
    //             type: "string",
    //         },
    //     },
    // ]
};

const swaggerDocs = swaggerJSDoc(options);
const swaggerUiOptions = {
    displayOperationId: true,
    deepLinking: true,
  };
app.use("/api-docs", basicAuth({
    users: { 'admin': 'admin@1234' },
    challenge: true,
  
}), swaggerUI.serve, swaggerUI.setup(swaggerDocs,swaggerUiOptions));

app.use("/b2b/api-docs", basicAuth({
    users: { 'admin': 'Ttpl@2023' },
    challenge: true,
}), swaggerUI.serve, swaggerUI.setup(swaggerDocs,swaggerUiOptions));

const port = Number(Config.PORT);
app.listen(port, function(){
    console.log(`Server is running on port ${port}`);  
})


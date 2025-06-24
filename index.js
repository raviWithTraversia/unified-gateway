const { ExpressLoader } = require("./loaders/express.loader");
const { RoutesLoader } = require("./loaders/routes.loader");
const { Config } = require("./configs/config");
const { connectionMongoDb } = require("./connection");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const basicAuth = require("express-basic-auth");
const cors = require("cors");
const { enableGZipCompression } = require("./utils/compression");
let MongoUrl = Config.MONGODB_URL;
if (Config.MODE === "LIVE") {
  MongoUrl = Config.MONGODB_URL_2;
}
connectionMongoDb(MongoUrl);

const app = ExpressLoader.init();
enableGZipCompression(app);

const runSeeders = require("./seeders");

// init routes
RoutesLoader.initRoutes(app);

// init middleware
//MiddlewareLoader.init(app);

runSeeders().then(() => {
  console.log("Seeders executed.");
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
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
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
    "./routes/carrierRoute.js",
    "./routes/creditNotesRoute",
  ],
};

const swaggerDocs = swaggerJSDoc(options);
const swaggerUiOptions = {
  displayOperationId: true,
  deepLinking: true,
};

// Place your cache control middleware here // remove after dev to pro
app.use(
  cors({
    origin: "*",
  })
);
app.set('trust proxy', true); // ✅ VERY IMPORTANT
app.use((err, req, res, next) => {
  // Handle Invalid JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ Message: 'Invalid JSON payload', IsSucess:false,
    Error:true });
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    Message: 'Something went wrong. Please try again later.',
    IsSucess:false,
    Error:true
  });
});
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.header("Cache-Control", "no-store");

  
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://code.jquery.com 'unsafe-inline'; connect-src 'self' https://kafila.traversia.net");
   res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Powered-By", ""); // overwrite
  res.removeHeader("X-Powered-By");

  next();
});

app.use(
  "/api-docs",
  basicAuth({
    users: { admin: "admin@1234" },
    challenge: true,
  }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, swaggerUiOptions)
);

app.use(
  "/b2b/api-docs",
  basicAuth({
    users: { admin: "Ttpl@2023" },
    challenge: true,
  }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, swaggerUiOptions)
);
const port = process.env.PORT || 3111;
//let host = '192.168.1.8'
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});

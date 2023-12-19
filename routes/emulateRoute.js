const express = require("express");
const emulate_route = express();
const bodyParser = require("body-parser");
emulate_route.use(bodyParser.json());
emulate_route.use(bodyParser.urlencoded({extended:true}));
const emulateController = require("../controllers/emulate/emulateController.js");
const auth = require("../middleware/auth.js");

emulate_route.get(
    '/emulate/search-agency',
    emulateController.emulateLogin
);

emulate_route.post(
    '/emulate/authenticate',
    emulateController.emulateAuthenticate
);

module.exports = emulate_route;
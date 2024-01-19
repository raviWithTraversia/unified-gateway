const express = require("express");
const configCredential_route = express();
const bodyParser = require("body-parser");
configCredential_route.use(bodyParser.json());
configCredential_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const configCredentialController = require('../controllers/configCredential.js/configCredential.controller');

configCredential_route.post(
    '/configCred/addCredential',
    configCredentialController.addCredntials
);
configCredential_route.get(
    '/configCred/getCredential',
    configCredentialController.getCredentialForCompany
);
configCredential_route.patch(
    '/configCred/updateCredentail',
    configCredentialController.updateCredential
);
configCredential_route.delete(
    '/configCred/deleteCredential',
    configCredentialController.deleteCredential
);

configCredential_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = configCredential_route;

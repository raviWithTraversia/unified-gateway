const express = require("express");
const email_config_description_route = express();
const bodyParser = require("body-parser");
email_config_description_route.use(bodyParser.json());
email_config_description_route.use(bodyParser.urlencoded({extended:true}));
const emailConfigDescriptionController = require("../controllers/emailConfigDescription/emailConfigDescription.controller");
const auth = require("../middleware/auth");

email_config_description_route.get(
    '/all-config',
    emailConfigDescriptionController.findAllEmailConfig
);

email_config_description_route.post(
    'add-Config-description',
    emailConfigDescriptionController.addEmailConfig
);

email_config_description_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = email_config_description_route;
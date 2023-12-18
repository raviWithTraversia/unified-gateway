const express = require("express");
const agency_config_route = express();
const bodyParser = require("body-parser");
agency_config_route.use(bodyParser.json());
agency_config_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const agencyConfigurationController = require('./../controllers/agentConfig/agentConfig.controller');
agency_config_route.post(
    '/agentConfiguration/addAgencyConfig'
)
agency_config_route.patch(
    '/agentConfiguration/updateAgentConfiguration',
    auth,
    agencyConfigurationController.updateAgentConfiguration
)

agency_config_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});


module.exports =  agency_config_route;
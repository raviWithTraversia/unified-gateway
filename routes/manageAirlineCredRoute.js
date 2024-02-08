const express = require("express");
const manageAirlineCred_route = express();
const bodyParser = require("body-parser");
manageAirlineCred_route.use(bodyParser.json());
manageAirlineCred_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const manageAirlineCredModels = require('./../controllers/manageAirlineCred/manageAirlineCred.controller');

manageAirlineCred_route.post(
    '/manageAirlineCred/addPassportDetailForAirline',
    auth,
    manageAirlineCredModels.addAirlineCred 
);

manageAirlineCred_route.patch(
    '/manageAirlineCred/updateAirlineCred',
    auth,
    manageAirlineCredModels.updateAirlineCred 
);

manageAirlineCred_route.get(
    '/manageAirlineCred/getAirlineCred',
    auth,
    manageAirlineCredModels.getAirlineCred 
);

manageAirlineCred_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = manageAirlineCred_route;

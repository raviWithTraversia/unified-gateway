const express = require("express");
const airportDetaild_route = express();
const bodyParser = require("body-parser");
airportDetaild_route.use(bodyParser.json());
airportDetaild_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const airportDetailsController = require('./../controllers/airportDetails/airportDetails.controller');

airportDetaild_route.post(
    '/airportDetails/addAirportDetail',
    airportDetailsController.addAirportDetail
);
// airportDetaild_route.patch(
  
// );
airportDetaild_route.post(
    '/airportDetails/getAirportDetails',
    airportDetailsController.getAirportDetails
);
// airportDetaild_route.delete(
   
// )
airportDetaild_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = airportDetaild_route;

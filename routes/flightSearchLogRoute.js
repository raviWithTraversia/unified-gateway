const express = require("express");
const flightSearchLog_route = express();
const bodyParser = require("body-parser");
flightSearchLog_route.use(bodyParser.json());
flightSearchLog_route.use(bodyParser.urlencoded({extended:true}));
const flightSearchLogController = require("../controllers/flightSearchLog/flightSearchLog.controller.js");
const auth = require("../middleware/auth.js");

flightSearchLog_route.post(
   '/flightSearchLog/getFlightSerchReport',
   auth,
   flightSearchLogController.getFlightSerchReport
);
flightSearchLog_route.post(
    '/flightSearchLog/addFlightSerchReport',
    flightSearchLogController.addFlightSerchReport
 );


flightSearchLog_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = flightSearchLog_route;



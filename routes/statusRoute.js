const express = require("express");
const status_route = express();
const bodyParser = require("body-parser");
status_route.use(bodyParser.json());
status_route.use(bodyParser.urlencoded({extended:true}));
const statusController = require('../controllers/status/status.controller');
const auth = require("../middleware/auth");

status_route.get(
   '/status/:statustype',
   statusController.findStatusType
);

status_route.get(
  '/addstatus',
  statusController.addStatusType

 )

status_route.post(
  '/allstatus',
  statusController.findAllStatusType
);


status_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = status_route;
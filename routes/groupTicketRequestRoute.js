const express = require("express");
const groupTicketRequest_route = express();
const bodyParser = require("body-parser");
groupTicketRequest_route.use(bodyParser.json());
groupTicketRequest_route.use(bodyParser.urlencoded({extended:true}));
const groupTicketRequestController = require("../controllers/groupTicketRequest/groupTicketRequest.controller.js");
const auth = require("../middleware/auth.js");

groupTicketRequest_route.post(
   '/groupTicketRequest/addTicketRequset',
   groupTicketRequestController.addTicketRequset
);
groupTicketRequest_route.get(
    '/groupTicketRequest/getTicketRequestByUserId',
    groupTicketRequestController.getTicketRequestByUserId
);
 groupTicketRequest_route.get(
    '/groupTicketRequest/getTicketRequestId',
    groupTicketRequestController.getTicketRequestId
);
 groupTicketRequest_route.patch(
    '/groupTicketRequest/updateTicketRequest',
    groupTicketRequestController.updateTicketRequest
);
groupTicketRequest_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = groupTicketRequest_route;



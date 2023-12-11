const express = require("express");
const autoTicketing_route = express();
const bodyParser = require("body-parser");
autoTicketing_route.use(bodyParser.json());
autoTicketing_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const autoTicketingController = require('./../controllers/autoTicketing/autoTicketing.controller');

autoTicketing_route.post(
    '/autoTicketing/addautoTicketing',
    auth,
    autoTicketingController.addAutoTicketingConfig
);
autoTicketing_route.patch(
   '/autoTicketing/editAutoTicketing',
   auth,
   autoTicketingController.editAutoTicketingConfig
);
autoTicketing_route.get(
    '/autoTicketing/getAutoTicketing',
    auth,
    autoTicketingController.getAutoTicketingConfig
);
autoTicketing_route.delete(
    '/autoTicketing/deleteAutoTicketing',
    auth,
    autoTicketingController.deleteAutoTicketingConfig
)
autoTicketing_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = autoTicketing_route;

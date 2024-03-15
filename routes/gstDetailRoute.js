const express = require("express");
const gstDetail_route = express();
const bodyParser = require("body-parser");
gstDetail_route.use(bodyParser.json());
gstDetail_route.use(bodyParser.urlencoded({extended:true}));
const gstDetailController = require("../controllers/gstDetails/gstDetail.controller.js");
const auth = require("../middleware/auth.js");

gstDetail_route.post(
   '/gstDetail/addGstDetail',
   gstDetailController.addGstDetail
);
gstDetail_route.get(
    '/gstDetail/getGstDetail',
    gstDetailController.getGstDetail
 );

gstDetail_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = gstDetail_route;



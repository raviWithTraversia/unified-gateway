const express = require("express");
const payu_route = express();
const bodyParser = require("body-parser");
payu_route.use(bodyParser.json());
payu_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const payuController = require('./../controllers/payuController/payu.controller');

payu_route.post(
    '/paymentGateway/payu',
    auth,
    payuController.payu
);
payu_route.post(
    '/paymentGateway/success',
    payuController.payuSuccess
);payu_route.post(
    '/paymentGateway/failed',
    payuController.payuFail
);
payu_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = payu_route;

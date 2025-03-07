const express = require("express");
const payu_route = express();
const bodyParser = require("body-parser");
payu_route.use(bodyParser.json());
payu_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const payuController = require('./../controllers/payuController/payu.controller');
const lyraService=require('../controllers/lyraPg/lyraService')

payu_route.post(
    '/paymentGateway/payu',
    auth,
    payuController.payu
);

payu_route.post(
    '/paymentGateway/success',
    payuController.payuSuccess
);

payu_route.post(
    '/paymentGateway/success-payu-wallet-response',
    payuController.payuWalletResponceSuccess
);

payu_route.post(
    '/paymentGateway/success-payu-wallet-rail-response',
    payuController.payuWalletRailResponceSuccess
);
payu_route.post(
    '/paymentGateway/failed-payu-wallet-response',
    payuController.payuWalletResponceFailed
);

payu_route.post(
    '/paymentGateway/failed',
    payuController.payuFail
);

payu_route.post("/rail/paymentGateway/failed",payuController.railPayuFail)

payu_route.post(
    '/rail/paymentGateway/success',
    payuController.railPayuSuccess
);

payu_route.post(
    '/paymentGateway/payu2',
    auth,
    payuController.payu2
);

payu_route.post('/lyra/redirect',lyraService.lyraRedirectLink)
payu_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = payu_route;

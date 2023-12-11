const express = require("express");
const airlinePromoCode_route = express();
const bodyParser = require("body-parser");
airlinePromoCode_route.use(bodyParser.json());
airlinePromoCode_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const airlinePromoController = require('./../controllers/airLinePromoCode/airLinePromoCode.controller');

airlinePromoCode_route.post(
    '/airlinePromocode/addPromo',
    auth,
    airlinePromoController.addAirlinePromoCode
);
airlinePromoCode_route.patch(
   '/airlinePromocode/editPromo',
   auth,
   airlinePromoController.editAirlinePromoCode
);
airlinePromoCode_route.get(
    '/airlinePromocode/getPromo',
    auth,
    airlinePromoController.getPromoCode
);
airlinePromoCode_route.delete(
    '/airlinePromocode/deletePromo',
    auth,
    airlinePromoController.deletePromoCode
)
airlinePromoCode_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = airlinePromoCode_route;

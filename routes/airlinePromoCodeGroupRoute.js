const express = require("express");
const airlinePromoCodeGroup_route = express();
const bodyParser = require("body-parser");
airlinePromoCodeGroup_route.use(bodyParser.json());
airlinePromoCodeGroup_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const airlinePromoGroupController = require('./../controllers/airLinePromoCodeGroup/airLinePromoCodeGroup.controller');

airlinePromoCodeGroup_route.post(
    '/airlinePromocodeGroup/addAirlinePromcodeGroup',
    auth,
    airlinePromoGroupController.addAirlinePromcodeGroup
);
airlinePromoCodeGroup_route.patch(
   '/airlinePromocodeGroup/editAirlinePromoCodeGroup',
   auth,
   airlinePromoGroupController.editAirlinePromoCodeGroup
);
airlinePromoCodeGroup_route.get(
    '/airlinePromocodeGroup/getAirlinePromoCodeGroup',
    auth,
    airlinePromoGroupController.getAirlinePromoCodeGroup
);
airlinePromoCodeGroup_route.delete(
    '/airlinePromocodeGroup/deleteAirlinePromCodeGroup',
    auth,
    airlinePromoGroupController.deleteAirlinePromCodeGroup
)
airlinePromoCodeGroup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = airlinePromoCodeGroup_route;

const express = require("express");
const pgChargeGroup_route = express();
const bodyParser = require("body-parser");
pgChargeGroup_route.use(bodyParser.json());
pgChargeGroup_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const pgChargesGroupController = require('./../controllers/paymentGatewayChargeGroup/paymentGatewayChargeGroup.controller');

pgChargeGroup_route.post(
    '/pgChargeGroup/addPaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.addPaymentGatewayChargeGroup
);
pgChargeGroup_route.patch(
    '/pgChargeGroup/editPaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.editPaymentGatewayChargeGroup
);
pgChargeGroup_route.get(
    '/pgChargeGroup/getPaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.getPaymentGatewayChargeGroup
);
pgChargeGroup_route.delete(
    '/pgChargeGroup/deletePaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.deletePaymentGatewayChargeGroup
);
pgChargeGroup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = pgChargeGroup_route;

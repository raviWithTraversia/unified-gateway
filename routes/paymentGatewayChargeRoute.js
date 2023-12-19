const express = require("express");
const pgCharge_route = express();
const bodyParser = require("body-parser");
pgCharge_route.use(bodyParser.json());
pgCharge_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const pgChargesController = require('./../controllers/paymentGatewayCharge/paymentGatewayCharge.controller');

pgCharge_route.post(
    '/pgCharge/addPgCharges',
    auth,
    pgChargesController.addPgCharges
);
pgCharge_route.patch(
    '/pgCharge/updatePgCharges',
    auth,
    pgChargesController.editPgcharges
);
pgCharge_route.get(
    '/pgCharge/calculateCharge',
    auth,
    pgChargesController.calculatePgCharges
);
pgCharge_route.get(
    '/pgCharge/getPgCharges',
    auth,
    pgChargesController.getPgCharges
)
pgCharge_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = pgCharge_route;

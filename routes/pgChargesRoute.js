const express = require("express");
const pgCharges_route = express();
const bodyParser = require("body-parser");
pgCharges_route.use(bodyParser.json());
pgCharges_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const pgChargesController = require('./../controllers/pgCharges/pgCharges.controller');

pgCharges_route.post(
    '/pgCharges/addPgCharges',
    auth,
    pgChargesController.addPgCharges
);
pgCharges_route.patch(
    '/pgCharges/updatePgCharges',
    auth,
    pgChargesController.editPgcharges
);
pgCharges_route.get(
    '/pgCharges/calculateCharge',
    auth,
    pgChargesController.calculatePgCharges
);
pgCharges_route.get(
    '/pgCharges/getPgCharges',
    auth,
    pgChargesController.getPgCharges
);

pgCharges_route.post(
    '/pgCharges/getAssignPGChargesGroupByUserId',    
    pgChargesController.getAssignPGChargesGroup
);

pgCharges_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = pgCharges_route;

const express = require("express");
const railManageGroupPgCharges = express();
const bodyParser = require("body-parser");
railManageGroupPgCharges.use(bodyParser.json());
railManageGroupPgCharges.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const pgChargesGroupController = require('../controllers/rail/railManageGroupPgCharges/railManageGroup.controller');

railManageGroupPgCharges.post(
    '/rail/addPaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.addPaymentGatewayChargeGroup
);
railManageGroupPgCharges.patch(
    '/rail/editPaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.editPaymentGatewayChargeGroup
);
railManageGroupPgCharges.get(
    '/rail/getPaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.getPaymentGatewayChargeGroup
);
railManageGroupPgCharges.delete(
    '/rail/deletePaymentGatewayChargeGroup',
    auth,
    pgChargesGroupController.deletePaymentGatewayChargeGroup
);
railManageGroupPgCharges.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = railManageGroupPgCharges;

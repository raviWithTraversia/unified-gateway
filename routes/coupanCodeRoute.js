const express = require("express");
const couponCode_route = express();
const bodyParser = require("body-parser");
couponCode_route.use(bodyParser.json());
couponCode_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const couponCodeController = require('../controllers/couponCode/couponCode.controller');

couponCode_route.post(
    '/couponCode/addCouponCode',
    couponCodeController.addCouponCode
);
couponCode_route.get(
    'configCred/getCredential',
    couponCodeController.getCouponCode
);
couponCode_route.patch(
    'configCred/updateCredentail',
    configCredentialController.updateCredential
);
couponCode_route.delete(
    'configCred/deleteCredential',
    configCredentialController.deleteCredential
);

configCredential_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = configCredential_route;

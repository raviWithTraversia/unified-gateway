const express = require("express");
const userPayment_route = express();
const bodyParser = require("body-parser");
userPayment_route.use(bodyParser.json());
userPayment_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const userPaymentController = require('../controllers/userPayment/userPayment.controller');

userPayment_route.post(
    '/userPayment/manualPaymentForBalance',
    //auth,
    userPaymentController.manualPaymentForBalance
);

// userPayment_route.get(

// );

// userPayment_route.patch(
// )

userPayment_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = userPayment_route;
const express = require("express");
const cardDetails_route = express();
const bodyParser = require("body-parser");
cardDetails_route.use(bodyParser.json());
cardDetails_route.use(bodyParser.urlencoded({extended:true}));
const cardDetailsController = require("../controllers/cardDetails/cardDetails.controller.js");
const auth = require("../middleware/auth.js");

cardDetails_route.post(
    '/cardDetails/addCardDetails',
    auth,
    cardDetailsController.addCardDetails
);

cardDetails_route.get(
    '/cardDetails/getCardDetails',
    auth,
    cardDetailsController.getCardDetails

);
cardDetails_route.delete(
    '/cardDetails/deleteCardDetails',
    auth,
    cardDetailsController.deleteCardDetails
);
cardDetails_route.patch(
    '/cardDetails/updateCardDetails',
    auth,
    cardDetailsController.updateCardDetails
)

cardDetails_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = cardDetails_route;



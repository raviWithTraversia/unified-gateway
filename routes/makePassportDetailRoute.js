const express = require("express");
const makePassportDetailMandatory_route = express();
const bodyParser = require("body-parser");
makePassportDetailMandatory_route.use(bodyParser.json());
makePassportDetailMandatory_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const markPassportDetailsModels = require('./../controllers/makePassportDetail/makePassportDetail.controller');

// makePassportDetailMandatory_route.post(
//     '/makePassportDetailMandatory/addPassportDetailForAirline',
//     auth,
//     markPassportDetailsModels.addPassportDetailForAirline 
// );

makePassportDetailMandatory_route.patch(
    '/makePassportDetailMandatory/updatePassportDetailForAirline',
    auth,
    markPassportDetailsModels.updatePassportDetailForAirline 
);

makePassportDetailMandatory_route.get(
    '/makePassportDetailMandatory/getPassportDetailForAirline',
    auth,
    markPassportDetailsModels.getPassportDetailForAirline 
);


makePassportDetailMandatory_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = makePassportDetailMandatory_route;

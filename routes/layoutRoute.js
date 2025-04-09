const express = require("express");
const layout_route = express();
const bodyParser = require("body-parser");
layout_route.use(bodyParser.json());
layout_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const layoutController = require('./../controllers/layout/layout.controller')
const {panLimiter}=require('../middleware/ip.middleware')

layout_route.set('trust proxy', true)
layout_route.get(
    '/layout/Count',
    layoutController.dashBoardCount
);
layout_route.post(
    '/layout/pancard',
    panLimiter,
layoutController.checkPanCard
)

layout_route.post(
    '/layout/gstnumber',
    panLimiter,
    layoutController.checkGstin
)

layout_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

layout_route.post('/adhar/verify',layoutController.checkAdhar)
layout_route.post('/adhar/verify/kyc',layoutController.AdharVerify)


// PanCard
// layout_route.post(
//     '/layout/pancard-detail',
//     layoutController.checkPanCardDataExist
//     )

module.exports = layout_route;
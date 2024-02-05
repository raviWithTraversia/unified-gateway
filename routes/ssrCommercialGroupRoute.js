const express = require("express");
const ssrCommercialGroup_route = express();
const bodyParser = require("body-parser");
ssrCommercialGroup_route.use(bodyParser.json());
ssrCommercialGroup_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const ssrCommercialGroupController = require('../controllers/ssrCommercialGroup/ssrCommercialGroup.controller');

ssrCommercialGroup_route.post(
    '/ssrCommercialGroup/addSsrCommercialGroup',
    auth,
    ssrCommercialGroupController.addSsrCommercialGroup
);

ssrCommercialGroup_route.get(
    '/ssrCommercialGroup/getSsrCommercialGroup',
     auth,
    ssrCommercialGroupController.getSsrCommercialGroup
);
// ssrCommercialGroup_route.patch(
//     '/ssrCommercialGroup/editSsrCommercial',
//      auth,
//     ssrCommercialGroupController.editSsrCommercial
// );

// ssrCommercialGroup_route.delete(
//     '/ssrCommercialGroup/deleteSsrCommercial',
//      auth,
//     ssrCommercialGroupController.deleteSsrCommercial
// );



ssrCommercialGroup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = ssrCommercialGroup_route;
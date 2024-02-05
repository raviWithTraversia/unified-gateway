const express = require("express");
const ssrCommercial_route = express();
const bodyParser = require("body-parser");
ssrCommercial_route.use(bodyParser.json());
ssrCommercial_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const ssrCommercial = require('../controllers/ssrCommercial/ssrCommercial.controller');

ssrCommercial_route.post(
    '/ssrCommercial/addSsrCommercial',
    auth,
    ssrCommercial.addSsrCommercial
);

ssrCommercial_route.get(
    '/ssrCommercial/getSsrCommercialByCompany',
     auth,
    ssrCommercial.getSsrCommercialByCompany
);
ssrCommercial_route.patch(
    '/ssrCommercial/editSsrCommercial',
     auth,
    ssrCommercial.editSsrCommercial
);

ssrCommercial_route.delete(
    '/ssrCommercial/deleteSsrCommercial',
     auth,
    ssrCommercial.deleteSsrCommercial
);





ssrCommercial_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = ssrCommercial_route;
const express = require("express");
const supplerCode_route = express();
const bodyParser = require("body-parser");
supplerCode_route.use(bodyParser.json());
supplerCode_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const supplierCodedController = require('../controllers/supplierCode/supplierCode.controller');

supplerCode_route.post(
    '/supplier/addSupplierCode',
    //auth,
    supplierCodedController.addSupplierCode
);
supplerCode_route.get(
    '/supplier/getSupplierCode',
   // auth,
    supplierCodedController.getSupplierCode
);

supplerCode_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = supplerCode_route;
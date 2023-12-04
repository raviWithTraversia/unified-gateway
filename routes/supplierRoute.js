const express = require("express");
const supplier_route = express();
const bodyParser = require("body-parser");
supplier_route.use(bodyParser.json());
supplier_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const supplierController = require('../controllers/supplier/supplier.controller');

supplier_route.post(
    '/supplier/addSupplier',
    //auth,
    supplierController.addSupplier
);

supplier_route.get(
    '/supplier/getSupplier',
   // auth,
    supplierController.getSupplier
);

supplier_route.patch(
 '/supplier/updateSupplier',
  // auth,
   supplierController.updateSupplier
)

supplier_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = supplier_route;
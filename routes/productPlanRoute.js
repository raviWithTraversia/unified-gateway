const express = require("express");
const product__plan_route = express();
const bodyParser = require("body-parser");
product__plan_route.use(bodyParser.json());
product__plan_route.use(bodyParser.urlencoded({extended:true}));
const ProductPlan = require('../controllers/productPlan/productPlan.controller');

const productValidator = require('../validation/product.validation');


// Product Plan route created by alam Shah
product__plan_route.post('/product-plan' , productValidator.productPlanValidation ,ProductPlan.addProductPlan);
product__plan_route.get('/all-product-plan' , ProductPlan.retriveProductPlan);
product__plan_route.patch('/update-product-plan/:producPlantId' , ProductPlan.updateProductPlan);


module.exports = product__plan_route;




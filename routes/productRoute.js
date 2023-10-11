const express = require("express");
const product_route = express();
const bodyParser = require("body-parser");
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({extended:true}));
const Product = require('../controllers/product/product.controller');
const ProductPlan = require('../controllers/product/productPlan.controller');

const productValidator = require('../utils/validation/product.validation');


// Product route created by alam Shah
product_route.post('/product' ,  productValidator.productValidation ,Product.storeProduct);
product_route.get('/get-product' , Product.getProduct);
product_route.patch('/update-product/:productId' , Product.updateProduct);
product_route.delete('/delete-product/:productId' , Product.deleteProduct);


// Product Plan route created by alam Shah
product_route.post('/product-plan' , productValidator.productPlanValidation ,ProductPlan.addProductPlan);
product_route.get('/all-product-plan' , ProductPlan.retriveProductPlan);
product_route.patch('/update-product-plan/:producPlantId' , ProductPlan.updateProductPlan);


module.exports = product_route;




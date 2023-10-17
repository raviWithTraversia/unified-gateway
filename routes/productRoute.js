const express = require("express");
const product_route = express();
const bodyParser = require("body-parser");
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({extended:true}));
const Product = require('../controllers/product/productController');

const {productValidation} = require('../validation/product.validation');
<<<<<<< HEAD
const productValidator = require('../validation/product.validation');
=======
>>>>>>> 62eb340abea3ac049e6b5961eca2047e9775f9fd


product_route.post('/product' ,  productValidation ,Product.storeProduct);
product_route.get('/get-product' , Product.getProduct);
product_route.patch('/update-product/:productId' , Product.updateProduct);
product_route.delete('/delete-product/:productId' , Product.deleteProduct);

module.exports = product_route;




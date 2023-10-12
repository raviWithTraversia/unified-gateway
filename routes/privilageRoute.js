const express = require("express");
const privilage_route = express();
const bodyParser = require("body-parser");
privilage_route.use(bodyParser.json());
privilage_route.use(bodyParser.urlencoded({extended:true}));

const PrivilageController = require('../controllers/privilage/privilage.plan.controller');
const privilageValidation = require('../validation/privilage.validation');

// Route process for privilage by alam Shah
privilage_route.post('/privilage' , privilageValidation.privilageValidation , PrivilageController.storePrivilagePlan);
privilage_route.get('/privilage-list/:comapnyId' , PrivilageController.getAllPrivilage);

module.exports = privilage_route;
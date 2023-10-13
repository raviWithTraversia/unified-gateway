const express = require("express");
const registation_route = express();
const bodyParser = require("body-parser");
registation_route.use(bodyParser.json());
registation_route.use(bodyParser.urlencoded({extended:true}));
const registrationController = require('../controllers/registration/registration.controller')
const auth = require("../middleware/auth");

registation_route.post(
    '/registration',
   registrationController.addRegistration
    );

registation_route.get(
  '/registration/all',
   registrationController.getAllRegistration
 );

 registation_route.get(
    '/registration/:companyId',
    registrationController.getAllRegistrationByCompany
 );

 registation_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = registation_route;

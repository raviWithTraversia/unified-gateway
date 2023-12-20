const express = require("express");
const diSetup_route = express();
const bodyParser = require("body-parser");
diSetup_route.use(bodyParser.json());
diSetup_route.use(bodyParser.urlencoded({extended:true}));
const diSetupController = require("../controllers/diSetup/diSetup.controller.js");
const auth = require("../middleware/auth.js");

diSetup_route.post(
    '/diSetup/addDiSetup',
    auth,
    diSetupController.addDiSetup
);

diSetup_route.get(
    '/diSetup/getdiSetup',
    auth,
    diSetupController.getDiSetup

);
diSetup_route.delete(
    '/diSetup/deleteDi/:id',
    auth,
    diSetupController.deleteDiSetup
);
diSetup_route.patch(
    '/diSetup/editDiSetup',
    auth,
    diSetupController.editDiSetup
)

diSetup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = diSetup_route;



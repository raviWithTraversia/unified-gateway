const express = require("express");
const diSetupGroup_route = express();
const bodyParser = require("body-parser");
diSetupGroup_route.use(bodyParser.json());
diSetupGroup_route.use(bodyParser.urlencoded({extended:true}));
const diSetupGroupController = require("../controllers/diSetupGroup/diSetupGroup.controller.js");
const auth = require("../middleware/auth.js");

diSetupGroup_route.post(
    '/diSetupGroup/addDiSetupGroup',
    auth,
    diSetupGroupController.addDiSetupGroup
);
diSetupGroup_route.get(
    '/diSetupGroup/getDiSetupGroup',
    auth,
    diSetupGroupController.getDiSetupGroup

);
diSetupGroup_route.delete(
    '/diSetupGroup/deleteDiSetupGroup',
    auth,
    diSetupGroupController.deleteDiSetupGroup
);
diSetupGroup_route.patch(
    '/diSetupGroup/editDiSetupGroup',
    auth,
    diSetupGroupController.editDiSetupGroup
);

diSetupGroup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = diSetupGroup_route;



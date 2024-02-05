const express = require("express");
const fareRules_route = express();
const bodyParser = require("body-parser");
fareRules_route.use(bodyParser.json());
fareRules_route.use(bodyParser.urlencoded({extended:true}));
const fareRuleController = require("../controllers/fareRules/fareRules.controller.js");
const auth = require("../middleware/auth.js");

fareRules_route.post(
   '/fareRule/addFareRules',
   auth,
   fareRuleController.addfareRule
);

fareRules_route.get(
  '/fareRule/getFareRules',
  auth,
  fareRuleController.getFareRule
);

fareRules_route.patch(
    '/fareRule/updateFareRules',
    auth,
    fareRuleController.updateFareRule
)

fareRules_route.delete(
  '/fareRule/deleteFareRules/:id',
  auth,
  fareRuleController.deleteFareRule
);

fareRules_route.post(
  '/fareRule/getCustomFareRule',
  auth,
  fareRuleController.getCustomFareRule
);


fareRules_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = fareRules_route;



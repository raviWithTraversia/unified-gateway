const express = require("express");
const fareRuleGroup_route = express();
const bodyParser = require("body-parser");
fareRuleGroup_route.use(bodyParser.json());
fareRuleGroup_route.use(bodyParser.urlencoded({extended:true}));
const fareRuleGroupController = require("../controllers/fareRuleGroup/fareRuleGroup.controller.js");
const auth = require("../middleware/auth.js");

fareRuleGroup_route.post(
   '/fareRuleGroup/addFareRules',
   auth,
   fareRuleGroupController.addFareRuleGroup
);

fareRuleGroup_route.get(
  '/fareRuleGroup/getFareRules',
 // auth,
  fareRuleGroupController.getFareRuleGroup
);

fareRuleGroup_route.patch(
    '/fareRuleGroup/updateFareRules',
    auth,
    fareRuleGroupController.editFareRuleGroup
)

fareRuleGroup_route.post(
  '/fareRuleGroup/getCustomFareRule',fareRuleGroupController.getCustomFareRule
)




fareRuleGroup_route.delete(
  '/fareRuleGroup/deleteFareRules',
  auth,
  fareRuleGroupController.deleteFareRuleGroup
);

fareRuleGroup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = fareRuleGroup_route;



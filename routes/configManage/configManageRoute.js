const express = require("express");
const config_manage_route = express();
const bodyParser = require("body-parser");
config_manage_route.use(bodyParser.json());
config_manage_route.use(bodyParser.urlencoded({extended:true}));
const configManage = require('../../controllers/configManage/configManage.controller');
const auth = require("../../middleware/auth");

config_manage_route.post('/config/addAirGstMandate' ,auth,  configManage.addairGSTMandate);
config_manage_route.post('/config/getAirGstMandate' ,auth,  configManage.getairGSTMandate);

module.exports = config_manage_route;
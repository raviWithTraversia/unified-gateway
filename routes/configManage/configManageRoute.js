const express = require("express");
const config_manage_route = express();
const bodyParser = require("body-parser");
config_manage_route.use(bodyParser.json());
config_manage_route.use(bodyParser.urlencoded({extended:true}));
const configManage = require('../../controllers/configManage/configManage.controller');
const auth = require("../../middleware/auth");

config_manage_route.post('/config/addAirGstMandate' ,auth,  configManage.addairGSTMandate);
config_manage_route.get('/config/getAirGstMandate/:companyId',auth,  configManage.getairGSTMandate);
config_manage_route.patch('/config/updateAirGstMandate/:airGstMandateId',auth,  configManage.updateairGSTMandate);
config_manage_route.delete('/config/deleteGSTMandate/:airGstMandateId', auth,configManage.deleteGSTMandate);



module.exports = config_manage_route;
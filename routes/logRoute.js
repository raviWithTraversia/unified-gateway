const express = require("express");
const log_route = express();
const bodyParser = require("body-parser");
log_route.use(bodyParser.json());
log_route.use(bodyParser.urlencoded({extended:true}));
const eventLogController = require('../controllers/logs/eventLogController');
const portalLogController = require('../controllers/logs/portalLogController');


// Event log route process By Alam Shah
log_route.post('/eventlog' , eventLogController.storeEventLog);
log_route.get('/retriveEventLog/:companyId' , eventLogController.retriveEventLogByCompanyId);

// Portal Log Route process
log_route.post('/portallog' , portalLogController.storePortalLog);
log_route.get('/retrivePortalLog/:traceId' , portalLogController.retrivePortalLog);

module.exports = log_route;
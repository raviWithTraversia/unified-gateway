const express = require("express");
const log_route = express();
const bodyParser = require("body-parser");
log_route.use(bodyParser.json());
log_route.use(bodyParser.urlencoded({ extended: true }));
const eventLogController = require('../controllers/logs/eventLog.controller');
const portalLogController = require('../controllers/logs/portalLog.controller');
const auth = require("../middleware/auth");


// Event log route process By Alam Shah

/**
 * @swagger
 * /api/log/eventlog:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add Event Log
 *     tags:
 *       - Log
 *     description: Add an event log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventName:
 *                 type: string
 *                 example: "User Login"
 *               doerId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
 *               doerName:
 *                 type: string
 *                 example: "John Doe"
 *               ipAddress:
 *                 type: string
 *                 example: "192.168.1.100"
 *               companyId:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       "200":
 *         description: Event log added successfully
 *       "401":
 *         description: Unauthorized. Please provide a valid token.
 *       "500":
 *         description: Internal server error. Something went wrong on our end.
 */


log_route.post(
    '/log/eventlog',
    auth,
    eventLogController.storeEventLog
);


/**
 * @swagger
 * /api/log/retriveEventLog/{companyId}:
 *   get:
 *     summary: Get event log requests by company ID
 *     tags:
 *       - Log
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: The ID of the company for which event logs are requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Event logs not available for the specified company.
 *       '500':
 *         description: Internal server error
 */


log_route.get(
    '/log/retriveEventLog/:companyId',
    auth,
    eventLogController.retriveEventLogByCompanyId
);

// Portal Log Route process

/**
 * @swagger
 * paths:
 *   /api/log/portallog:
 *     post:
 *       security:
 *         - bearerAuth: []
 *       summary: Add Portal Log
 *       tags:
 *         - Log
 *       description: Add a portal log
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 traceId:
 *                   type: string
 *                   example: "123456"
 *                 companyId:
 *                   type: string
 *                   example: "6538c030475692887584081e"
 *                 source:
 *                   type: string
 *                   example: "Web Application"
 *                 product:
 *                   type: string
 *                   example: "Product Name"
 *                 request:
 *                   type: string
 *                   example: "GET /api/some-endpoint"
 *                 response:
 *                   type: string
 *                   example: "200 OK"
 *       responses:
 *         '200':
 *           description: Portal log added successfully
 *         '401':
 *           description: Unauthorized. Please provide a valid token.
 *         '500':
 *           description: Internal server error. Something went wrong on our end.
 */


log_route.post(
    '/log/portallog',
    auth,
    portalLogController.storePortalLog
);

/**
 * @swagger
 * /api/log/retrivePortalLog/{traceId}:
 *   get:
 *     summary: Get portal event log requests by traceId
 *     tags:
 *       - Log
 *     parameters:
 *       - in: path
 *         name: traceId
 *         required: true
 *         description: The trace ID used to retrieve portal event logs.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Portal event logs not available for the specified trace ID.
 *       '500':
 *         description: Internal server error
 */

log_route.get(
    '/log/retrivePortalLog/:traceId',
    auth,
    portalLogController.retrivePortalLog
);

log_route.post('/log/getBookingLogs', auth, portalLogController.getBookingLogs);

log_route.get('/log/getEventLog', auth, eventLogController.getEventLog);
log_route.get('/log/getbyid',eventLogController.getEventlogbyid)
log_route.get('/log/getAgency',eventLogController.getAgencyLog)
log_route.get('/log/getAgencyConfig',eventLogController.getAgencyLogConfig)

log_route.get('/log/getaircommercialeventlog',eventLogController.getairCommercialfilterlog)
log_route.get('/log/getdisetup',eventLogController.getDisetuplog)
log_route.get('/log/getSsr',eventLogController.getSsrlog)

log_route.get('/log/getincentivelog',eventLogController.getIncenctivelog)

log_route.get('/log/getFarerules',eventLogController.getFairRuleslog)

log_route.get('/log/getPgCharges',eventLogController.getPgChargeslog)




module.exports = log_route;
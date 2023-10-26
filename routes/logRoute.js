const express = require("express");
const log_route = express();
const bodyParser = require("body-parser");
log_route.use(bodyParser.json());
log_route.use(bodyParser.urlencoded({extended:true}));
const eventLogController = require('../controllers/logs/eventLog.controller');
const portalLogController = require('../controllers/logs/portalLog.controller');


// Event log route process By Alam Shah

 /**
 * @swagger
 * paths:
 *  /api/eventlog:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Event Log
 *      tags: [Add Event Log]
 *      description: Add an event log
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
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
 *      responses:
 *        "200":
 *          description: Event log added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

log_route.post('/eventlog' , eventLogController.storeEventLog);


/**
 * @swagger
 * /api/retriveEventLog/651f88e66be7808dd4bbdd70:
 *   get:
 *     summary: Get  event log requests by company id
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Credit request not available
 *       500:
 *         description: Internal server error
 */
log_route.get('/retriveEventLog/:companyId' , eventLogController.retriveEventLogByCompanyId);

// Portal Log Route process
/**
 * @swagger
 * paths:
 *  /api/portallog:
 *    post:
 *      security:
 *      - bearerAuth: []
 *      summary: Add Portal Log
 *      tags: [Add Portal Log]
 *      description: Add a portal log
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               traceId:
 *                 type: string
 *                 example: "123456"
 *               companyId:
 *                 type: string
 *                 example: "6538c030475692887584081e"
 *               source:
 *                 type: string
 *                 example: "Web Application"
 *               product:
 *                 type: string
 *                 example: "Product Name"
 *               request:
 *                 type: string
 *                 example: "GET /api/some-endpoint"
 *               response:
 *                 type: string
 *                 example: "200 OK"
 *      responses:
 *        "200":
 *          description: Portal log added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */

log_route.post('/portallog' , portalLogController.storePortalLog);

/**
 * @swagger
 * /api/retrivePortalLog/100323:
 *   get:
 *     summary: Get protal  event log requests by traceId
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: protal log list not available
 *       500:
 *         description: Internal server error
 */
log_route.get('/retrivePortalLog/:traceId' , portalLogController.retrivePortalLog);

module.exports = log_route;
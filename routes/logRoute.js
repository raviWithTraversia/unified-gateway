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
 *      summary: For add eventlog
 *      tags: [add eventlog]
 *      description: for add event log
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               eventName:
 *                 type: string
 *               doerId:
 *                 type: string 
 *               doerName: 
 *                 type: string 
 *               ipAddress:
 *                 type: string
 *               companyId:
 *                 type: string
 *      responses:
 *        "200":
 *          description: Event log added Sucessfully
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
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
 *      summary: For add portallog
 *      tags: [For add portallog]
 *      description: for add portallog
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *               traceId:
 *                 type: string
 *               companyId:
 *                 type: string 
 *               source: 
 *                 type: string 
 *               product:
 *                 type: string
 *               request:
 *                 type: string
 *               responce:
 *                 type: string
 *      responses:
 *        "200":
 *          description:  event log list not available
 *        "401":
 *          description: user unutharized
 *        "500":
 *          description: server error
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
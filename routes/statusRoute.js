const express = require("express");
const status_route = express();
const bodyParser = require("body-parser");
status_route.use(bodyParser.json());
status_route.use(bodyParser.urlencoded({extended:true}));
const statusController = require('../controllers/status/status.controller');
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/status/getStatus/:statustype:
 *   get:
 *     summary: Find a status by its ID.
 *     tags:
 *       - Status
 *     parameters:
 *       - in: query
 *         name: statusId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the status to find.
 *     responses:
 *       '200':
 *         description: Status found successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: Status Found Successfully
 *               data: { yourStatusData }
 *       '404':
 *         description: Status not found.
 *         content:
 *           application/json:
 *             example:
 *               response: Status not Found
 *       '500':
 *         description: Internal server error.
 */

status_route.get(
   '/status/getStatus',
   statusController.findStatusType
);

/**
 * @swagger
 * /api/status/addstatus:
 *   post:
 *     summary: Add a new status type.
 *     tags:
 *       - Status
 *     requestBody:
 *       description: Name and type of the new status.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Status Name
 *               type:
 *                 type: string
 *                 example: New Status Type
 *     responses:
 *       '200':
 *         description: New status created successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: New status created successfully
 *               data: { yourNewStatusData }
 *       '400':
 *         description: This status or type already exists or bad request.
 *         content:
 *           application/json:
 *             example:
 *               response: This status or type already exists
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */


status_route.post(
  '/status/addstatus',
  statusController.addStatusType

 )

 /**
 * @swagger
 * /api/status/allstatus:
 *   get:
 *     summary: Get all status types.
 *     tags:
 *       - Status
 *     responses:
 *       '200':
 *         description: All status types fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               response: All status types fetched successfully
 *               data: [{ yourStatusData1 }, { yourStatusData2 }, ...]
 *       '404':
 *         description: No status found.
 *         content:
 *           application/json:
 *             example:
 *               response: No status found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */

status_route.get(
  '/status/allstatus',
  statusController.findAllStatusType
);


status_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = status_route;
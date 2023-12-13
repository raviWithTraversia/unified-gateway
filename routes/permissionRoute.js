const express = require("express");
const permission_route = express();
const bodyParser = require("body-parser");
permission_route.use(bodyParser.json());
permission_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const Permission = require('./../controllers/permission/permission.controller')


/**
 * @swagger
 * /api/permission/all-permission-list:
 *   get:
 *     summary: Permission List 
 *     tags:
 *       - Permission
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Permission not available
 *       500:
 *         description: Internal server error
 */

permission_route.get(
    '/permission/all-permission-list' ,
    auth,
    Permission.permissionList
);

permission_route.post(
    '/permission/add-permission',
    auth,
    Permission.addPermission
)
module.exports = permission_route
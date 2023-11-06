const express = require("express");
const role_route = express();
const bodyParser = require("body-parser");
role_route.use(bodyParser.json());
role_route.use(bodyParser.urlencoded({extended:true}));
const roleController = require('../controllers/role/role.controller');
const auth = require("../middleware/auth");

/**
* swagger: "2.0"
* info:
*   title: Your API Title
*   version: 1.0.0
* paths:
*   /api/role/create-role:
*     post:
*       tags:
*         - roles
*       summary: Create a new role
*       parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               roleName:
*                 type: string
*                 example: "Host" # Example: "Host" (Role name)
*               companyId:
*                 type: string
*                 example: "653b88448570cec0d7bdb6b2" # Example: "653b88448570cec0d7bdb6b2" (Company ID)
*           required: true
*       responses:
*         200:
*           description: New Role Created Successfully
*           schema:
*             type: object
*             properties:
*               response:
*                 type: string
*                 example: "New Role Created Successfully" # Example: "New Role Created Successfully"
*               data:
*                 type: object
*                 # Define the properties of the "data" object here, or provide an example.
*         400:
*           description: Bad Request
*           schema:
*             type: object
*             properties:
*               response:
*                 type: string
*                 example: "companyId is not valid" # Example: "companyId is not valid"
*         409:
*           description: Role Name Already Exists
*           schema:
*             type: object
*             properties:
*               response:
*                 type: string
*                 example: "This role name already exists" # Example: "This role name already exists"
*/

role_route.post(
    "/role/create-role",
    auth,
    roleController.createRoles

);


role_route.get(
    "/role/get-role/:companyId",
   // auth,
    roleController.findRoles
);


role_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = role_route;

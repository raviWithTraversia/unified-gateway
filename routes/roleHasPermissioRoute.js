const roleHasPermissionController = require('./../controllers/roleHasPermission/roleHasPermission.controller');
const express = require("express");
const role_has_permission_route = express();
const bodyParser = require("body-parser");
role_has_permission_route.use(bodyParser.json());
role_has_permission_route.use(bodyParser.urlencoded({extended:true}));


role_has_permission_route.post(
    '/role/store-role-has-permission',
    roleHasPermissionController.addRoleHasPermission
);

role_has_permission_route.get(
    '/role/get-role-has-permission/:roleId',
    roleHasPermissionController.getRoleHasPermission
);

role_has_permission_route.patch(
    '/role/update-role-has-permission/:planId',
    roleHasPermissionController.updateRoleHasPermission
);

module.exports = role_has_permission_route;
const express = require("express");
const markup_route = express();
const bodyParser = require("body-parser");
markup_route.use(bodyParser.json());
markup_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const markupController = require('./../controllers/manageMarkup/manageMarkup.controller');

markup_route.post(
  '/markup/addMarkup',
  auth,
  markupController.addMarkup
);
markup_route.patch(
    '/markup/updateMarkup',
    auth,
    markupController.updateMarkup 
);
markup_route.delete(
    '/markup/deletedMarkup',
    auth,
    markupController.deletedMarkup 
);
markup_route.get(
    '/markup/getMarkUp',
    auth,
    markupController.getMarkUp

);
markup_route.get(
    '/markup/getMarkUpCatogeryMaster',
    auth,
    markupController.getMarkUpCatogeryMaster
);

markup_route.get("/markup/getmarkuploghistory",markupController.getMarkuplogHistory)
markup_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = markup_route;


const express = require("express");
const mangageUpload_route = express();
const bodyParser = require("body-parser");
mangageUpload_route.use(bodyParser.json());
mangageUpload_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const multer = require('multer');
const manageUploadController = require('../controllers/manageUploads/manageUploads.controller');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mangageUpload_route.post(
   '/manageUpload/addImageUpload',
    upload.single('image'),
    manageUploadController.addImageUpload
);
mangageUpload_route.get(
   '/manageUpload/getUploadImage',
   auth,
   manageUploadController.getUploadImage
);
mangageUpload_route.patch(
   '/manageUpload/updateUploadImage',
   auth,
   upload.single('image'),
   manageUploadController.updateUploadImage
);

mangageUpload_route.delete(
   '/manageUpload/deleteUploadImage',
   auth,
   manageUploadController.deleteUploadImage
)
mangageUpload_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});

module.exports = mangageUpload_route;

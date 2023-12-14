const express = require("express");
const mangageUpload_route = express();
const bodyParser = require("body-parser");
mangageUpload_route.use(bodyParser.json());
mangageUpload_route.use(bodyParser.urlencoded({ extended: true }));
const auth = require("../middleware/auth");
const multer = require("multer");
const manageUploadController = require("../controllers/manageUploads/manageUploads.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./Public/uploadImage");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

mangageUpload_route.post(
  "/manageUpload/addImageUpload",
  (req, res, next) => {
    if (!req.file) {
      req.body.image = null;
    }
    next();
  },
  upload.single("image"),
  manageUploadController.addImageUpload
);
mangageUpload_route.get(
  "/manageUpload/getUploadImage",
  auth,
  manageUploadController.getUploadImage
);
mangageUpload_route.patch(
  "/manageUpload/updateUploadImage",
  (req, res, next) => {
    if (!req.file) {
      req.body.image = null;
    }
    next();
  },
  upload.single("image"),
  manageUploadController.updateUploadImage
);

mangageUpload_route.delete(
  "/manageUpload/deleteUploadImage/:uploadImageDetailsId",
  auth,
  manageUploadController.deleteUploadImage
);
mangageUpload_route.get("/test", auth, function (req, res) {
  res.status(200).json({ status: "success", msg: "this is test responce" });
});

module.exports = mangageUpload_route;

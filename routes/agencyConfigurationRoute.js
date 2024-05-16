const express = require("express");
const agency_config_route = express();
const bodyParser = require("body-parser");
agency_config_route.use(bodyParser.json());
agency_config_route.use(bodyParser.urlencoded({extended:false}));
const auth = require("../middleware/auth");
const agencyConfigurationController = require('./../controllers/agentConfig/agentConfig.controller');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./Public/agency");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

agency_config_route.patch(
  "/agentConfiguration/updateAgencyProfile",
  (req, res, next) => {
    req.body.images = {};
  
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        let key;
  
        switch (file.fieldname) {
          case 'tds_exemption_certificate_URL':
            key = 'tds_exemption_certificate_URL';
            break;
          case 'gst_URL':
            key = 'gst_URL';
            break;
          case 'panUpload_URL':
            key = 'panUpload_URL';
            break;
          case 'logoDocument_URL':
            key = 'logoDocument_URL';
            break;
          case 'signature_URL':
            key = 'signature_URL';
            break;
          case 'aadhar_URL':
            key = 'aadhar_URL';
            break;
          case 'agencyLogo_URL':
            key = 'agencyLogo_URL';
            break;
          default:
            key = `image${index + 1}`;
            break;
        }
  
        req.body.images[key] = {
          path: file.path,
          filename: file.filename
        };
      });
    }
  
    next();
  },
  upload.fields([
    { name: 'tds_exemption_certificate_URL', maxCount: 1 },
    { name: 'gst_URL', maxCount: 1 },
    { name: 'panUpload_URL', maxCount: 1 },
    { name: 'logoDocument_URL', maxCount: 1 },
    { name: 'signature_URL', maxCount: 1 },
    { name: 'aadhar_URL', maxCount: 1 },
    { name: 'agencyLogo_URL', maxCount: 1 },
  ]),
  agencyConfigurationController.updateAgencyProfile  
);
agency_config_route.patch(
    '/agentConfiguration/updateAgentConfiguration',
    auth,
    agencyConfigurationController.updateAgentConfiguration
);
agency_config_route.get(
    '/agentConfiguration/getAgentConfig',
    auth,
    agencyConfigurationController.getAgentConfig
);

agency_config_route.get(
  '/agentConfiguration/getUserProfile',
  auth,
  agencyConfigurationController.getUserProfile
)






agency_config_route.get('/test',auth, function(req, res){
    res.status(200).json({status:"success",msg:"this is test responce"});
});


module.exports =  agency_config_route;
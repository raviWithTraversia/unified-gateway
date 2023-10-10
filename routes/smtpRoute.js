const express = require("express");
const smtp_route = express();
const bodyParser = require("body-parser");
smtp_route.use(bodyParser.json());
smtp_route.use(bodyParser.urlencoded({extended:true}));
const smtpController = require("../controllers/smtp/smpt.controller");
const auth = require("../middleware/auth");

smtp_route.get(
    '/smtpConfig',
     smtpController.smtpConfig
    )

smtp_route.post(
    '/add/smtpConfig',
     smtpController.addSmtpConfig
    );

smtp_route.delete(
    '/remove/smtpConfig/:companyId',
    smtpController.removeSmtpConfig
      
);

smtp_route.patch(
    '/update/smtpConfig/:companyId',
    smtpController.updateSmtpConfig
)

smtp_route.patch()


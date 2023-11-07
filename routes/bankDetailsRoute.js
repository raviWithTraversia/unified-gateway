const express = require("express");
const add_bank_details_route = express();
const bodyParser = require("body-parser");
add_bank_details_route.use(bodyParser.json());
add_bank_details_route.use(bodyParser.urlencoded({extended:true}));
const multer = require('multer'); // Import Multer
const bankDetailController = require('../controllers/bankDetails/bankDetails.controller');


// Define storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

add_bank_details_route.post
   (
    '/bank-details/addBankDetails', 
    upload.single('QrcodeImage'),
    bankDetailController.addBankDetails
  );

  add_bank_details_route.get
  (
    '/bank-details/getBankDetails/:companyId',
    bankDetailController.getBankDetails
  )




 module.exports = add_bank_details_route
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
    '/bank-details/getBankDetails',
    bankDetailController.getBankDetails
  );

  add_bank_details_route.patch(
    '/bank-details/updateBankDetails',
    bankDetailController.updateBankDetails
  );

  add_bank_details_route.delete(
    '/bank-details/deleteBankDetails',
    bankDetailController.deleteBankDetails
  )




 module.exports = add_bank_details_route
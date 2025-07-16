const express = require("express");
const add_bank_details_route = express();
const bodyParser = require("body-parser");
add_bank_details_route.use(bodyParser.json());
add_bank_details_route.use(bodyParser.urlencoded({extended:true}));
const multer = require('multer'); // Import Multer
const bankDetailController = require('../controllers/bankDetails/bankDetails.controller');

const fs = require('fs');

const uploadDir = './bank';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   return cb(null, './bank');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Only image files are allowed!');
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

const upload = multer({ storage, fileFilter });

// Main route
add_bank_details_route.post(
  '/bank-details/addBankDetails',
  upload.fields([{ name: 'QrcodeImage', maxCount: 1 }]),

  (req, res, next) => {
    req.body.images = {};
    
    if (req.files && req.files.QrcodeImage) {
      req.files.QrcodeImage.forEach((file) => {
        req.body.images['QrcodeImage'] = {
          path: file.path,
          filename: file.filename
        };
      });
    }
    
    next();
  },
  bankDetailController.addBankDetails
);

  add_bank_details_route.get
  (
    '/bank-details/getBankDetails',
    bankDetailController.getBankDetails
  );

  add_bank_details_route.patch(
    '/bank-details/updateBankDetails',
    (req, res, next) => {
      req.body.images = {};
      if (req.files && req.files.length > 0) {
        req.files.forEach((file, index) => {
          switch (file.fieldname) {
            case 'QrcodeImage':
              key = 'QrcodeImage';
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
      { name: 'QrcodeImage', maxCount: 1 },
    ]),
    bankDetailController.updateBankDetails
  );

  add_bank_details_route.delete(
    '/bank-details/deleteBankDetails/:id',
    bankDetailController.deleteBankDetails
  )




 module.exports = add_bank_details_route
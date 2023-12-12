const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Image = mongoose.model('Image', {
  imageUrl: String,
});

const bankDetailsSchema = new mongoose.Schema({
  // ... (your existing schema)
  QrcodeImage: {
    type: String,
  },
});

const ManageBankDetails = mongoose.model("ManageBankDetails", bankDetailsSchema);

const storage = multer.diskStorage({
  destination: './app/images/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/addBankDetail', upload.single('QrcodeImageFile'), async (req, res) => {
  try {
    // Generate a unique filename for the QrcodeImage
    const qrcodeImageFilename = 'qrcode-' + Date.now() + '.png';
    const qrcodeImagePath = path.join(__dirname, 'app', 'images', qrcodeImageFilename);

    // Generate and save the QR code image
    await qrcode.toFile(qrcodeImagePath, req.body.QrcodeData);

    // Save the image URL to MongoDB
    const imageUrl = '/images/' + qrcodeImageFilename;
    const image = new Image({ imageUrl });
    await image.save();

    // Save bank details with QrcodeImage URL
    const bankDetail = new ManageBankDetails({
      // ... (other bank details fields)
      QrcodeImage: imageUrl,
    });
    await bankDetail.save();

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

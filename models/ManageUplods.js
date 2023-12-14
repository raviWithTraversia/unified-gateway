const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  imagePath: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const manageUpload = mongoose.model("manageUpload", uploadSchema);
module.exports = manageUpload;

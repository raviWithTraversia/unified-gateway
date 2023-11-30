const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
   type : {
    data: Buffer,       
    contentType: String
   },
   title : {
     data : String
   },
   description : {
     data : String
   },
   image : {
    data: Buffer,       
    contentType: String
   },
   userId: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
},
});
const manageUpload = mongoose.model("manageUpload", uploadSchema);
module.exports = manageUpload;
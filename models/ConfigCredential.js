const mongoose = require('mongoose');

const credentialConfigSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    password :  {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
    },
    forWhat : {
        type : String
    },
    type : {
       token : String,
       secretKey : String,
       urlActive : String,
       entityId : String,
       tempId : String
    }
   
});
const configCred  = mongoose.model("configCred", credentialConfigSchema);
module.exports = configCred;

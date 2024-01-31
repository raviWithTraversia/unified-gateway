const mongoose = require('mongoose');

const ssrGroupSchema = new mongoose.Schema({
    ssrCommercialIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ssrCommercial'
      }],
      ssrCommercialName : {
        type : String
      },
      modifyAt :{
        type : Date
      },
      modifyBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
      },
      companyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company'
      },
      isDefault : {
        type : Boolean,
        default: false
      }
}, {
    timestamps : true
});
const ssrCommercialGroup = mongoose.model("ssrCommercialGroup", ssrGroupSchema);
module.exports = ssrCommercialGroup;

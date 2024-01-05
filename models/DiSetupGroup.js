const mongoose = require('mongoose');

const diSetupGroupSchema = new mongoose.Schema({
    diSetupIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'diSetup'
      }],
      diSetupGroupName : {
        type : String
      },
      modifyAt :{
        type : Date,
        default : Date.now
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
},{
    timestamps : true
});
const diSetupGroupModel = mongoose.model("diSetupGroupModel", diSetupGroupSchema);
module.exports = diSetupGroupModel;
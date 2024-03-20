const mongoose = require("mongoose");
const idCreationSchema = new mongoose.Schema({

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    type:{
      type : String ,
      default:null
    },
    prefix:{ // TD,KAFILA
        type: String,
        default: null
    },    
    suffix: { // 10000, 23232, etc
      type: Number,
      default: 100000
    },
    description: { 
        type: String,
        default: null
    },        
    modifyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifyAt: {
      type: Date,
      default: Date.now(),
    }    
  },
  {
    timestamps: true,
  }
);

const idCreation = mongoose.model(
  "idCreation",
  idCreationSchema
);
module.exports = idCreation;

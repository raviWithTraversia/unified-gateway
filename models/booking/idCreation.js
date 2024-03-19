const mongoose = require("mongoose");
const idCreationSchema = new mongoose.Schema({

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    prefix:{ // TD,KAFILA
        type: String,
        default: null
    },    
    suffix: { // 10000, 23232, etc
      type: String,
      default: null
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

const mongoose = require('mongoose');

const parmissionSchema = new mongoose.Schema({
      
    productName: { 
      type: String,
      required: false,        
      default: null
    },
    categoryName: {
      type: String,
      required: false,        
      default: null
    },
    permissionName: {
      type: String,
      required: true,        
      default: null
    },
    permissionDescription: {
      type: String,
      required: false,        
      default: null
    },
    emulate : {
      type: Boolean,
      default : false
    },
    allow : {
      type : Boolean,
      default : true
    }

}, {
  timestamps: true 
});

module.exports = mongoose.model('Permission', parmissionSchema);

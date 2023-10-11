const mongoose = require('mongoose');

const parmissionSchema = new mongoose.Schema({
      
  category: {
      type: String,
      required: true,        
      default: null
    },
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
      required: false,        
      default: null
    },
    permissionDescription: {
      type: String,
      required: false,        
      default: null
    },

}, {
  timestamps: true // Adds created_at and updated_at fields
});

module.exports = mongoose.model('Permission', parmissionSchema);

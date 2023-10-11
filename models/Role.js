const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
      
    name: {
      type: String,
      required: true,        
      default: null
    },    
    companyId: {
      type: String,
      required: false,        
      default: null
    }   
 
}, {
  timestamps: true // Adds created_at and updated_at fields
});

module.exports = mongoose.model('Role', roleSchema);

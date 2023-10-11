const mongoose = require('mongoose');

const parmissionSchema = new mongoose.Schema({
      
    name: {
      type: String,
      required: true,        
      default: null
    }       
 
}, {
  timestamps: true // Adds created_at and updated_at fields
});

module.exports = mongoose.model('Permission', parmissionSchema);

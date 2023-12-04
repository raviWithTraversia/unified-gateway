const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
      
    name: {
      type: String,
      required: true,        
      default: null
    },    
    companyId:  {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'User'
  } ,
  type : {
    type : String,
  }
 
}, {
  timestamps: true // Adds created_at and updated_at fields
});
const Role = mongoose.model("Role", roleSchema);
module.exports = Role;


const mongoose = require('mongoose');

const roleHasPermissionsSchema = new mongoose.Schema({
      
    permissionId: {
      type: String,
      required: true,        
      default: null
    },
    roleId: { // web or mob
      type: String,
      required: true,        
      default: null
    }      
 
}, {
  timestamps: true // Adds created_at and updated_at fields
});

module.exports = mongoose.model('RoleHasPermission', roleHasPermissionsSchema);

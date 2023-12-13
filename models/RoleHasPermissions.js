const mongoose = require('mongoose');

const roleHasPermissionsSchema = new mongoose.Schema({
      
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Permission'
    },
    roleId: { // web or mob
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Role'
    }      
 
}, {
  timestamps: true
});

module.exports = mongoose.model('RoleHasPermission', roleHasPermissionsSchema);

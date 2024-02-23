const mongoose = require('mongoose');

const roleHasPermissionsSchema = new mongoose.Schema({
      
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Permission'
    },
    roleId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref : 'Role'
    },
    emulate:{
      type : Boolean,
      default : false
    }

 
}, {
  timestamps: true
});

module.exports = mongoose.model('RoleHasPermission', roleHasPermissionsSchema);

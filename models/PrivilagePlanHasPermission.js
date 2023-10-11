const mongoose = require('mongoose');

const privilagePlanHasPermissionSchema = mongoose.Schema({
    privilagePlanId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PrivilagePlan',
    },
    permissionId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }
} , {
    timestamps : true //created_at and updated_at coloumn add
});

module.exports = mongoose.model('privilagePlanHasPermission' , privilagePlanHasPermissionSchema);
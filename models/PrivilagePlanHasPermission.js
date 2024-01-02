const mongoose = require('mongoose');

const privilagePlanHasPermissionSchema = new mongoose.Schema({
    privilagePlanId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PrivilagePlan',
    },
    permissionId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    },
    emulate:{
        type : Boolean,
        default : false
    }
} , {
    timestamps : true //created_at and updated_at coloumn add
});

module.exports = mongoose.model('privilagePlanHasPermission' , privilagePlanHasPermissionSchema);
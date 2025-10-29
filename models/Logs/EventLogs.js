const mongoose = require("mongoose");

const eventLogSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: false,
        default: null
    },
    doerId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'User' },
    doerName: {
        type: String,
        required: false,
        default: null 
    },
    ipAddress: {
        type: String,
        required: false,
        default: null
    },
    oldValue:{
        type:Object,
        default:null
    },

    newValue:{
        type:Object,
        default:null
    },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

    documentId:{
type:mongoose.Schema.Types.ObjectId,

    },


    description: {
        type: String,
        required: false,
        default: null
    },
}, {
    timestamps: true // Adds created_at and updated_at fields
});
eventLogSchema.index({ companyId: 1 });
eventLogSchema.index({ doerId: 1 });
eventLogSchema.index({ eventName: 1 });
eventLogSchema.index({ createdAt: -1 }); 
eventLogSchema.index({ doumentId: 1 }); 


module.exports = mongoose.model('EventLog', eventLogSchema);
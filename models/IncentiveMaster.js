
const mongoose = require('mongoose');

const IncentiveMasterSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'Company'
    },
    origin: {
        type: String,
        required: false,
        default : null
    },
    destination: {
        type: String,
        required: false,
        default : null
    },
    supplierCode: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'SupplierCode',
        default:null
    },
    airlineCode: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'AirlineCode',
        default : null
    },
    cabinClass: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'CabinClassMaster',
        default : null
    },
    rbd: {
        type : String,
        required : false,
        default : null
    },
    PLBApplyOnBasefare: {
        type : Boolean,
        default: false
    },
    PLBApplyOnYQ: {
        type : Boolean,
        default : false
    },
    PLBApplyOnYR: {
        type: Boolean,
        default : false
    },
    PLBApplyOnTotalAmount: {
        type : Boolean,
        default: false
    },
    PLBApplyOnAllTAxes: {
        type: Boolean,
        default : false
    },
    minPrice: {
        type : Number,
        default : 0,
    },
    maxPrice: {
        type : Number,
        default : 0,
    },
    travelDateFrom: {
        type:  Date,
        default : null
    },
    travelDateTo: {
        type: Date,
        default : null
    },
    PLBValueType: {
        type: Number,
        required : false,
        default : 0
    },
    PLBValueType: {
        type: String,
        enum : ['percentage' , 'fixed'],
        default : 'fixed'
    },
    PLBValue:{
        type: String,
        default : '0'
    },
    PLBType: {
        type: String,
        enum : ['incoming' , 'outgoing'],
        default : 'incoming'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'User'
    },
    modifiedAt: {
        type: Date,
        default: new Date()
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'User'
    },
    status: {
        type: Boolean,
        default : true
    },
    datefIssueFrom: {
        type: Date,
        default: null
    },
    datefIssueTo: {
        type : Date,
        default : null
    },
    fareFamily: {
        type: mongoose.Schema.Types.ObjectId,
        'ref': 'FareFamilyMaster',
        default : null
    },
    deductTDS: {
        type : Boolean,
        default: false
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    flightNo:{
        type: String,
        default: null
    },
    dealcode: {
        type: String,
        default: null
    },
    farebasis:{
        type: String,
        default: null 
    },
    isDefault:{
        type: Boolean,
        default: false 
    }
},{
    timestamps : true 
}
);

module.exports = mongoose.model('IncentiveMaster' , IncentiveMasterSchema);
const mongoose=require('mongoose')

const ObjectData=new mongoose.Schema({
sleepar:{
    type:Number,
    },
    acCharge:{
        type:Number,
    },
    remark:{
        type:String,
    }
})

const RailcommercialSchema=new mongoose.Schema({
    
companyId:{type:mongoose.Schema.Types.ObjectId,
        ref:"companies"
    },
modifyBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users"
},
Conveniencefee:ObjectData,

Agent_service_charge:ObjectData,

PG_charges:ObjectData,

status:{
    type:Boolean,
    default:true
},
validDateFrom: Date,
validDateTo: Date,
description:String

},{
timestamps: true,
}
)
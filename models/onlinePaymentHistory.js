const mongoose = require("mongoose");

const onlinePaymentHistorySchema = new mongoose.Schema({
companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
},
userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
    },
    transId: {
        type: String,
        default:""
    },
    amount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "PENDING"
    },
    uuid: {
        type:Number,
        default:0
    },
    type:{
        type: String,
        default:""
    },
    product:{
        type:String,
        default:""
    }
   
},{timestamps: true});

onlinePaymentHistorySchema.index({uuid: 1});
onlinePaymentHistorySchema.index({transId: 1});
onlinePaymentHistorySchema.index({status: 1});
onlinePaymentHistorySchema.index({userId: 1});
onlinePaymentHistorySchema.index({companyId: 1});

onlinePaymentHistorySchema.pre('save', async function (next) {
    if (!this.uuid) {
        const count = await this.constructor.countDocuments();
        this.uuid = count + 1;
    }
    next();
});

module.exports = mongoose.model("OnlinePaymentHistory", onlinePaymentHistorySchema);
    
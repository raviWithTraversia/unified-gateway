const mongoose = require('mongoose');

const markupSchema = new mongoose.Schema({
markUpCategoryId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'markUpCategoryModel'
},
markupRate : {
    type : Number,
    default : 0
},
adultFixed : {
    type : Number,
    default : 0 
},
childFixed : {
    type : Number,
    default : 0
},
infantFixed : {
    type : Number,
    default : 0
},
maxMarkup : {
    type : Number,
    default : 0
},
sectorWise : {
    type :Boolean,
    default : false
},
flightWise : {
    type :Boolean ,
    default : false
}
});
const manageMarkupMaster = mongoose.model("manageMarkupMaster", markupSchema);
module.exports = manageMarkupMaster;
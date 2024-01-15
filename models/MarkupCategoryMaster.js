const mongoose = require('mongoose');

const markeUpCategorySchema = new mongoose.Schema({
    markUpCategoryName : {
        type : String,
        index : true,
        unique : true
    }
});
const markUpCategoryModel = mongoose.model("markUpCategoryModel", markeUpCategorySchema);
module.exports = markUpCategoryModel;
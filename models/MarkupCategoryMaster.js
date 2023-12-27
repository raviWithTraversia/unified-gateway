const mongoose = require('mongoose');

const markeUpCategorySchema = new mongoose.Schema({
    markUpCategoryName : {
        type : String
    }
});
const markUpCategoryModel = mongoose.model("markUpCategoryModel", markeUpCategorySchema);
module.exports = markUpCategoryModel;
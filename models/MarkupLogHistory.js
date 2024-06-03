const mongoose = require('mongoose');
const markupMasterData = require('./MangeMarkupMaster')

const MarkupLogHistory = new mongoose.Schema({
    markupId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'manageMarkup'
    },
   
    markupDataNew: [markupMasterData.schema],
    markupDataOld: [markupMasterData.schema],

    doerId:{
        
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        
       
    },
});

module.exports = mongoose.model('MarkupLogHistory' , MarkupLogHistory);
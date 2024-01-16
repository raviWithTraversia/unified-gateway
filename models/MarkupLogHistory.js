const mongoose = require('mongoose');
const markupMasterData = require('./MangeMarkupMaster')

const MarkupLogHistory = new mongoose.Schema({
    markupId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'manageMarkupMaster'
    },
    markupDataNew: [markupMasterData.schema],
    markupDataOld: [markupMasterData.schema],
});

module.exports = mongoose.model('MarkupLogHistory' , MarkupLogHistory);
const express = require("express");
const credit_Notes = express();
const bodyParser = require("body-parser");
credit_Notes.use(bodyParser.json());
credit_Notes.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");

const creditNotescontroller=require('../controllers/creditNotes/creditNotescontroller')
const creditNoteService=require('../controllers/creditNotes/creditNotes.service')
credit_Notes.post("/credit-notes",auth,creditNotescontroller.flightCreditNotes);
credit_Notes.post("/find-cancelation", auth,creditNotescontroller.cancelationBooking)
credit_Notes.post("/find-cacelation-history-update",auth,creditNotescontroller.findCancelationRefund)
credit_Notes.post("/manual-refund",auth,creditNotescontroller.ManualRefund)
credit_Notes.post("/flight/manual/refund/update",auth,creditNoteService.editRefundCancelation)



module.exports=credit_Notes
const express = require("express");
const credit_Notes = express();
const bodyParser = require("body-parser");
credit_Notes.use(bodyParser.json());
credit_Notes.use(bodyParser.urlencoded({extended:true}));
const creditNotescontroller=require('../controllers/creditNotes/creditNotescontroller')
credit_Notes.post("/credit-notes",creditNotescontroller.flightCreditNotes);
credit_Notes.post("/find-cancelation",creditNotescontroller.cancelationBooking)
credit_Notes.post("/find-cacelation-history-update",creditNotescontroller.findCancelationRefund)


module.exports=credit_Notes
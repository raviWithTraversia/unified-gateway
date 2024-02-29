const mongoose = require("mongoose");

const seriesDepartureSchema = new mongoose.Schema({
  pnr: String,
  account_code: String,
  flight_type: String,
  cabin_class: String,
  trip_type: String,
  fare_name: String,
  aircraft_type: String,
  airline_code: String,
  flight_number: Number,
  origin_airport_code: String,
  origin_airport_terminal: String,
  destination_airport_code: String,
  destination_airport_terminal: String,
  departure_date: String,
  departure_time: String,
  arrival_date: String,
  arrival_time: String,
  distance: Number,
  travel_time: String,
  stops: Number,
  total_seats: Number,
  available_seats: Number,
  rbd: String,
  baseamount: Number,
  fuelsurchg: Number,
  taxamount: Number,
  baseamountchd: Number,
  fuelsurchgchd: Number,
  taxamountchd: Number,
  baseamountinf: Number,
  fuelsurchginf: Number,
  taxamountinf: Number,
  carryonallowance: String,
  baggageallowance: String,
  isrefundable: Number,
  cancelpenalty: String,
  changepenalty: String,
  isactive: Number,
  baseamountcost: Number,
  fuelsurchgcost: Number,
  taxamountcost: Number,
  baseamountchdcost: Number,
  fuelsurchgchdcost: Number,
  taxamountchdcost: Number,
  baseamountinfcost: Number,
  fuelsurchginfcost: Number,
  taxamountinfcost: Number,
  seriesId : {
    type :String,
    unique : true
  },
  status : {
    type : String,
    enum : ['Pending','Approved','Rejected'],
    default : "Pending"
  },
  isActive : {
    type : Boolean,
    default : false
  },
  autoTicketing : {
    type : Boolean,
    default : false
  },
  nonRefundable : {
    type : Boolean,
    default : false
  },
  flights: [
      {
          airline_code: String,
          boundtype: Number,
          flightnumber: Number,
          origin: String,
          oterm: String,
          destination: String,
          dterm: String,
          departuredate: String,
          departuretime: String,
          arrivaldate: String,
          arrivaltime: String,
          flyingtime: String,
          distance: Number,
          baggage: {
              name: String,
              charge: Number
          },
          meal: {
              type: String,
              charge: Number
          }
      }
  ],
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  },
  companyId : {
    type : mongoose.Schema.Types.ObjectId,
    'ref': 'Company'
  }
});
const seriesDeparture = mongoose.model("seriesDeparture", seriesDepartureSchema);
module.exports = seriesDeparture;
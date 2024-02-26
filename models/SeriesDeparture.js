const mongoose = require("mongoose");

const seriesDepartureSchema = new mongoose.Schema({
  pnr: {
    type : String
  },
  account_code: {
    type : String
  },
  flight_type: {
    type : String
  },
  cabin_class: {
    type : String
  },
  trip_type: {
    type : String
  },
  fare_name: {
    type : String
  },
  aircraft_type: {
    type : String
  },
  airline_code: {
    type : String
  },
  flight_number: {
    type : Number
  },
  origin_airport_code: {
    type : String
  },
  origin_airport_terminal: {
    type : String
  },
  destination_airport_code: {
    type : String
  },
  destination_airport_terminal: {
    type : String
  },
  departure_date: {
    type : String
  },
  departure_time: {
    type : String
  },
  arrival_date: {
    type : String
  },
  arrival_time: {
    type : String
  },
  distance: {
    type : Number
  },
  travel_time: {
    type : String
  },
  stops: {
    type : Number
  },
  total_seats: {
    type : Number
  },
  available_seats: {
    type : Number
  },
  rbd: {
    type : String
  },
  baseamount: {
    type : Number
  },
  fuelsurchg: {
    type : Number
  },
  taxamount: {
    type : Number
  },
  baseamountchd: {
    type : Number
  },
  fuelsurchgchd: {
    type : Number
  },
  taxamountchd: {
    type : Number
  },
  baseamountinf: {
    type : Number
  },
  fuelsurchginf: {
    type : Number
  },
  taxamountinf: {
    type : Number
  },
  carryonallowance: {
    type : String
  },
  baggageallowance: {
    type : String
  },
  isrefundable: {
    type : Number
  },
  cancelpenalty: {
    type : String
  },
  changepenalty: {
    type : String
  },
  isactive: {
    type : Number
  },
  baseamountcost: {
    type : Number
  },
  fuelsurchgcost: {
    type : Number
  },
  taxamountcost: {
    type : Number
  },
  baseamountchdcost: {
    type : Number
  },
  fuelsurchgchdcost: {
    type : Number
  },
  taxamountchdcost: {
    type : Number
  },
  baseamountinfcost: {
    type : Number
  },
  fuelsurchginfcost: {
    type : Number
  },
  taxamountinfcost: {
    type : Number
  },
  flights: [
      {
          airline_code: {
            type : String
          },
          boundtype: {
            type : Number
          },
          flightnumber: {
            type : Number
          },
          origin: {
            type : String
         },
          oterm: {
            type : String
          },
          destination: {
            type : String
          },
          dterm: {
            type : String
          },
          departuredate: {
            type : String
          },
          departuretime: {
            type : String
          },
          arrivaldate: {
            type : String
          },
          arrivaltime: {
            type : String
          },
          flyingtime: {
            type : String
          },
          distance: {
            type : Number
          },
          baggage: {
              name: String,
              charge: {
                type : Number
              }
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
  },
  seriesId: {
    type: String,
    unique: true,
  },
});
seriesDepartureSchema.pre('save', async function (next) {
  try {
    if (!this.seriesId) {
      const SeriesDeparture = mongoose.model('seriesDeparture');
      const count = await SeriesDeparture.countDocuments({});
      this.seriesId = `SE${count + 1}`.padStart(7, '0');
    }
    next();
  } catch (error) {
    next(error);
  }
});
const seriesDeparture = mongoose.model("seriesDeparture", seriesDepartureSchema);
module.exports = seriesDeparture;
const flightSerchLogModel = require('../../models/FlightSearchLog');

const addFlightSerch = async (req,res) => {
   let { 
    companyId,
    userId, 
    origin,
    destination,
    travelType,
    classOfService,
    paxDetail,
    Airlines,
    departureDate, 
    typeOftrip
} = req.body;

}
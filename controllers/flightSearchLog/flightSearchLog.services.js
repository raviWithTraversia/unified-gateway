const flightSerchLogModel = require('../../models/FlightSearchLog');

const addFlightSerchReport = async (req,res) => {
  try{ 
    let { 
    companyId,
    userId, 
    origin,
    destination,
    classOfService,
    paxDetail,
    airlines,
    departureDate, 
    travelType,
    traceId
} = req.body;


let newFlightSearchLog = new flightSerchLogModel({
    companyId,
    userId, 
    origin,
    destination,
    travelType,
    classOfService,
    paxDetail,
    departureDate, 
    airlineCode : airlines,
    traceId
});
newFlightSearchLog = await newFlightSearchLog.save();
console.log("Data Inserted")
  return;

}catch(error){
  console.log(error);
  throw error
}
};
const getFlightSerchReport = async (req,res) => {
    try{
    let { userId , companyId, toDate , fromDate} = req.query;
    let searchResult = await  flightSerchLogModel.find({
      userId: userId,
      createdAt: { $gte: toDate, $lte: fromDate }
    });
    if(searchResult.length > 0){
         return {
            response : 'Data Found Sucessfully',
            data : searchResult
         }
    } else{
      return {
        response : 'Flight Search Data Not Available'
      }
    }
     
    }catch(error){
        console.log(error);
        throw error
    }
};


// let data = {
//     "companyId": "658173c8fc3c021e15a5f7e0", 
//     "userId": "658173c8fc3c021e15a5f7e4", 
//     "credentialType": "API",
//     "salesChannel": "Online",
//     "origin": "New York",
//     "destination": "Los Angeles",
//     "travelType": "Round Trip",
//     "classOfService": "Business",
//     "paxDetail": {
//       "adults": 2,
//       "children": 1,
//       "infants": 0
//     },
//     "Airlines": ["Z7", "KI", "JP"],
//     "departureDate": "2023-03-15T08:00:00.000Z"
//   }
//   let res = await addFlightSerchReport(data);
//   console.log(res);
module.exports = {
    addFlightSerchReport,
    getFlightSerchReport
}
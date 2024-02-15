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
    airlines,
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
      let { userId, toDate, fromDate } = req.body;
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
  
      if (isNaN(fromDateObj.valueOf()) || isNaN(toDateObj.valueOf())) {
        return res.status(400).json({
          response: 'Bad Request',
          error: 'Invalid date format. Please provide valid date strings.'
        });
      }
      let searchResult = await flightSerchLogModel.find({
        userId: userId,
        createdAt: { $gte: fromDateObj, $lte: toDateObj }
      }).populate('userId');
  
    //console.log(searchResult)
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
module.exports = {
    addFlightSerchReport,
    getFlightSerchReport
}
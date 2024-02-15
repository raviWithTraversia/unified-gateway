const flightSerchLogModel = require('../../models/FlightSearchLog');
const addFlightSerchReport = async (req,res) => {
  try{ 
   // console.log("====>>>",req.body, "<<<<=========");
    let data = {...req.body};
  
let newFlightSearchLog = new flightSerchLogModel({
    companyId : data?.Authentication?.CompanyId || null,
    userId : data?.Authentication?.UserId || null, 
    origin : data.Segments[0].OriginName,
    destination : data.Segments[0].DestinationName,
    travelType : data.TravelType,
    classOfService:data.Segments[0].ClassOfService,
    paxDetail : data?.paxDetail,
    departureDate: data.Segments[0].DepartureDate, 
    airlines : data.Airlines,
    traceId: data.Authentication.TraceId,
    fareFamily : data.FareFamily,
    typeOfTrip : data.TypeOfTrip
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
      let searchResult = await flightSerchLogModel.find({
        userId: userId,
        createdAt: { $gte: fromDateObj, $lte: toDateObj }
      }).populate('userId');
  
   // console.log(searchResult)
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
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
      const { userId, fromDate, toDate } = req.query;

    if (fromDate && toDate) {
      const isValidDate = (date) => {
        return !isNaN(new Date(date).getTime());
      };

      if (!isValidDate(fromDate) || !isValidDate(toDate)) {
        return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
      }
    }
    const query = {};
    if (userId) {
      query.userId = mongoose.Types.ObjectId(userId);
    }
    if (fromDate && toDate) {
      query.createdDate = {
        $gte: new Date(fromDate), 
        $lte: new Date(toDate)
      };
    }

    const reports = await flightSerchLogModel.find(query);
    console.log(reports.length)

    if (!reports.length) {
      return {
        response : 'Flight Search Data Not Available'
      }
    }

  return {
    response : 'Data Found Sucessfully',
    data : reports
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
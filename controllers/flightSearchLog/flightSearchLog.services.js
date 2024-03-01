const flightSerchLogModel = require("../../models/FlightSearchLog");
const { ObjectId } = require("mongoose").Types;
const addFlightSerchReport = async (req, res) => {
  try {
    let data = { ...req.body };
    let newFlightSearchLog = new flightSerchLogModel({
      companyId: data?.Authentication?.CompanyId || null,
      userId: data?.Authentication?.UserId || null,
      origin: data.Segments[0].OriginName,
      destination: data.Segments[0].DestinationName,
      travelType: data.TravelType,
      classOfService: data.Segments[0].ClassOfService,
      paxDetail: data?.paxDetail,
      departureDate: data.Segments[0].DepartureDate,
      airlines: data.Airlines,
      traceId: data.Authentication.TraceId,
      fareFamily: data.FareFamily,
      typeOfTrip: data.TypeOfTrip,
    });
    newFlightSearchLog = await newFlightSearchLog.save();
    console.log("Data Inserted");
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getFlightSerchReport = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.body;
    const isValidDate = (date) => !isNaN(new Date(date).getTime());

    if (
      fromDate &&
      toDate &&
      (!isValidDate(fromDate) || !isValidDate(toDate))
    ) {
      return { response: "Invalid date format. Please use YYYY-MM-DD." };
    }

    let fromDateObj = new Date(fromDate);
    let toDateObj = new Date(toDate);

    if (fromDateObj > toDateObj) {
      return { response: "fromDate must be less than or equal to toDate" };
    }

    toDateObj.setHours(23, 59, 59, 999);

    const query = {};
    if (userId) {
      query.userId = new ObjectId(userId);
    }

    if (fromDate && toDate) {
      query.createdDate = { $gte: fromDateObj, $lte: toDateObj };
    }

    const reports = await flightSerchLogModel.find(query);
     console.log(reports.length)
    if (!reports.length) {
      return { response: "Flight Search Data Not Available" };
    }

    return { response: "Data Found Successfully", data: reports };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


module.exports = {
  addFlightSerchReport,
  getFlightSerchReport,
};

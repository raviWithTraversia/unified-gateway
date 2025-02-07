const Company = require("../../models/Company");
const User = require("../../models/User");
const bookingdetails = require("../../models/booking/BookingDetails");
const config = require("../../models/AgentConfig");
const passengerPreferenceSchema = require("../../models/booking/PassengerPreference");
const Email = require("../commonFunctions/common.function");
const SmtpConfig = require("../../models/Smtp");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const { Config } = require("../../configs/config");
const InovoiceData = require("../../models/booking/InvoicingData");
const ledger=require('../../models/Ledger')
const transaction=require('../../models/TrainStation')
const passengerPreferenceModel=require('../../models/booking/PassengerPreference')
const {
  calculateOfferedPricePaxWise,
  getTicketNumberBySector,
  priceRoundOffNumberValues,
  getTdsAndDsicount,
  calculateOfferedPrice
} = require("../commonFunctions/common.function");
const agentConfig=require('../../models/AgentConfig')
const { apiErrorres } = require("../../utils/commonResponce");
const BookingDetails = require("../../models/booking/BookingDetails");
const { response } = require("../../routes/flight/flightRoute");

const ISOTime = async (time) => {
  const utcDate = new Date(time);
  const istDate = new Date(utcDate.getTime() - 5.5 * 60 * 60 * 1000);
  return istDate.toISOString();
};

const ISTTime = async (time) => {
  const utcDate = new Date(time);
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
  return istDate.toISOString();
};

const getAllBooking = async (req, res) => {
  const {
    userId,
    agencyId,
    bookingId,
    pnr,
    ticketNumber,
    paxName,
    status,
    fromDate,
    toDate,
    salesInchargeIds,
    ArilineFilter,
    BookedBy,
    cancelationPending
  } = req.body;
  const fieldNames = [
    "agencyId",
    "bookingId",
    "pnr",
    "status",
    "fromDate",
    "toDate",
    "salesInchargeIds",
  ];
  const missingFields = fieldNames.filter(
    (fieldName) =>
      req.body[fieldName] === null || req.body[fieldName] === undefined
  );

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");

    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }
  console.log({ fromDate, toDate });
  // if (!userId) {
  //   return {
  //     response: "User id does not exist",
  //   };
  // }

  // Check if company Id exists
  const checkUserIdExist = await User.findById(userId)
    .populate("roleId")
    .populate("company_ID");
  console.log({ checkUserIdExist });
  //   console.log(JSON.stringify(checkUserIdExist));
  // if (!checkUserIdExist) {
  //   return {
  //     response: "User id does not exist",
  //   };
  // }

  // const userRole = checkUserIdExist.roleID;
  // console.log(JSON.stringify(userRole));
  // let filter = {};

  // if (userRole && userRole.salesInchargeIds) {
  //   const inchargeRole = await Role.findOne({ _id: userRole._id });

  //   if (!inchargeRole || !inchargeRole.companyIds) {
  //     return res.status(404).json({
  //       response: "Incharge role does not have associated company IDs",
  //     });
  //   }

  //   const companyIds = inchargeRole.companyIds;
  //   filter.companyId = { $in: companyIds };
  // } else {
  //   // If not sales in-charge, only filter by the provided fields
  //   filter = {};
  // }

  if (
    (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") ||
    (checkUserIdExist.roleId && checkUserIdExist.roleId.type == "Manual")
  ) {
    const filter = {};

    // Filter by AgencyId

    if (
      agencyId == "6555f84c991eaa63cb171a9f" &&
      checkUserIdExist.roleId &&
      checkUserIdExist.roleId.type == "Manual"
    ) {
      filter.companyId = new ObjectId(agencyId);
    } else if (agencyId !== undefined && agencyId !== "") {
      console.log("djie");
      filter.AgencyId = new ObjectId(agencyId);
    } else {
      console.log("jdi");
      checkUserIdExist.roleId.type == "Manual" &&
      checkUserIdExist.company_ID?.type == "TMC"
        ? (filter.companyId = checkUserIdExist.company_ID._id)
        : (filter.AgencyId = new ObjectId(checkUserIdExist?.company_ID?._id));
    }

    // Filter by bookingId
    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }

    // Filter by PNR
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }

    // Filter by bookingStatus
    if (status !== undefined && status.trim() !== "") {
      filter.bookingStatus = status;
    }

    let orConditions = []
    if(ArilineFilter !== undefined && ArilineFilter !== ""){
      orConditions.push({ "itinerary.Sectors.AirlineCode": new RegExp(`^${ArilineFilter}`, 'i') },{"itinerary.Sectors.AirlineName":new RegExp(`^${ArilineFilter}`, 'i')})
      filter.$or=orConditions
    }
    // Filter by date range
    // if (
    //   fromDate !== undefined &&
    //   fromDate.trim() !== "" &&
    //   toDate !== undefined &&
    //   toDate.trim() !== ""
    // ) {
    //   filter.bookingDateTime = {
    //     $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
    //     $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
    //   };
    // } else if (fromDate !== undefined && fromDate.trim() !== "") {
    //   filter.bookingDateTime = {
    //     $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
    //   };
    // } else if (toDate !== undefined && toDate.trim() !== "") {
    //   filter.bookingDateTime = {
    //     $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
    //   };
    // }

    if (fromDate || toDate) { 
      filter.createdAt = {};
      if (fromDate) {
        if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid fromDate format, must be YYYY-MM-DD",
            400,
            true
          );

        let startDate = moment(fromDate)
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toDate();
        filter.createdAt["$gte"] = startDate;
      }
      if (toDate) {
        if (!moment(toDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid toDate format, must be YYYY-MM-DD",
            400,
            true
          );
        let endDate = moment(toDate)
          .set("hour", 23)
          .set("minute", 59)
          .second(59)
          .toDate();
        filter.createdAt["$lte"] = endDate;
      }
    }
    if (fromDate && toDate) {
      if (moment(toDate).isBefore(fromDate)) {
        return apiErrorres(
          res,
          "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
          400,
          true
        );
      }
    }
    // Use the filter in the aggregation pipeline
    if(cancelationPending&&filter.bookingStatus=="CANCELLATION PENDING"){
      filter.updatedAt= filter.createdAt
      delete filter.createdAt; // Removes the 'age' key from obj

      
          }

    const bookingDetails = await bookingdetails.aggregate([
      { $match: filter }, // Apply the filter here

      // Lookup for userId and its company
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $lookup: {
                from: "companies",
                localField: "company_ID",
                foreignField: "_id",
                as: "company_ID",
              },
            },
            {
              $unwind: {
                path: "$company_ID",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

      // Lookup for BookedBy field
      {
        $lookup: {
          from: "users",
          localField: "BookedBy",
          foreignField: "_id",
          as: "BookedBy",
        },
      },
      { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },

      // Lookup for invoicingdatas
      {
        $lookup: {
          from: "invoicingdatas",
          localField: "_id",
          foreignField: "bookingId",
          as: "invoicingdatas",
        },
      },
      {
        $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true },
      },

      {
        $addFields: {
          companyIdForLookup: "$userId.company_ID._id",
        },
      },

      {
        $lookup: {
          from: "agentconfigurations",
          localField: "companyIdForLookup",
          foreignField: "companyId",
          as: "agentconfigurationData",
        },
      },
      {
        $unwind: {
          path: "$agentconfigurationData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          salesId: "$agentconfigurationData.salesInchargeIds",
        },
      },

      {
        $group: {
          _id: "$_id",
          bookingDetails: { $first: "$$ROOT" },
          userId: { $first: "$userId" },
          BookedBy: { $first: "$BookedBy" },
          invoicingdatas: { $first: "$invoicingdatas" },
          agentData: { $first: "$agentconfigurationData.salesInchargeIds" },
        },
      },

      {
        $replaceRoot: { newRoot: "$bookingDetails" },
      },
    ]);

    // Further processing...

    console.log("1st");
    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      const statusCounts = {
        PENDING: 0,
        CONFIRMED: 0,
        FAILED: 0,
        CANCELLED: 0,
        INCOMPLETE: 0,
        HOLD: 0,
        HOLDRELEASED: 0,
        "FAILED PAYMENT": 0,
      };

      // Iterate over the bookingDetails array
      var bookingIds = [];

      // Iterate over the bookingDetails array
      bookingDetails.forEach((booking) => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(
        bookingDetails.map(async (booking) => {
          let filter2 = { bookingId: booking.bookingId };
          if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
            filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
          }
          const passengerPreference = await passengerPreferenceSchema.find(
            filter2
          );
          const configDetails = await config.findOne({
            userId: booking.userId,
          });
          if (passengerPreference.length) {
            allBookingData.push({
              bookingDetails: booking,
              passengerPreference: passengerPreference,
            });
          }
        })
      );

      let filteredBookingData = allBookingData; // Copy the original data

      return {
        response: "Fetch Data Successfully",
        data: {
          bookingList: filteredBookingData.sort(
            (a, b) =>
              new Date(
                b.bookingDetails.bookingDateTime -
                  new Date(a.bookingDetails.bookingDateTime)
              )
          ),
          statusCounts: statusCounts,
        },
      };
    }
  } else if (
    checkUserIdExist.roleId &&
    checkUserIdExist.roleId.name === "Distributer"
  ) {
    let filter = {};

    console.log("dhieieei")
    if (agencyId !== undefined && agencyId == "") {
      // filter.userId={}

      if (checkUserIdExist?.roleId?.type === "Default") {
        // Fetch all companies that have the current user's company ID as the parent
        const companiesData = await Company.find({
          parent: checkUserIdExist.company_ID._id,
        });

        // console.log(companiesData,"companiesData")
        // Extract and map company IDs into an array of ObjectIds
        const companyIds = companiesData.map(
          (element) => new ObjectId(element._id)
        );

        // Assign the array of ObjectIds to filter.AgencyId
        filter.AgencyId = { $in: companyIds };
      } else {
        // Assign the specific agencyId as a single ObjectId
        filter.AgencyId = new ObjectId(agencyId);
      } // let allagencyId = agencyId.map(id => new ObjectId(id));
      // filter.AgencyId={$in:allagencyId}

      // console.log(filter.AgencyId)
    }

    let orConditions = []
    if(ArilineFilter !== undefined && ArilineFilter !== ""){
      orConditions.push({ "itinerary.Sectors.AirlineCode": new RegExp(`^${ArilineFilter}`, 'i') },{"itinerary.Sectors.AirlineName":new RegExp(`^${ArilineFilter}`, 'i')})
      filter.$or=orConditions
    }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.bookingStatus = status;
    }
    // if (
    //   fromDate !== undefined &&
    //   fromDate.trim() !== "" &&
    //   toDate !== undefined &&
    //   toDate.trim() !== ""
    // ) {
    //   filter.bookingDateTime = {
    //     $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
    //     $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
    //   };
    // } else if (fromDate !== undefined && fromDate.trim() !== "") {
    //   filter.bookingDateTime = {
    //     $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
    //   };
    // } else if (toDate !== undefined && toDate.trim() !== "") {
    //   filter.bookingDateTime = {
    //     $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
    //   };
    // }
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid fromDate format, must be YYYY-MM-DD",
            400,
            true
          );

        let startDate = moment(fromDate)
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toDate();
        filter.createdAt["$gte"] = startDate;
      }
      if (toDate) {
        if (!moment(toDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid toDate format, must be YYYY-MM-DD",
            400,
            true
          );
        let endDate = moment(toDate)
          .set("hour", 23)
          .set("minute", 59)
          .second(59)
          .toDate();
        filter.createdAt["$lte"] = endDate;
      }
    }
    if (fromDate && toDate) {
      if (moment(toDate).isBefore(fromDate)) {
        return apiErrorres(
          res,
          "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
          400,
          true
        );
      }
    }
    if(cancelationPending&&filter.bookingStatus=="CANCELLATION PENDING"){
filter.updatedAt= filter.createdAt;
delete filter.createdAt; // Removes the 'age' key from obj


    }

    const bookingDetails = await bookingdetails.aggregate([
      { $match: filter },

      // Lookup for userId and its company
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $lookup: {
                from: "companies",
                localField: "company_ID",
                foreignField: "_id",
                as: "company_ID",
              },
            },
            {
              $unwind: {
                path: "$company_ID",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

      // Lookup for BookedBy field
      {
        $lookup: {
          from: "users",
          localField: "BookedBy",
          foreignField: "_id",
          as: "BookedBy",
        },
      },
      { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },

      // Lookup for invoicingdatas
      {
        $lookup: {
          from: "invoicingdatas",
          localField: "_id",
          foreignField: "bookingId",
          as: "invoicingdatas",
        },
      },
      {
        $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true },
      },

      {
        $addFields: {
          companyIdForLookup: "$userId.company_ID._id",
        },
      },

      {
        $lookup: {
          from: "agentconfigurations",
          localField: "companyIdForLookup",
          foreignField: "companyId",
          as: "agentconfigurationData",
        },
      },
      {
        $unwind: {
          path: "$agentconfigurationData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          salesId: "$agentconfigurationData.salesInchargeIds",
        },
      },

      {
        $group: {
          _id: "$_id",
          bookingDetails: { $first: "$$ROOT" },
          userId: { $first: "$userId" },
          BookedBy: { $first: "$BookedBy" },
          invoicingdatas: { $first: "$invoicingdatas" },
          agentData: { $first: "$agentconfigurationData.salesInchargeIds" },
        },
      },

      {
        $replaceRoot: { newRoot: "$bookingDetails" },
      },
    ]);

    console.log("2nd");

    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      const statusCounts = {
        PENDING: 0,
        CONFIRMED: 0,
        FAILED: 0,
        CANCELLED: 0,
        INCOMPLETE: 0,
        HOLD: 0,
        HOLDRELEASED: 0,
        "FAILED PAYMENT": 0,
      };

      // Iterate over the bookingDetails array

      // Iterate over the bookingDetails array
      bookingDetails.forEach((booking) => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];
      await Promise.all(
        bookingDetails.map(async (booking) => {
          let filter2 = { bookingId: booking.bookingId };
          if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
            filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
          }
          const passengerPreference = await passengerPreferenceSchema.find(
            filter2
          );
          const configDetails = await config.findOne({
            userId: booking.userId,
          });
          if (passengerPreference.length) {
            allBookingData.push({
              bookingDetails: booking,
              passengerPreference: passengerPreference,
            });
          }
        })
      );
      let filteredBookingData = allBookingData; // Copy the original data

      return {
        response: "Fetch Data Successfully",
        data: {
          bookingList: filteredBookingData.sort(
            (a, b) =>
              new Date(b.bookingDetails.bookingDateTime) -
              new Date(a.bookingDetails.bookingDateTime)
          ),
          statusCounts: statusCounts,
        },
      };
    }
    //|| checkUserIdExist?.company_ID?.type === "TMC"
  } else if (
    (checkUserIdExist.roleId &&
      checkUserIdExist.roleId.name === "TMC" &&
      checkUserIdExist?.roleId?.type == "Default") ||
    (checkUserIdExist?.roleId?.type == "Manual" &&
      checkUserIdExist?.company_ID == new ObjectId("6555f84c991eaa63cb171a9f"))
  ) {
    let filter = {};
    if (
      agencyId !== undefined &&
      agencyId !== "" &&
      agencyId != new ObjectId("6555f84c991eaa63cb171a9f")
    ) {
      // filter.userId={}
      checkUserIdExist?.roleId?.type == "Manual"
        ? (filter.companyId = new ObjectId(agencyId))
        : (filter.AgencyId = new ObjectId(agencyId));
      // let allagencyId = agencyId.map(id => new ObjectId(id));
      // filter.AgencyId={$in:allagencyId}

      // console.log(filter.AgencyId)
    } else if (agencyId !== undefined && agencyId !== "") {
      filter.companyId = new ObjectId(agencyId);
    }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    let orConditions = []
    if(ArilineFilter !== undefined && ArilineFilter !== ""){
      orConditions.push({ "itinerary.Sectors.AirlineCode": new RegExp(`^${ArilineFilter}`, 'i') },{"itinerary.Sectors.AirlineName":new RegExp(`^${ArilineFilter}`, 'i')})
      filter.$or=orConditions
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.bookingStatus = status;
    }
    // if (
    //   fromDate !== undefined &&
    //   fromDate.trim() !== "" &&
    //   toDate !== undefined &&
    //   toDate.trim() !== ""
    // ) {
    //   filter.bookingDateTime = {
    //     $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
    //     $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
    //   };
    // } else if (fromDate !== undefined && fromDate.trim() !== "") {
    //   filter.bookingDateTime = {
    //     $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
    //   };
    // } else if (toDate !== undefined && toDate.trim() !== "") {
    //   filter.bookingDateTime = {
    //     $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
    //   };
    // }
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid fromDate format, must be YYYY-MM-DD",
            400,
            true
          );

        let startDate = moment(fromDate)
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toDate();
        filter.createdAt["$gte"] = startDate;
      }
      if (toDate) {
        if (!moment(toDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid toDate format, must be YYYY-MM-DD",
            400,
            true
          );
        let endDate = moment(toDate)
          .set("hour", 23)
          .set("minute", 59)
          .second(59)
          .toDate();
        filter.createdAt["$lte"] = endDate;
      }
    }
    if (fromDate && toDate) {
      if (moment(toDate).isBefore(fromDate)) {
        return apiErrorres(
          res,
          "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
          400,
          true
        );
      }
    }
    if(cancelationPending&&filter.bookingStatus=="CANCELLATION PENDING"){
      filter.updatedAt= filter.createdAt;
      delete filter.createdAt; // Removes the 'age' key from obj

      
          }
    console.log(filter, "j;die");
    const bookingDetails = await bookingdetails.aggregate([
      { $match: filter },

      // Lookup for userId and its company
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $lookup: {
                from: "companies",
                localField: "company_ID",
                foreignField: "_id",
                as: "company_ID",
              },
            },
            {
              $unwind: {
                path: "$company_ID",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

      // Lookup for BookedBy field
      {
        $lookup: {
          from: "users",
          localField: "BookedBy",
          foreignField: "_id",
          as: "BookedBy",
        },
      },
      { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },

      // Lookup for invoicingdatas
      {
        $lookup: {
          from: "invoicingdatas",
          localField: "_id",
          foreignField: "bookingId",
          as: "invoicingdatas",
        },
      },
      {
        $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true },
      },

      {
        $addFields: {
          companyIdForLookup: "$userId.company_ID._id",
        },
      },

      {
        $lookup: {
          from: "agentconfigurations",
          localField: "companyIdForLookup",
          foreignField: "companyId",
          as: "agentconfigurationData",
        },
      },
      {
        $unwind: {
          path: "$agentconfigurationData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          salesId: "$agentconfigurationData.salesInchargeIds",
        },
      },

      {
        $group: {
          _id: "$_id",
          bookingDetails: { $first: "$$ROOT" },
          userId: { $first: "$userId" },
          BookedBy: { $first: "$BookedBy" },
          invoicingdatas: { $first: "$invoicingdatas" },
        },
      },

      {
        $replaceRoot: { newRoot: "$bookingDetails" },
      },
    ]);

    // .find(filter)
    // .populate({
    //   path: "userId",
    //   populate: {
    //     path: "company_ID",
    //   },
    // })
    // .populate("BookedBy");
    console.log("3rd");
    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      const statusCounts = {
        PENDING: 0,
        CONFIRMED: 0,
        FAILED: 0,
        CANCELLED: 0,
        INCOMPLETE: 0,
        HOLD: 0,
        HOLDRELEASED: 0,
        "FAILED PAYMENT": 0,
      };
      var bookingIds = [];

      // Iterate over the bookingDetails array
      bookingDetails.forEach((booking) => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(
        bookingDetails.map(async (booking) => {
          let filter2 = { bookingId: booking.bookingId };

          if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
            filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
          }

          const passengerPreference = await passengerPreferenceSchema.find(
            filter2
          );
          const configDetails = await config.findOne({
            userId: booking.userId,
          });

          if (passengerPreference.length) {
            allBookingData.push({
              bookingDetails: booking,
              passengerPreference: passengerPreference,
            });
          }
        })
      );

      // console.log(allBookingData[0].bookingDetails,"djfie")

      let filteredBookingData = allBookingData; // Copy the original data

      return {
        response: "Fetch Data Successfully",
        data: {
          bookingList: filteredBookingData.sort(
            (a, b) =>
              new Date(b.bookingDetails.bookingDateTime) -
              new Date(a.bookingDetails.bookingDateTime)
          ),
          statusCounts: statusCounts,
        },
      };
    }
  } else {
    const userCompanyId = checkUserIdExist.company_ID;
    const checkComapnyUser = await User.findOne({
      company_ID: userCompanyId,
    }).populate({
      path: "roleId",
      match: { type: "Default" },
    });
    if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Agency") {
      let filter = { userId: checkComapnyUser._id };
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }

      let orConditions = []
    if(ArilineFilter !== undefined && ArilineFilter !== ""){
      orConditions.push({ "itinerary.Sectors.AirlineCode": new RegExp(`^${ArilineFilter}`, 'i') },{"itinerary.Sectors.AirlineName":new RegExp(`^${ArilineFilter}`, 'i')})
      filter.$or=orConditions
    }
      // if (
      //   fromDate !== undefined &&
      //   fromDate.trim() !== "" &&
      //   toDate !== undefined &&
      //   toDate.trim() !== ""
      // ) {
      //   filter.bookingDateTime = {
      //     $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
      //     $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
      //   };
      // } else if (fromDate !== undefined && fromDate.trim() !== "") {
      //   filter.bookingDateTime = {
      //     $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
      //   };
      // } else if (toDate !== undefined && toDate.trim() !== "") {
      //   filter.bookingDateTime = {
      //     $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
      //   };
      // }
      if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) {
          if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
            return apiErrorres(
              res,
              "invalid fromDate format, must be YYYY-MM-DD",
              400,
              true
            );

          let startDate = moment(fromDate)
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .toDate();
          filter.createdAt["$gte"] = startDate;
        }
        if (toDate) {
          if (!moment(toDate, "YYYY-MM-DD", true).isValid())
            return apiErrorres(
              res,
              "invalid toDate format, must be YYYY-MM-DD",
              400,
              true
            );
          let endDate = moment(toDate)
            .set("hour", 23)
            .set("minute", 59)
            .second(59)
            .toDate();
          filter.createdAt["$lte"] = endDate;
        }
      }
      if (fromDate && toDate) {
        if (moment(toDate).isBefore(fromDate)) {
          return apiErrorres(
            res,
            "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
            400,
            true
          );
        }
      }

      const bookingDetails = await bookingdetails
        .find(filter)
        .populate({
          path: "userId",
          populate: {
            path: "company_ID",
          },
        })
        .populate("BookedBy");

      if (!bookingDetails || bookingDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        const statusCounts = {
          PENDING: 0,
          CONFIRMED: 0,
          FAILED: 0,
          CANCELLED: 0,
          INCOMPLETE: 0,
          HOLD: 0,
          HOLDRELEASED: 0,
          "FAILED PAYMENT": 0,
        };

        // Iterate over the bookingDetails array
        bookingDetails.forEach((booking) => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(
          bookingDetails.map(async (booking) => {
            let filter2 = { bookingId: booking.bookingId };
            if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
              filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
            }
            const passengerPreference = await passengerPreferenceSchema.find(
              filter2
            );
            const configDetails = await config.findOne({
              userId: booking.userId,
            });
            if (passengerPreference.length) {
              allBookingData.push({
                bookingDetails: booking,
                passengerPreference: passengerPreference,
                salesInchargeIds: configDetails?.salesInchargeIds,
              });
            }
          })
        );

        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(
            (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
          );
        }
        return {
          response: "Fetch Data Successfully",
          data: {
            bookingList: filteredBookingData.sort(
              (a, b) =>
                new Date(
                  b.bookingDetails.bookingDateTime -
                    new Date(a.bookingDetails.bookingDateTime)
                )
            ),
            statusCounts: statusCounts,
          },
        };
      }
    } else if (
      checkComapnyUser.roleId &&
      checkComapnyUser.roleId.name === "Distributer"
    ) {
      let filter = { companyId: checkComapnyUser.company_ID._id };
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      // if (
      //   fromDate !== undefined &&
      //   fromDate.trim() !== "" &&
      //   toDate !== undefined &&
      //   toDate.trim() !== ""
      // ) {
      //   filter.bookingDateTime = {
      //     $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
      //     $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
      //   };
      // } else if (fromDate !== undefined && fromDate.trim() !== "") {
      //   filter.bookingDateTime = {
      //     $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
      //   };
      // } else if (toDate !== undefined && toDate.trim() !== "") {
      //   filter.bookingDateTime = {
      //     $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
      //   };
      // }
      if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) {
          if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
            return apiErrorres(
              res,
              "invalid fromDate format, must be YYYY-MM-DD",
              400,
              true
            );

          let startDate = moment(fromDate)
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .toDate();
          filter.createdAt["$gte"] = startDate;
        }
        if (toDate) {
          if (!moment(toDate, "YYYY-MM-DD", true).isValid())
            return apiErrorres(
              res,
              "invalid toDate format, must be YYYY-MM-DD",
              400,
              true
            );
          let endDate = moment(toDate)
            .set("hour", 23)
            .set("minute", 59)
            .second(59)
            .toDate();
          filter.createdAt["$lte"] = endDate;
        }
      }
      if (fromDate && toDate) {
        if (moment(toDate).isBefore(fromDate)) {
          return apiErrorres(
            res,
            "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
            400,
            true
          );
        }
      }

      const bookingDetails = await bookingdetails
        .find(filter)
        .populate({
          path: "userId",
          populate: {
            path: "company_ID",
          },
        })
        .populate("BookedBy");

      if (!bookingDetails || bookingDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        const statusCounts = {
          PENDING: 0,
          CONFIRMED: 0,
          FAILED: 0,
          CANCELLED: 0,
          INCOMPLETE: 0,
          HOLD: 0,
          HOLDRELEASED: 0,
          "FAILED PAYMENT": 0,
        };

        // Iterate over the bookingDetails array
        bookingDetails.forEach((booking) => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(
          bookingDetails.map(async (booking) => {
            let filter2 = { bookingId: booking.bookingId };
            if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
              filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
            }
            const passengerPreference = await passengerPreferenceSchema.find(
              filter2
            );
            const configDetails = await config.findOne({
              userId: booking.userId,
            });
            if (passengerPreference.length) {
              allBookingData.push({
                bookingDetails: booking,
                passengerPreference: passengerPreference,
                salesInchargeIds: configDetails?.salesInchargeIds,
              });
            }
          })
        );
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(
            (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
          );
        }
        return {
          response: "Fetch Data Successfully",
          data: {
            bookingList: filteredBookingData.sort(
              (a, b) =>
                new Date(b.bookingDetails.bookingDateTime) -
                new Date(a.bookingDetails.bookingDateTime)
            ),
            statusCounts: statusCounts,
          },
        };
      }
    } else if (
      (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC") ||
      checkComapnyUser?.company_ID?.type === "TMC"
    ) {
      let filter = {};
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      // if (
      //   fromDate !== undefined &&
      //   fromDate.trim() !== "" &&
      //   toDate !== undefined &&
      //   toDate.trim() !== ""
      // ) {
      //   filter.bookingDateTime = {
      //     $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
      //     $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
      //   };
      // } else if (fromDate !== undefined && fromDate.trim() !== "") {
      //   filter.bookingDateTime = {
      //     $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
      //   };
      // } else if (toDate !== undefined && toDate.trim() !== "") {
      //   filter.bookingDateTime = {
      //     $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
      //   };
      // }
      if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) {
          if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
            return apiErrorres(
              res,
              "invalid fromDate format, must be YYYY-MM-DD",
              400,
              true
            );

          let startDate = moment(fromDate)
            .set("hour", 0)
            .set("minute", 0)
            .set("second", 0)
            .toDate();
          filter.createdAt["$gte"] = startDate;
        }
        if (toDate) {
          if (!moment(toDate, "YYYY-MM-DD", true).isValid())
            return apiErrorres(
              res,
              "invalid toDate format, must be YYYY-MM-DD",
              400,
              true
            );
          let endDate = moment(toDate)
            .set("hour", 23)
            .set("minute", 59)
            .second(59)
            .toDate();
          filter.createdAt["$lte"] = endDate;
        }
      }
      if (fromDate && toDate) {
        if (moment(toDate).isBefore(fromDate)) {
          return apiErrorres(
            res,
            "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
            400,
            true
          );
        }
      }

      const bookingDetails = await bookingdetails
        .find(filter)
        .populate({
          path: "userId",
          populate: {
            path: "company_ID",
          },
        })
        .populate("BookedBy");

      if (!bookingDetails || bookingDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        const statusCounts = {
          PENDING: 0,
          CONFIRMED: 0,
          FAILED: 0,
          CANCELLED: 0,
          INCOMPLETE: 0,
          HOLD: 0,
          HOLDRELEASED: 0,
          "FAILED PAYMENT": 0,
        };

        // Iterate over the bookingDetails array
        bookingDetails.forEach((booking) => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(
          bookingDetails.map(async (booking) => {
            let filter2 = { bookingId: booking.bookingId };
            if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
              filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
            }
            const passengerPreference = await passengerPreferenceSchema.find(
              filter2
            );
            const configDetails = await config.findOne({
              userId: booking.userId,
            });
            if (passengerPreference.length) {
              allBookingData.push({
                bookingDetails: booking,
                passengerPreference: passengerPreference,
                salesInchargeIds: configDetails?.salesInchargeIds,
              });
            }
          })
        );
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(
            (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
          );
        }

        return {
          response: "Fetch Data Successfully",
          data: {
            bookingList: filteredBookingData.sort(
              (a, b) =>
                new Date(b.bookingDetails.bookingDateTime) -
                new Date(a.bookingDetails.bookingDateTime)
            ),
            statusCounts: statusCounts,
          },
        };
      }
    }
  }
};

const getPendingBooking = async (req, res) => {
  const { userId, agencyId, bookingId, pnr, status, fromDate, toDate } =
    req.body;
  const fieldNames = [
    "userId",
    "agencyId",
    "bookingId",
    "pnr",
    "status",
    "fromDate",
    "toDate",
  ];
  const missingFields = fieldNames.filter(
    (fieldName) =>
      req.body[fieldName] === null || req.body[fieldName] === undefined
  );

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");

    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }
  if (!userId) {
    return {
      response: "User id does not exist",
    };
  }

  // Check if company Id exists
  const checkUserIdExist = await User.findById(userId)
    .populate("roleId")
    .populate("company_ID");
  if (!checkUserIdExist) {
    return {
      response: "User id does not exist",
    };
  }

  if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") {
    let filter = { userId: new ObjectId(userId) };
    if (agencyId !== undefined && agencyId !== "") {
      filter.companyId = new ObjectId(agencyId);
    }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.calcelationStatus = status;
    }

    if (
      fromDate !== undefined &&
      fromDate.trim() !== "" &&
      toDate !== undefined &&
      toDate.trim() !== ""
    ) {
      filter.createdAt = {
        $gte: new Date(fromDate + "T00:00:00.000Z"),
        $lte: new Date(toDate + "T23:59:59.999Z"),
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.createdAt = {
        $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.createdAt = {
        $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
      };
    }

    let pipeline = [
      {
        $match: filter,
      },
      { $sort: { createdAt: -1 } },
    ];

    const PendingBookingDetails = await CancelationBooking.aggregate(pipeline);
    console.log("1st");
    if (!PendingBookingDetails || PendingBookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: PendingBookingDetails,
      };
    }
  } else if (
    checkUserIdExist.roleId &&
    checkUserIdExist.roleId.name === "Distributer"
  ) {
    let filter = { companyId: checkUserIdExist.company_ID._id };
    if (agencyId !== undefined && agencyId !== "") {
      filter.userId = {};
      filter.userId = { $in: agencyId };
    }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.calcelationStatus = status;
    }
    if (
      fromDate !== undefined &&
      fromDate.trim() !== "" &&
      toDate !== undefined &&
      toDate.trim() !== ""
    ) {
      filter.createdAt = {
        $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
        $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.createdAt = {
        $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.createdAt = {
        $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
      };
    }

    let pipeline = [
      {
        $match: filter,
      },
      { $sort: { createdAt: -1 } },
    ];

    const PendingBookingDetails = await CancelationBooking.aggregate(pipeline);

    console.log("2nd");

    if (!PendingBookingDetails || PendingBookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: PendingBookingDetails,
      };
    }
  } else if (
    (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "TMC") ||
    checkUserIdExist?.company_ID?.type === "TMC"
  ) {
    let filter = {};
    if (agencyId !== undefined && agencyId !== "") {
      filter.userId = {};
      filter.userId = { $in: agencyId };

    }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.calcelationStatus = status;
    }
    if (
      fromDate !== undefined &&
      fromDate.trim() !== "" &&
      toDate !== undefined &&
      toDate.trim() !== ""
    ) {
      filter.createdAt = {
        $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
        $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.createdAt = {
        $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.createdAt = {
        $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
      };
    }

    let pipeline = [
      {
        $match: filter,
      },
      { $sort: { createdAt: -1 } },
    ];

    const PendingBookingDetails = await CancelationBooking.aggregate(pipeline);
    console.log("3rd");
    if (!PendingBookingDetails || PendingBookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: PendingBookingDetails,
      };
    }
  } else {
    const userCompanyId = checkUserIdExist.company_ID;
    const checkComapnyUser = await User.findOne({
      company_ID: userCompanyId,
    }).populate({
      path: "roleId",
      match: { type: "Default" },
    });
    if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Agency") {
      let filter = { userId: checkComapnyUser._id };
      if (agencyId !== undefined && agencyId !== "") {
        filter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.calcelationStatus = status;
      }

      if (
        fromDate !== undefined &&
        fromDate.trim() !== "" &&
        toDate !== undefined &&
        toDate.trim() !== ""
      ) {
        filter.createdAt = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.createdAt = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.createdAt = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }

      let pipeline = [
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
      ];

      const PendingBookingDetails = await CancelationBooking.aggregate(
        pipeline
      );

      if (!PendingBookingDetails || PendingBookingDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        return {
          response: "Fetch Data Successfully",
          data: PendingBookingDetails,
        };
      }
    } else if (
      checkComapnyUser.roleId &&
      checkComapnyUser.roleId.name === "Distributer"
    ) {
      let filter = { companyId: checkComapnyUser.company_ID._id };
      if (agencyId !== undefined && agencyId !== "") {
        filter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.calcelationStatus = status;
      }
      if (
        fromDate !== undefined &&
        fromDate.trim() !== "" &&
        toDate !== undefined &&
        toDate.trim() !== ""
      ) {
        filter.createdAt = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.createdAt = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.createdAt = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }

      let pipeline = [
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
      ];

      const PendingBookingDetails = await CancelationBooking.aggregate(
        pipeline
      );

      if (!PendingBookingDetails || PendingBookingDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        return {
          response: "Fetch Data Successfully",
          data: PendingBookingDetails,
        };
      }
    } else if (
      (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC") ||
      checkComapnyUser?.company_ID?.type === "TMC"
    ) {
      let filter = {};
      if (agencyId !== undefined && agencyId !== "") {
        filter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.calcelationStatus = status;
      }
      if (
        fromDate !== undefined &&
        fromDate.trim() !== "" &&
        toDate !== undefined &&
        toDate.trim() !== ""
      ) {
        filter.createdAt = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.createdAt = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.createdAt = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }

      let pipeline = [
        {
          $match: filter,
        },
        { $sort: { createdAt: -1 } },
      ];

      const PendingBookingDetails = await CancelationBooking.aggregate(
        pipeline
      );

      if (!PendingBookingDetails || PendingBookingDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        return {
          response: "Fetch Data Successfully",
          data: PendingBookingDetails,
        };
      }
    }
  }
};

const getBookingByBookingId = async (req, res) => {
  const { bookingId } = req.body;
  const fieldNames = ["bookingId"];
  const missingFields = fieldNames.filter(
    (fieldName) =>
      req.body[fieldName] === null || req.body[fieldName] === undefined
  );

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");

    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }
  if (!bookingId) {
    return {
      response: "Booking id does not exist",
    };
  }

  // Check if company Id exists
  const checkbookingdetails = await bookingdetails.find({
    bookingId: bookingId,
  });
  if (!checkbookingdetails) {
    return {
      response: "Booking id does not exist",
    };
  }
  if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") {
    const bookingDetails = await bookingdetails.find({ userId: userId });
    //const passengerPreference = await passengerPreference.find({ bookingId: bookingDetails.bookingId });

    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: bookingDetails,
      };
    }
  }
};

const getBookingCalendarCount = async (req, res) => {
  const { userId, fromDate, toDate } = req.body;
  if (!userId) {
    return {
      response: "UserId id does not exist",
    };
  }

  const checkBookingCount = await bookingdetails.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
        bookingStatus: "CONFIRMED",
        "itinerary.Sectors.Departure.DateTimeStamp": {
          $gte: new Date(fromDate),
          $lte: new Date(toDate + "T23:59:59.999Z"),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $arrayElemAt: ["$itinerary.Sectors.Departure.DateTimeStamp", 0],
            },
          },
        },
        bookingCount: { $sum: 1 },
      },
    },
    { $project: { _id: 0, bookingDate: "$_id", bookingCount: 1 } },
  ]);
  if (!checkBookingCount.length) {
    return {
      response: "Data Not Found",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: checkBookingCount,
  };
};

const getDeparturesList = async (req, res) => {
  try{

  const { userId, fromDate, toDate } = req.body;
  if (!userId) {
    return {
      response: "UserId id does not exist",
    };
  }
  const filter = {
    userId:userId,
    "itinerary.Sectors.Departure.Date": {
      $gte: new Date(fromDate + "T00:00:00.000Z"),
      $lte: new Date(toDate + "T23:59:59.999Z"),
    },
  };
  
  const getDepartureList = await bookingdetails.find(filter)
.populate("BookedBy");
console.log(getDepartureList)
  if (!getDepartureList.length) {
    return {
      response: "Data Not Found",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: getDepartureList,
  };
}catch(error){
  console.log(error)
};
}

const getBookingBill = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  let MODEENV = "D";
  if (Config.MODE === "LIVE") {
    MODEENV = "P";
  }

  const bookingBill = await passengerPreferenceSchema.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(fromDate + "T00:00:00.000Z"),
          $lte: new Date(toDate + "T23:59:59.999Z"),
        },
      },
    },
    { $unwind: "$Passengers" },
    {
      $project: {
        bookingId: 1,
        ticketNo: "$Passengers.Optional",
        paxName: { $concat: ["$Passengers.FName", " ", "$Passengers.LName"] },
        PaxType: "$Passengers.PaxType",
        totalBaggagePrice: "$Passengers.totalBaggagePrice",
        totalMealPrice: "$Passengers.totalMealPrice",
        totalSeatPrice: "$Passengers.totalSeatPrice",
      },
    },
    {
      $lookup: {
        from: "bookingdetails",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "bookingData",
      },
    },
    { $unwind: "$bookingData" },
    {
      $match: {
        "bookingData.bookingStatus": "CONFIRMED",
        "bookingData.userId": agencyId
          ? new ObjectId(agencyId)
          : { $exists: true },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "bookingData.AgencyId",
        foreignField: "_id",
        as: "companiesData",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "bookingData.userId",
        foreignField: "_id",
        as: "userdata",
      },
    },
    {
      $sort: {
        "bookingData.createdAt": -1,
      },
    },
    {
      $project: {
        bookingId: "$bookingData.providerBookingId",
        paxName: 1,
        ticketNo: 1,
        PaxType: 1,
        totalBaggagePrice: 1,
        totalMealPrice: 1,
        totalSeatPrice: 1,
        agencyName: { $arrayElemAt: ["$companiesData.companyName", 0] },
        agentId: { $arrayElemAt: ["$userdata.userId", 0] },
        pnr: "$bookingData.PNR",
        cartId: "$bookingData.bookingId",
        paxTotal: "$Passengers.totalBaggagePrice",
        itinerary: "$bookingData.itinerary",
        itemAmount: {
          $arrayElemAt: ["$bookingData.itinerary.PriceBreakup.BaseFare", 0],
        },
        sector: {
          $concat: [
            {
              $arrayElemAt: [
                "$bookingData.itinerary.Sectors.Departure.Code",
                0,
              ],
            },
            " ",
            {
              $arrayElemAt: [
                "$bookingData.itinerary.Sectors.Arrival.Code",
                { $subtract: [{ $size: "$bookingData.itinerary.Sectors" }, 1] },
              ],
            },
          ],
        },
        flightNo: {
          $concat: [
            { $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineCode", 0] },
            " ",
            { $arrayElemAt: ["$bookingData.itinerary.Sectors.FltNum", 0] },
          ],
        },
        class: { $arrayElemAt: ["$bookingData.itinerary.Sectors.Class", 0] },
        ccUserName: "AUTO",
        travelDateOutbound: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Departure.Date", 0],
        },
        travelDateInbound: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Arrival.Date", 0],
        },
        issueDate: "$bookingData.bookingDateTime",
        airlineTax: {
          $arrayElemAt: ["$bookingData.itinerary.PriceBreakup.Tax", 0],
        },
        tranFee: "0",
        sTax: "0",
        commission: "0",
        tds: "0",
        cashback: "0",
        accountPost: "$bookingData.accountPost",
        purchaseCode: "0",
        flightCode: "$bookingData.Supplier",
        airlineName: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineName", 0],
        },
        bookingId1: {
          $concat: [
            { $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineCode", 0] },
            "$bookingData.SalePurchase",
            `${MODEENV}~`,
            "$bookingData.itinerary.FareFamily",
          ],
        },
        createdAt: "$bookingData.createdAt",
        getCommercialArray: "$bookingData.itinerary.PriceBreakup",
      },
    },
  ]);

  let processedBookingIds = new Set();
  for (let [index, element] of bookingBill.entries()) {
    let netAmount = 0;
    netAmount = await calculateOfferedPricePaxWise(element);

    switch (element.PaxType) {
      case "ADT": // Adult
        element.itemAmount = element.itinerary.PriceBreakup[0]?.BaseFare || 0;
        element.airlineTax = element.itinerary.PriceBreakup[0]?.Tax || 0;
        break;
      case "CHD": // Child
        element.itemAmount = element.itinerary.PriceBreakup[1]?.BaseFare || 0;
        element.airlineTax = element.itinerary.PriceBreakup[1]?.Tax || 0;

        break;
      case "INF": // Infant
        element.itemAmount = element.itinerary.PriceBreakup[2]?.BaseFare || 0;
        element.airlineTax = element.itinerary.PriceBreakup[2]?.Tax || 0;

        break;
      default:
        element.itemAmount = 0; // Default if no match
    }

    for (let item of element?.getCommercialArray) {
      for (let items of item?.CommercialBreakup) {
        if (items?.CommercialType == "Discount") {
          element.commission = parseFloat(
            (parseFloat(element.commission) + parseFloat(items.Amount)).toFixed(
              2
            )
          );
        }
        if (items?.CommercialType == "TDS") {
          element.tds = parseFloat(
            (parseFloat(element.tds) + parseFloat(items.Amount)).toFixed(2)
          );
        }
      }
    }

    let getTdsamount = await getTdsAndDsicount([element.itinerary]);

    if (processedBookingIds.has(element.bookingId)) {
      element.commission = 0;
      element.tds = 0;
      delete element.itinerary;
    } else {
      element.commission = getTdsamount.ldgrdiscount;
      element.tds = getTdsamount.ldgrtds;
      processedBookingIds.add(element.bookingId);
      delete element.itinerary;
    }
  }

  bookingBill.forEach(async (element, index) => {
    let ticketNumber = [element.pnr];
    if (element.ticketNo?.ticketDetails) {
      ticketNumber = await getTicketNumberBySector(
        element.ticketNo?.ticketDetails,
        element.sector
      );
    }
    element.ticketNo =
      ticketNumber.length != 0 &&
      ticketNumber[0] != null &&
      ticketNumber[0] != ""
        ? ticketNumber[0]
        : element.pnr;
    element.id = index + 1;
  });

  if (!bookingBill.length) {
    return {
      response: "Data Not Found",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: bookingBill,
  };
};

const getSalesReport = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  console.log(agencyId);
  const salesReport = await passengerPreferenceSchema.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(fromDate + "T00:00:00.000Z"),
          $lte: new Date(toDate + "T23:59:59.999Z"),
        },
      },
    },
    { $unwind: "$Passengers" },
    {
      $project: {
        userId: 1,
        bookingId: 1,
        paxType: "$Passengers.PaxType",
        passengerName: {
          $concat: ["$Passengers.FName", " ", "$Passengers.LName"],
        },
        mealPrice: { $arrayElemAt: ["$Passengers.Meal.Price", 0] },
        seatPrice: { $arrayElemAt: ["$Passengers.Seat.Price", 0] },
        baggagePrice: { $arrayElemAt: ["$Passengers.Baggage.Price", 0] },
      },
    },
    {
      $lookup: {
        from: "bookingdetails",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "bookingData",
      },
    },
    { $unwind: "$bookingData" },
    {
      $match: {
        "bookingData.bookingStatus": "CONFIRMED",
        "bookingData.userId": agencyId
          ? new ObjectId(agencyId)
          : { $exists: true },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "bookingData.AgencyId",
        foreignField: "_id",
        as: "companiesData",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "bookingData.userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $project: {
        _id: 0,
        bookingId: "$bookingData.providerBookingId",
        passengerName: 1,
        paxName: 1,
        paxType: 1,
        mealPrice: 1,
        cartId: "$bookingId",
        seatPrice: 1,
        baggagePrice: 1,
        agentEmailId: { $arrayElemAt: ["$userData.email", 0] },
        agentState: "",
        agentCountry: { $arrayElemAt: ["$userData.nationality", 0] },
        agencyName: { $arrayElemAt: ["$companiesData.companyName", 0] },
        agentId: { $arrayElemAt: ["$companiesData.agentId", 0] },
        ticketNumber: "$bookingData.PNR",
        gdsPnr: "$bookingData.GPnr",
        pnr: "$bookingData.PNR",
        bookingType: "$bookingData.booking_Type",
        baseFare: "$bookingData.itinerary.BaseFare",
        description: {
          $concat: [
            {
              $arrayElemAt: [
                "$bookingData.itinerary.Sectors.Departure.Code",
                0,
              ],
            },
            " ",
            {
              $arrayElemAt: ["$bookingData.itinerary.Sectors.Arrival.Code", 0],
            },
          ],
        },
        flightNo: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.FltNum", 0],
        },
        status: "$bookingData.bookingStatus",
        bookingClass: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Class", 0],
        },
        DepartureDateTime: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Departure.Date", 0],
        },
        ArrivalDateTime: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Arrival.Date", 0],
        },
        bookingDate: "$bookingData.bookingDateTime",
        taxable: "$bookingData.itinerary.Taxes",
        totalfare: "$bookingData.bookingTotalAmount",
        phf: "0",
        ttf: "0",
        asf: "0",
        yq: "0",
        yr: "0",
        taf: "0",
        cgst: "0",
        sgst: "0",
        psf: "0",
        igst: "0",
        ugst: "0",
        rcf: "0",
        rsf: "0",
        udf: "0",
        jn: "0",
        airlineGst: "0",
        ob: "0",
        oc: "0",
        serviceFeeGst: "0",
        grossFare: "0",
        serviceFee: "0",
        gst: "0",
        grossDiscount: "0",
        tds: "0",
        netDiscount: "0",
        netFare: "0",
        dealAmount: "0",
        cabinAmount: "0",
        promoAmount: "0",
        refundableAmount: "0",
        othertaxes: "0",
        flightCode: "$bookingData.Supplier",
        airlineCode: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineCode", 0],
        },
        tripType: "$bookingData.travelType",
        cabinClass: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.CabinClass", 0],
        },
        amendmentId: "",
        amendmentType: "",
        paymentStatus: "success",
        amendmentDate: "",
        getCommercialArray: "$bookingData.itinerary.PriceBreakup",
      },
    },
  ]);

  salesReport.forEach((element, index) => {
    if (element.paxType == "ADT") {
      element.getCommercialArray[0].CommercialBreakup.map((item) => {
        if (item.CommercialType == "SegmentKickback") {
          element.dealAmount =
            parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount =
            parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "Discount") {
          element.dealAmount =
            parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount =
            parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "GST") {
          element.dealAmount =
            parseFloat(element.dealAmount) - parseFloat(item.Amount);
        }
        if (item.CommercialType == "TDS") {
          element.tds = parseFloat(element.tds) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "otherTax") {
          element.grossFare =
            parseFloat(element.tds) + parseFloat(item.Amount) + element.taxable;
        }
        if (item.CommercialType == "GST") {
          element.gst = parseFloat(element.gst) + parseFloat(item.Amount);
        }
      });
    }
    if (element.paxType == "CHD") {
      element.getCommercialArray[1].CommercialBreakup.map((item) => {
        if (item.CommercialType == "SegmentKickback") {
          element.dealAmount =
            parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount =
            parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "Discount") {
          element.dealAmount =
            parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount =
            parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "GST") {
          element.dealAmount =
            parseFloat(element.dealAmount) - parseFloat(item.Amount);
        }
        if (item.CommercialType == "TDS") {
          element.tds = parseFloat(element.tds) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "otherTax") {
          element.grossFare =
            parseFloat(element.tds) + parseFloat(item.Amount) + element.taxable;
        }
        if (item.CommercialType == "GST") {
          element.gst = parseFloat(element.gst) + parseFloat(item.Amount);
        }
      });
    }
    if (element.paxType == "INF") {
      element.getCommercialArray[2].CommercialBreakup.map((item) => {
        if (item.CommercialType == "SegmentKickback") {
          element.dealAmount =
            parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount =
            parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "Discount") {
          element.dealAmount =
            parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount =
            parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "GST") {
          element.dealAmount =
            parseFloat(element.dealAmount) - parseFloat(item.Amount);
        }
        if (item.CommercialType == "TDS") {
          element.tds = parseFloat(element.tds) + parseFloat(item.Amount);
        }
        if (item.CommercialType == "otherTax") {
          element.grossFare =
            parseFloat(element.tds) + parseFloat(item.Amount) + element.taxable;
        }
        if (item.CommercialType == "GST") {
          element.gst = parseFloat(element.gst) + parseFloat(item.Amount);
        }
      });
    }
    element.netDiscount = element.grossDiscount - element.tds;
    element.netFare = element.grossFare - element.netDiscount;
    element.id = index + 1;
    const targetDate = moment(element.DepartureDateTime);
    const currentDate = moment();
    const daysLeft = targetDate.diff(currentDate, "days");
    element.daysToTravel = daysLeft;
    delete element.getCommercialArray;
  });
  if (!salesReport.length) {
    return {
      response: "Data Not Found",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: salesReport,
  };
};

const getBookingByPaxDetails = async (req, res) => {
  const { paxName, userId, ticketNumber } = req.body;
  const CheckRole = await User.findById(userId).populate([
    { path: "roleId" },
    { path: "company_ID", select: "type" },
  ]);
  var SearchFilterUserId;
  if (CheckRole?.roleId?.name != "TMC" && CheckRole?.roleId?.name == "Agency") {
    SearchFilterUserId = { userId: new ObjectId(userId) };
  } else {
    CheckRole?.company_ID?.type == "Agency"
      ? (SearchFilterUserId = { userId: new ObjectId(CheckRole.company_ID) })
      : (SearchFilterUserId = {
          companyId: new ObjectId(CheckRole.company_ID),
        });
  }
  console.log(SearchFilterUserId, "djie");
  if (ticketNumber) {
    const getPaxByTicket = await passengerPreferenceSchema.aggregate([
      {
        $match: {
          "Passengers.Optional.TicketNumber": ticketNumber,
        },
      },
      { $unwind: "$Passengers" },
      { $match: SearchFilterUserId },
      {
        $lookup: {
          from: "bookingdetails",
          localField: "bookingId",
          foreignField: "bookingId",
          as: "bookingDetails",
        },
      },
      { $unwind: "$bookingDetails" },
      {
        $group: {
          _id: "$bookingDetails._id",
          bookingDetails: { $first: "$bookingDetails" },
          passengerPreference: { $push: "$$ROOT" },
        },
      },
    ]);
    console.log(getPaxByTicket, "dji");
    getPaxByTicket.map((items) => {
      items?.passengerPreference.map((item) => {
        delete item.bookingDetails;
      });
    });
    if (!getPaxByTicket.length) {
      SearchFilterUserId.PNR = ticketNumber;
      console.log(SearchFilterUserId);
      const getPaxByPnr = await bookingdetails.findOne(SearchFilterUserId);
      if (!getPaxByPnr) {
        return {
          response: "Data Not Found",
        };
      }
      const getPassPre = await passengerPreferenceSchema.find({
        bookingId: getPaxByPnr?.bookingId,
      });
      if (!getPassPre) {
        return {
          response: "Data Not Found",
        };
      }
      let getPassengerbyPnr = [
        { bookingDetails: getPaxByPnr, passengerPreference: getPassPre },
      ];
      return {
        response: "Fetch Data Successfully",
        data: {
          bookingList: getPassengerbyPnr.sort(
            (a, b) =>
              new Date(b.bookingDetails.bookingDateTime) -
              new Date(a.bookingDetails.bookingDateTime)
          ),
        },
      };
    }
    return {
      response: "Fetch Data Successfully",
      data: {
        bookingList: getPaxByTicket.sort(
          (a, b) =>
            new Date(b.bookingDetails.bookingDateTime) -
            new Date(a.bookingDetails.bookingDateTime)
        ),
      },
    };
  }
  if (!paxName) {
    return {
      response: "If there is not ticketNumber then provide paxName",
    };
  }
  let splitData = paxName.trim().split(" ");
  let regexFilter = {};
  if (splitData.length == 1) {
    regexFilter = {
      $or: [
        { "Passengers.FName": new RegExp(splitData[0], "i") },
        { "Passengers.LName": new RegExp(splitData[0], "i") },
      ],
    };
  }
  if (splitData.length == 2) {
    regexFilter["Passengers.FName"] = new RegExp(splitData[0], "i");
    regexFilter["Passengers.LName"] = new RegExp(splitData[1], "i");
  }
  if (splitData.length == 3) {
    regexFilter["Passengers.FName"] = new RegExp(
      splitData.slice(0, -1).join(" "),
      "i"
    ); //new RegExp(splitData[0], 'i') new RegExp(splitData[1], 'i');
    regexFilter["Passengers.LName"] = new RegExp(splitData[2], "i");
  }
  const getPassenger = await passengerPreferenceSchema.aggregate([
    {
      $match: regexFilter, // Match based on first name and last name
    },
    {
      $match: SearchFilterUserId, // Now match the userId to filter by it
    },
    {
      $lookup: {
        from: "bookingdetails",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "bookingDetails",
      },
    },
    { $unwind: "$bookingDetails" },
    {
      $lookup: {
        from: "users",
        localField: "bookingDetails.userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "companies",
        localField: "userData.company_ID",
        foreignField: "_id",
        as: "companyData",
      },
    },
    { $unwind: { path: "$companyData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "agencies",
        localField: "bookingDetails.AgencyId",
        foreignField: "_id",
        as: "agencyData",
      },
    },
    { $unwind: { path: "$agencyData", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$bookingDetails._id",
        bookingDetails: { $first: "$bookingDetails" },
        passengerPreference: { $push: "$$ROOT" },
        companyData: { $first: "$companyData" },
        userId: { $first: "$userData" },
        agencyData: { $first: "$agencyData" },
      },
    },
  ]);
  console.log(getPassenger, "jiei");
  getPassenger.forEach((items) => {
    if (
      items?.passengerPreference &&
      Array.isArray(items.passengerPreference)
    ) {
      items.passengerPreference.forEach((item) => {
        delete item.bookingDetails;
      });
    }
  });

  if (!getPassenger.length) {
    return {
      response: "Data Not Found",
    };
  }

  return {
    response: "Fetch Data Successfully",
    data: {
      bookingList: getPassenger.sort(
        (a, b) =>
          new Date(b.bookingDetails.bookingDateTime) -
          new Date(a.bookingDetails.bookingDateTime)
      ),
    },
  };
};

const getBillingData = async (req, res) => {
  const { key, fromDate, toDate } = req.query;
  const istDateString = await ISOTime(fromDate);
  const istDateString2 = await ISOTime(toDate);

  if (!fromDate || !toDate || !key) {
    return {
      response: "Please provide required fields",
    };
  }

  let MODEENV = "D";
  let authKey = "667bd5d44dccc9b2d2b80690";
  if (Config.MODE === "LIVE") {
    MODEENV = "P";
    authKey = "667bd64d2ca70f085a8328ca";
  }
  if (authKey !== key) {
    return {
      response: "Access Denied! Provide a valid Key!",
    };
  }

  const billingData = await passengerPreferenceSchema.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(istDateString),
          $lte: new Date(istDateString2),
        },
      },
    },
    { $unwind: "$Passengers" },
    {
      $lookup: {
        from: "bookingdetails",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "bookingData",
      },
    },
    { $unwind: "$bookingData" },
    {
      $match: {
        "bookingData.bookingStatus": {$in:["CANCELLED","CONFIRMED"]},
        "Passengers.accountPost": "0",
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "bookingData.AgencyId",
        foreignField: "_id",
        as: "companiesData",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "bookingData.userId",
        foreignField: "_id",
        as: "userdata",
      },
    },
    {
      $project: {
        _id: "$Passengers._id",
        paxType: "$Passengers.PaxType",
        accountPost: "$Passengers.accountPost",
        bookingId: "$bookingData.providerBookingId",
        ticketNo: "$Passengers.Optional",
        paxName: { $concat: ["$Passengers.FName", " ", "$Passengers.LName"] },
        agencyName: { $arrayElemAt: ["$companiesData.companyName", 0] },
        agentId: { $arrayElemAt: ["$userdata.userId", 0] },
        pnr: "$bookingData.PNR",
        sector: {
          $concat: [
            {
              $arrayElemAt: [
                "$bookingData.itinerary.Sectors.Departure.Code",
                0,
              ],
            },
            " ",
            {
              $arrayElemAt: [
                "$bookingData.itinerary.Sectors.Arrival.Code",
                { $subtract: [{ $size: "$bookingData.itinerary.Sectors" }, 1] },
              ],
            },
          ],
        },
        flightNo: {
          $concat: [
            { $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineCode", 0] },
            " ",
            { $arrayElemAt: ["$bookingData.itinerary.Sectors.FltNum", 0] },
          ],
        },
        class: { $arrayElemAt: ["$bookingData.itinerary.Sectors.Class", 0] },
        ccUserName: "AUTO",
        travelDateOutbound: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Departure.Date", 0],
        },
        travelDateInbound: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.Arrival.Date", 0],
        },
        issueDate: "$bookingData.bookingDateTime",
        airlineTax: "0",
        tranFee: "0",
        sTax: "0",
        commission: "0",
        tds: "0",
        cashback: "0",
        purchaseCode: "0",
        flightCode: "$bookingData.Supplier",
        airlineName: {
          $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineName", 0],
        },
        bookingId1: {
          $concat: [
            { $arrayElemAt: ["$bookingData.itinerary.Sectors.AirlineCode", 0] },
            "$bookingData.SalePurchase",
            `${MODEENV}~`,
            "$bookingData.itinerary.FareFamily",
          ],
        },
        getCommercialArray: "$bookingData.itinerary.PriceBreakup",
        itinerary: "$bookingData.itinerary",

        baseFare: {
          $arrayElemAt: ["$bookingData.itinerary.PriceBreakup.BaseFare", 0],
        },

        totalBaggagePrice:"$Passengers.totalBaggagePrice",
        totalMealPrice: "$Passengers.totalMealPrice",
        totalSeatPrice:"$Passengers.totalSeatPrice",

        itemAmount:"0"
      }
    },
  ]);

  // Remaining processing logic after fetching data
  let processedBookingIds = new Set();

  for (const [index, element] of billingData.entries()) {
    // Initialize baseFare and airlineTax based on PaxType (ADT, CHD, INF)
    switch (element.paxType) {
      case "ADT": // Adult
        element.baseFare = element.itinerary.PriceBreakup[0]?.BaseFare || 0;
        element.airlineTax = element.itinerary.PriceBreakup[0]?.Tax || 0;
        break;
      case "CHD": // Child
        element.baseFare = element.itinerary.PriceBreakup[1]?.BaseFare || 0;
        element.airlineTax = element.itinerary.PriceBreakup[1]?.Tax || 0;
        break;
      case "INF": // Infant
        element.baseFare = element.itinerary.PriceBreakup[2]?.BaseFare || 0;
        element.airlineTax = element.itinerary.PriceBreakup[2]?.Tax || 0;
        break;
      default:
        element.baseFare = 0;
        element.airlineTax = 0;
    }
  
    // Calculate itemAmount as the sum of baseFare, totalBaggagePrice, totalMealPrice, and totalSeatPrice
    element.totalBaggagePrice = element.totalBaggagePrice || 0;
    element.totalMealPrice = element.totalMealPrice || 0;
    element.totalSeatPrice = element.totalSeatPrice || 0;
  
    element.itemAmount = element.baseFare + element.totalBaggagePrice + element.totalMealPrice + element.totalSeatPrice;
  
    // Map through getCommercialArray and calculate commission and TDS
    element.getCommercialArray?.map((items) => {
      if (element.paxType === items.PassengerType) {
        element.baseFare = items?.BaseFare || element.baseFare;
        element.airlineTax = items?.Tax || element.airlineTax;
        items.CommercialBreakup.map((item) => {
          if (item.CommercialType === "Discount") {
            element.commission = parseFloat(
              (parseFloat(element.cashback || 0) + parseFloat(item.Amount)).toFixed(2)
            );
          }
          if (item.CommercialType === "TDS") {
            element.tds = parseFloat(
              (parseFloat(element.tds || 0) + parseFloat(item.Amount)).toFixed(2)
            );
          }
        });
      }
    });
  
    // Check if the bookingId is already processed to avoid duplicate commissions and TDS
    if (processedBookingIds.has(element.bookingId)) {
      element.commission = 0;
      element.tds = 0;
      delete element.itinerary;
    } else {
      let getTdsamount = await getTdsAndDsicount([element.itinerary]);
      element.commission = getTdsamount.ldgrdiscount;
      element.tds = getTdsamount.ldgrtds;
      processedBookingIds.add(element.bookingId);
      delete element.itinerary;
    }
  
    // Handle ticket number and other details
    let ticketNumber = [element.pnr];
    if (element.ticketNo?.ticketDetails) {
      ticketNumber = await getTicketNumberBySector(
        element.ticketNo?.ticketDetails,
        element.sector
      );
    }
    element.ticketNo =
      ticketNumber.length !== 0 &&
      ticketNumber[0] != null &&
      ticketNumber[0] !== ""
        ? ticketNumber[0]
        : element.pnr;
  
    // Convert dates to IST time format
    element.id = index + 1;
    element.travelDateOutbound = await ISTTime(element.travelDateOutbound);
    element.travelDateInbound = await ISTTime(element.travelDateInbound);
    element.issueDate = await ISTTime(element.issueDate);
  
    // Clean up fields before returning the final result
    delete element.getCommercialArray;
    delete element.baseFare;
    delete element.totalBaggagePrice;
    delete element.totalMealPrice;
    delete element.totalSeatPrice;
  }
  

  if (!billingData.length) {
    return {
      response: "Data Not Found",
    };
  }

  return {
    response: "Fetch Data Successfully",
    data: billingData,
  };
};

const updateBillPost = async (req, res) => {
  const { accountPostArr } = req.body;
  if (!accountPostArr.length) {
    return {
      response: "Please provide valid AccountPost",
    };
  }
  const bulkOps = [];
  for (let item of accountPostArr) {
    bulkOps.push({
      updateOne: {
        filter: { "Passengers._id": item._id },
        update: { $set: { "Passengers.$.accountPost": item.accountPost } },
      },
    });
  }
  if (!bulkOps.length) {
    return {
      response: "Data Not Found",
    };
  }
  let updatedData = await passengerPreferenceSchema.bulkWrite(bulkOps);
  if (updatedData.modifiedCount < 1) {
    return {
      response: "Error in Updating AccountPost",
    };
  }
  return {
    response: "AccountPost Updated Successfully",
  };
};

const manuallyUpdateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!bookingId || !status) {
      return {
        response: "Please provide required fields",
      };
    }
    let getBooking = await bookingdetails.findOne({ bookingId: bookingId });
    if (!getBooking) {
      return {
        response: "No booking Found for this BookingId.",
      };
    }
    await bookingdetails.findByIdAndUpdate(getBooking._id, {
      bookingStatus: status,
    });
    return {
      response: "Booking Status Updated Successfully.",
    };
  } catch (error) {
    throw error;
  }
};

const manuallyUpdateMultipleBookingStatus = async (req, res) => {
  try {
    const { bookingIds, status } = req.body;
    if (!bookingIds || !status) {
      return {
        response: "Please provide required fields",
      };
    }
    if (bookingIds.length < 0) {
      return {
        response: "Please provide required fields",
      };
    }
    for (let bId of bookingIds) {
      let getBooking = await bookingdetails.findOne({ bookingId: bId });
      if (!getBooking) {
        return {
          response: "booking not found",
          msges: `No booking Found for this ${bId} BookingId.`,
        };
      } else {
        await bookingdetails.findByIdAndUpdate(getBooking._id, {
          bookingStatus: status,
        });
      }
    }

    // if (!getBooking) {
    //   return {
    //     response: "No booking Found for this BookingId."
    //   }
    // }

    return {
      response: "Booking Status Updated Successfully.",
    };
  } catch (error) {
    throw error;
  }
};

const SendCardOnMail = async (req, res) => {
  try {
    const { companyId, htmlData, email, subject, cartId, status,productType } = req.body;
    if (!companyId || !htmlData || !email || !subject || !cartId || !status) {
      return {
        response: "cartId subject companyId  email productInfo not found",
      };
    }
    const mailConfig = await SmtpConfig.find({ companyId: companyId }).populate(
      "companyId",
      "companyName"
    );
    console.log(mailConfig,"jdie")

    if (mailConfig) {
      await Email.sendCardDetailOnMail(
        mailConfig,
        htmlData,
        email,
        subject,
        cartId,
        status,
        productType
      );

      return {
        response: "SMTP Email sent successfully",
      };
    } else {
      return {
        response: "Your Smtp data not found",
      };
    }
  } catch (error) {
    throw error;
  }
};

const UpdateAdvanceMarkup = async (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).send({ message: "Invalid data format" });
  }
  try {
    // const updateData = {
    //   'itinerary.advanceAgentMarkup': {
    //     adult: { baseFare: 13, taxesFare: 12, feesFare: 11, gstFare: 5 },
    //     child: { baseFare: 2, taxesFare: 2, feesFare: 3, gstFare: 4 },
    //     infant: { baseFare: 2, taxesFare: 4, feesFare: 5, gstFare: 7 }
    //   }
    // };
    const updateData = data.map((item) => {
      const { id, advanceAgentMarkup ,advanceMarkupTotalDiscount} = item;
      if (!id || !advanceAgentMarkup) {
        return {
          response: "id advanceAgentMarkup not found",
        };
      }
      return bookingdetails.findByIdAndUpdate(
        new ObjectId(id),
        { $set: { "itinerary.advanceAgentMarkup": advanceAgentMarkup,
          "itinerary.advanceMarkupTotalDiscount":advanceMarkupTotalDiscount

         } },
        { new: true }
      );
    });

    const updatedDocuments = await Promise.all(updateData);
    const updateCount = updatedDocuments.filter(
      (result) => result !== null
    ).length;
    return {
      response: `document(s) updated succefully`,
      data: updateCount,
    };
  } catch (error) {
    throw error;
  }
};
const updateBookingStatus = async (req, res) => {
const {providerBookingId, bookingId,bookingStatus,pnr,apnr,gpnr} = req.body
try {
 var bookingData={}
if(bookingId) {

   bookingData=await bookingdetails.findOne({bookingId:bookingId})
}
else if(providerBookingId){ 
   bookingData=await bookingdetails.findOne({providerBookingId:providerBookingId})

}
  if(!bookingData){
    return {
      response: "No booking Found for this providerBookingId.",
    };
  }
  const {PNR,Gpnr,Apnr}=bookingData
  const updatedData=await bookingdetails.findByIdAndUpdate({_id:bookingData._id}, 
    {$set:{bookingStatus:bookingStatus,PNR:pnr?pnr:PNR,Gpnr:gpnr?gpnr:Gpnr,Apnr:apnr?apnr:Apnr}},{new:true});
    if(!updatedData){
      return {
        response: "No booking Found for this providerBookingId.",
      };
    }
  return {
    response: "Booking Status Updated Successfully.",
  };
  
  } catch (error) {
    throw error;
  }
}

const importPnrService = async (req, res) => {
  try {
    const { ItineraryPriceCheckResponses, PassengerPreferences, SearchRequest,paymentMethodType } = req.body;
    const { Authentication,TravelType } = SearchRequest;

    const requiredFields = ["ItineraryPriceCheckResponses", "PassengerPreferences", "SearchRequest","paymentMethodType"];

const missingFields = requiredFields.filter(field => !Object.keys(req.body).includes(field));

if (missingFields.length > 0) {
  return { response:"missing Field",
    data: `Missing required fields: ${missingFields.join(", ")}` };
}
    
const getuserDetails=await User.findById(Authentication.UserId).populate('company_ID')

const bookingData = await BookingDetails.find({
  "itinerary.TraceId": Authentication.TraceId,
});
if (bookingData.length > 0) {
  return {
    response: "allready created booking",
  };
}
if(!getuserDetails){
  return{
    response:"user not found"
  }
}
const getAgentConfig=await agentConfig.findOne({userId:getuserDetails?._id})

      const totalSSRWithCalculationPrice=await calculateOfferedPriceForAll(ItineraryPriceCheckResponses)
      const maxCreditLimit = getAgentConfig?.maxcreditLimit ?? 0;
      const checkCreditLimit = maxCreditLimit;
      if (checkCreditLimit < totalSSRWithCalculationPrice) {
        console.log({ checkCreditLimit, totalSSRWithCalculationPrice });
        return{

      response: "Your Balance is not sufficient"
      }
    }
      const newBalance = maxCreditLimit - totalSSRWithCalculationPrice;
      // console.log({ newBalance, maxCreditLimit, totalSSRWithCalculationPrice, stage: 5 }, "newBalance");

      await agentConfig.updateOne(
        { userId:getuserDetails._id },
        { maxcreditLimit: newBalance }
      );

      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
      const gtTsAdDnt = await getTdsAndDsicount(ItineraryPriceCheckResponses);

      await ledger.create({
        userId: getuserDetails?._id,
        companyId: getuserDetails.company_ID._id,
        ledgerId,
        transactionAmount: totalSSRWithCalculationPrice,
        currencyType: "INR",
        fop: "CREDIT",
        deal: gtTsAdDnt?.ldgrdiscount,
        tds: gtTsAdDnt?.ldgrtds,
        transactionType: "DEBIT",
        runningAmount: newBalance,
        remarks: "Booking amount deducted from your account.",
        transactionBy: getuserDetails._id,
        cartId: ItineraryPriceCheckResponses[0].BookingId,
      });

      await transaction.create({
        userId: getuserDetails._id,
        companyId: getuserDetails.company_ID._id,
        trnsNo: Math.floor(100000 + Math.random() * 900000),
        trnsType: "DEBIT",
        paymentMode: "CL",
        trnsStatus: "success",
        transactionBy: getuserDetails._id,
        bookingId: ItineraryPriceCheckResponses[0].BookingId,
      });

    const newArray = await Promise.all(
      ItineraryPriceCheckResponses?.map(async (itineraryItem) => {
        const sectorsArray = itineraryItem?.Sectors?.map((sector) => ({
          AirlineCode: sector.AirlineCode,
          AirlineName: sector.AirlineName,
          Class: sector.Class,
          CabinClass: sector.CabinClass,
          FltNum: sector.FltNum,
          FlyingTime: sector.FlyingTime,
          layover: sector.layover,
          Group: sector.Group,
          TravelTime: sector.TravelTime,
          HandBaggage: sector.HandBaggage,
          BaggageInfo: sector.BaggageInfo,
          Departure: {
            Terminal: sector.Departure?.Terminal,
            Date: sector.Departure?.Date,
            Time: sector.Departure?.Time,
            Day: sector.Departure?.Day,
            DateTimeStamp: sector.Departure?.DateTimeStamp,
            Code: sector.Departure?.Code,
            Name: sector.Departure?.Name,
            CityCode: sector.Departure?.CityCode,
            CityName: sector.Departure?.CityName,
            CountryCode: sector.Departure?.CountryCode,
            CountryName: sector.Departure?.CountryName,
          },
          Arrival: {
            Terminal: sector.Arrival?.Terminal,
            Date: sector.Arrival?.Date,
            Time: sector.Arrival?.Time,
            Day: sector.Arrival?.Day,
            DateTimeStamp: sector.Arrival?.DateTimeStamp,
            Code: sector.Arrival?.Code,
            Name: sector.Arrival?.Name,
            CityCode: sector.Arrival?.CityCode,
            CityName: sector.Arrival?.CityName,
            CountryCode: sector.Arrival?.CountryCode,
            CountryName: sector.Arrival?.CountryName,
          },
        }));

        const priceBreakupArray = itineraryItem?.PriceBreakup?.map((price) => ({
          PassengerType: price.PassengerType,
          NoOfPassenger: price.NoOfPassenger,
          Tax: price.Tax,
          BaseFare: price.BaseFare,
          TaxBreakup: price?.TaxBreakup?.map((tax) => ({
            TaxType: tax.TaxType,
            Amount: tax.Amount,
          })),
          CommercialBreakup: price?.CommercialBreakup?.map((commercial) => ({
            CommercialType: commercial.CommercialType,
            onCommercialApply: commercial.onCommercialApply,
            Amount: commercial.Amount,
            SupplierType: commercial.SupplierType,
          })),
          AgentMarkupBreakup: {
            BookingFee: price?.AgentMarkupBreakup?.BookingFee,
            Basic: price?.AgentMarkupBreakup?.Basic,
            Tax: price?.AgentMarkupBreakup?.Tax,
          },
        }));

        const newItem = {
          userId: Authentication?.UserId,
          companyId: Authentication?.CompanyId,
          AgencyId: Authentication?.AgencyId,
          BookedBy: Authentication?.BookedBy,
          bookingId: itineraryItem?.BookingId,
          prodBookingId: itineraryItem?.IndexNumber,
          provider: itineraryItem?.Provider,
          bookingType: "Automated",
          bookingStatus: "CONFIRMED",
          paymentMethodType,
          paymentMethodType,
          bookingTotalAmount: itineraryItem?.GrandTotal,
          Supplier: itineraryItem?.ValCarrier,
          travelType: TravelType,
          fareRules: itineraryItem?.fareRules ?? null,
          bookingTotalAmount: itineraryItem.Provider === "Kafila"
            ? itineraryItem.offeredPrice + itineraryItem.totalMealPrice + itineraryItem.totalBaggagePrice + itineraryItem.totalSeatPrice || itineraryItem.GrandTotal
            : itineraryItem.offeredPrice + itineraryItem.totalMealPrice + itineraryItem.totalBaggagePrice + itineraryItem.totalSeatPrice,
          totalMealPrice: itineraryItem.totalMealPrice ?? 0,
          totalBaggagePrice: itineraryItem.totalBaggagePrice ?? 0,
          totalSeatPrice: itineraryItem.totalSeatPrice ?? 0,
          itinerary: {
            UID: itineraryItem.UID,
            UniqueKey: itineraryItem?.UniqueKey || "",
            BaseFare: itineraryItem.BaseFare,
            Taxes: itineraryItem.Taxes,
            TotalPrice: itineraryItem.TotalPrice,
            GrandTotal: itineraryItem.GrandTotal,
            FareFamily: itineraryItem.FareFamily,
            IndexNumber: itineraryItem.IndexNumber,
            Provider: itineraryItem.Provider,
            ValCarrier: itineraryItem.ValCarrier,
            LastTicketingDate: itineraryItem.LastTicketingDate,
            TravelTime: itineraryItem.TravelTime,
            advanceAgentMarkup: {
              adult: {
                baseFare: itineraryItem.advanceAgentMarkup?.adult?.baseFare ?? 0,
                taxesFare: itineraryItem.advanceAgentMarkup?.adult?.taxesFare ?? 0,
                feesFare: itineraryItem.advanceAgentMarkup?.adult?.feesFare ?? 0,
                gstFare: itineraryItem.advanceAgentMarkup?.adult?.gstFare ?? 0,
              },
              child: {
                baseFare: itineraryItem.advanceAgentMarkup?.child?.baseFare,
                taxesFare: itineraryItem.advanceAgentMarkup?.child?.taxesFare,
                feesFare: itineraryItem.advanceAgentMarkup?.child?.feesFare,
                gstFare: itineraryItem.advanceAgentMarkup?.child?.gstFare,
              },
              infant: {
                baseFare: itineraryItem.advanceAgentMarkup?.infant?.baseFare,
                taxesFare: itineraryItem.advanceAgentMarkup?.infant?.taxesFare,
                feesFare: itineraryItem.advanceAgentMarkup?.infant?.feesFare,
                gstFare: itineraryItem.advanceAgentMarkup?.infant?.gstFare,
              },
            },
            PriceBreakup: priceBreakupArray,
            Sectors: sectorsArray,
            TraceId: Authentication?.TraceId,
          },
        };

        // console.log({ newItem });
        return await createBooking(newItem);
      })
    );

    if (Array.isArray(newArray) && newArray.length > 0) {
      const response = newArray[0];
      if (response.msg === "Booking created successfully") {
        const passengerPreference = new passengerPreferenceModel({
          userId: Authentication?.UserId,
          companyId: Authentication?.CompanyId,
          bookingId: response?.bookingId,
          bid: response?.bid,
          GstData: PassengerPreferences?.GstData,
          PaxEmail: PassengerPreferences?.PaxEmail,
          PaxMobile: PassengerPreferences?.PaxMobile,
          Passengers: PassengerPreferences?.Passengers?.map((passenger) => ({
            PaxType: passenger?.PaxType,
            passengarSerialNo: passenger?.passengarSerialNo,
            Title: passenger?.Title,
            FName: passenger?.FName,
            LName: passenger?.LName,
            Gender: passenger?.Gender,
            Dob: passenger?.Dob,
            Optional: {
              ticketDetails: passenger?.Optional?.TicketDetails.map((element)=>{return{ticketNumber:element?.TicketNumber||" ",
                src:element?.SRC||" ",
                des:element?.DES||" "
              }}) ?? [],
              EMDDetails: passenger?.Optional?.EMDDetails ?? [],
              PassportNo: passenger?.Optional?.PassportNo,
              PassportExpiryDate: passenger?.Optional?.PassportExpiryDate,
              PassportIssuedDate: passenger?.Optional?.PassportIssuedDate,
              FrequentFlyerNo: passenger?.Optional?.FrequentFlyerNo,
              Nationality: passenger?.Optional?.Nationality,
              ResidentCountry: passenger?.Optional?.ResidentCountry,
            },
            Meal: passenger?.Meal,
            Baggage: passenger?.Baggage,
            Seat: passenger?.Seat,
            totalBaggagePrice: passenger?.totalBaggagePrice,
            totalMealPrice: passenger?.totalMealPrice,
            totalSeatPrice: passenger?.totalSeatPrice,
          })),
          modifyBy: Authentication?.UserId,
        });

        await passengerPreference.save();
      }
    }
    console.log(response.bookingId)
    return {
      response:"booking created successfully",
      data:newArray[0]
    }
  } catch (error) {
    throw error;
  }
};

const createBooking = async (newItem) => {
  try {
    console.log(newItem, "newItem");
    let bookingDetailsCreate = await BookingDetails.create(newItem);
    return {
      msg: "Booking created successfully",
      bookingId: newItem.bookingId,
      bid: bookingDetailsCreate._id,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      IsSucess: false,
      response: "Error creating booking:",
      error,
    };
  }
};
async function calculateOfferedPriceForAll(ItineraryPriceCheckResponses) {
  let calculationOfferPriceWithCommercial = 0; // Initialize to 0
  for (const itinerary of ItineraryPriceCheckResponses) {
    calculationOfferPriceWithCommercial += await calculateOfferedPrice(
      itinerary
    );
    console.log(itinerary)
  }
  console.log(calculationOfferPriceWithCommercial)
  return calculationOfferPriceWithCommercial;
}


module.exports = {
  getAllBooking,
  getBookingByBookingId,
  getBookingCalendarCount,
  getBookingBill,
  getDeparturesList,
  getSalesReport,
  getBookingByPaxDetails,
  getBillingData,
  updateBillPost,
  manuallyUpdateBookingStatus,
  SendCardOnMail,
  UpdateAdvanceMarkup,
  getPendingBooking,
  manuallyUpdateMultipleBookingStatus,
  updateBookingStatus,
  importPnrService
};

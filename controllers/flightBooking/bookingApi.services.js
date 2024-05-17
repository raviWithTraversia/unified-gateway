const Company = require("../../models/Company");
const User = require("../../models/User");
const bookingdetails = require("../../models/booking/BookingDetails");
const config = require("../../models/AgentConfig");
const passengerPreferenceSchema = require("../../models/booking/PassengerPreference");
const { ObjectId } = require("mongodb");

const getAllBooking = async (req, res) => {
  const {
    userId,
    agencyId,
    bookingId,
    pnr,
    status,
    fromDate,
    toDate,
    salesInchargeIds,
    BookedBy
  } = req.body;
  const fieldNames = [
    "userId",
    "agencyId",
    "bookingId",
    "pnr",
    "status",
    "fromDate",
    "toDate",
    "salesInchargeIds"
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
  const checkUserIdExist = await User.findById(userId).populate('roleId').populate("company_ID");
  if (!checkUserIdExist) {
    return {
      response: "User id does not exist",
    };
  }

  if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") {

    let filter = { userId: userId };
    if (agencyId !== undefined && agencyId.trim() !== "") {
      filter.userId = { _id: agencyId };
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

    if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      filter.bookingDateTime = {
        $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
        $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.bookingDateTime = {
        $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.bookingDateTime = {
        $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      };
    }

    const bookingDetails = await bookingdetails.find(filter)
    // .populate({
    //   path: 'userId',
    //   populate: {
    //     path: 'company_ID'
    //   }
    // });


    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {

      const statusCounts = {
        "PENDING": 0,
        "CONFIRMED": 0,
        "FAILED": 0,
        "CANCELLED": 0,
        "INCOMPLETE": 0,
        "HOLD": 0,
        "HOLDRELEASED": 0
      };

      // Iterate over the bookingDetails array
      bookingDetails.forEach(booking => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(bookingDetails.map(async (booking) => {
        const passengerPreference = await passengerPreferenceSchema.find({ bookingId: booking.bookingId });
        const configDetails = await config.findOne({ userId: booking.userId });

        allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
      }));

      let filteredBookingData = allBookingData; // Copy the original data

      if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
        filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);

      }
      return {
        response: "Fetch Data Successfully",
        data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime - new Date(a.bookingDetails.bookingDateTime))), statusCounts: statusCounts }
      };
    }
  } else if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Distributer") {
    let filter = { companyId: checkUserIdExist.company_ID._id };
    if (agencyId !== undefined && agencyId.trim() !== "") {
      filter.userId = { _id: agencyId };
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
    if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      filter.bookingDateTime = {
        $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
        $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.bookingDateTime = {
        $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.bookingDateTime = {
        $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      };
    }

    const bookingDetails = await bookingdetails.find(filter)
      .populate({
        path: 'userId',
        populate: {
          path: 'company_ID'
        }
      });

    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {

      const statusCounts = {
        "PENDING": 0,
        "CONFIRMED": 0,
        "FAILED": 0,
        "CANCELLED": 0,
        "INCOMPLETE": 0,
        "HOLD": 0,
        "HOLDRELEASED": 0
      };

      // Iterate over the bookingDetails array
      bookingDetails.forEach(booking => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(bookingDetails.map(async (booking) => {
        const passengerPreference = await passengerPreferenceSchema.find({ bookingId: booking.bookingId });
        const configDetails = await config.findOne({ userId: booking.userId });
        allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
      }));
      let filteredBookingData = allBookingData; // Copy the original data

      if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
        filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);

      }
      return {
        response: "Fetch Data Successfully",
        data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)), statusCounts: statusCounts }
      };
    }
  } else if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "TMC" || checkUserIdExist?.company_ID?.type === "TMC") {

    let filter = {};
    if (agencyId !== undefined && agencyId.trim() !== "") {
      filter["userId.company_ID._id"] = agencyId;
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
    if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      filter.bookingDateTime = {
        $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
        $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.bookingDateTime = {
        $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.bookingDateTime = {
        $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      };
    }

    const bookingDetails = await bookingdetails.find(filter)
      .populate({
        path: 'userId',
        populate: {
          path: 'company_ID'
        }
      });
    console.log(bookingDetails);

    if (!bookingDetails || bookingDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      const statusCounts = {
        "PENDING": 0,
        "CONFIRMED": 0,
        "FAILED": 0,
        "CANCELLED": 0,
        "INCOMPLETE": 0,
        "HOLD": 0,
        "HOLDRELEASED": 0
      };

      // Iterate over the bookingDetails array
      bookingDetails.forEach(booking => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(bookingDetails.map(async (booking) => {
        const passengerPreference = await passengerPreferenceSchema.find({ bookingId: booking.bookingId });
        const configDetails = await config.findOne({ userId: booking.userId });
        allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
      }));
      let filteredBookingData = allBookingData; // Copy the original data

      if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
        filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
      }

      return {
        response: "Fetch Data Successfully",
        data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)), statusCounts: statusCounts }
      };
    }
  }
};

const getBookingByBookingId = async (req, res) => {
  const {
    bookingId
  } = req.body;
  const fieldNames = [
    "bookingId"
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
  if (!bookingId) {
    return {
      response: "Booking id does not exist",
    };
  }

  // Check if company Id exists
  const checkbookingdetails = await bookingdetails.find({ bookingId: bookingId });
  if (!checkbookingdetails) {
    return {
      response: "Booking id does not exist",
    };
  }

  return {
    response: "Fetch Data Successfully",
    data: checkbookingdetails,
  };

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

  const checkBookingCount = await bookingdetails.aggregate([{
    $match: {
      userId: new ObjectId(userId), bookingStatus: "CONFIRMED",
      creationDate: { $gte: new Date(fromDate), $lte: new Date(toDate) }
    }
  }, {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$creationDate"
        }
      }, bookingCount: { $sum: 1 }
    }
  }, { $project: { _id: 0, bookingDate: "$_id", bookingCount: 1 } }]);
  if (!checkBookingCount.length) {
    return {
      response: "Data Not Found",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: checkBookingCount,
  };
}

const getBookingBill = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  const bookingBill = await passengerPreferenceSchema.aggregate([{
    $match: {
      createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }
    }
  }, { $unwind: "$Passengers" }, {
    $project: {
      bookingId: 1,
      ticketNo: "$Passengers.Optional.TicketNumber",
      paxName: { $concat: ["$Passengers.FName", " ", "$Passengers.LName"] }
    }
  }, {
    $lookup: {
      from: "bookingdetails",
      localField: "bookingId",
      foreignField: "bookingId",
      as: "bookingData",
    },
  }, { $unwind: "$bookingData" }, {
    $match: {
      "bookingData.bookingStatus": "CONFIRMED", "bookingData.AgencyId": agencyId ? new ObjectId(agencyId) : { $exists: true }
    }
  }, {
    $lookup: {
      from: "companies",
      localField: "bookingData.AgencyId",
      foreignField: "_id",
      as: "companiesData",
    },
  }, {
    $project: {
      bookingId: "$bookingData.providerBookingId",
      paxName: 1,
      ticketNo: 1,
      agencyName: { $arrayElemAt: ['$companiesData.companyName', 0] },
      agentId: { $arrayElemAt: ['$companiesData.agentId', 0] },
      pnr: "$bookingData.PNR",
      itemAmount: "$bookingData.itinerary.BaseFare",
      sector: {
        $concat: [{ $arrayElemAt: ['$bookingData.itinerary.Sectors.Departure.Code', 0] },
          ' ',
        { $arrayElemAt: ['$bookingData.itinerary.Sectors.Arrival.Code', 0] }]
      },
      flightNo: {
        $concat: [{ $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineCode', 0] },
          ' ',
        { $arrayElemAt: ['$bookingData.itinerary.Sectors.FltNum', 0] }]
      },
      class: { $arrayElemAt: ['$bookingData.itinerary.Sectors.Class', 0] },
      ccUserName: "AUTO",
      travelDateOutbound: { $arrayElemAt: ['$bookingData.itinerary.Sectors.Departure.Date', 0] },
      travelDateInbound: { $arrayElemAt: ['$bookingData.itinerary.Sectors.Arrival.Date', 0] },
      issueDate: "$bookingData.bookingDateTime",
      airlineTax: "$bookingData.itinerary.Taxes",
      tranFee: "0", sTax: "0", commission: "0", tds: "0", cashback: "0", accountPost: "0", purchaseCode: "0",
      flightCode: "$bookingData.Supplier",
      airlineName: { $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineName', 0] },
      bookingId1: " ",
    }
  }]);
  bookingBill.forEach((element, index) => {
    element.id = index + 1;
  });
  if (!bookingBill.length) {
    return {
      response: "Data Not Found",
    };
  };
  return {
    response: "Fetch Data Successfully",
    data: bookingBill,
  };
}

module.exports = {
  getAllBooking,
  getBookingByBookingId,
  getBookingCalendarCount,
  getBookingBill
};

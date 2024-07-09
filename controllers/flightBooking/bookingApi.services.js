const Company = require("../../models/Company");
const User = require("../../models/User");
const bookingdetails = require("../../models/booking/BookingDetails");
const config = require("../../models/AgentConfig");
const passengerPreferenceSchema = require("../../models/booking/PassengerPreference");
const { ObjectId } = require("mongodb");
const moment = require('moment');
const { Config } = require('../../configs/config');

const ISOTime = async (time) => {
  const utcDate = new Date(time);
  const istDate = new Date(utcDate.getTime() - 5.5 * 60 * 60 * 1000);
  return istDate.toISOString();
}

const ISTTime = async (time) => {
  const utcDate = new Date(time);
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
  return istDate.toISOString();
}

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
  console.log(agencyId)
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
    if (agencyId !== undefined && agencyId !== '') {
      filter.AgencyId =agencyId.forEach((element)=>{return element}).join('');
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
      }).populate('BookedBy');

console.log('1st')
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
        let filter2 = { bookingId: booking.bookingId }
        if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
          filter2['Passengers.Optional.TicketNumber'] = ticketNumber
        }
        const passengerPreference = await passengerPreferenceSchema.find(filter2);
        const configDetails = await config.findOne({ userId: booking.userId });
        if (passengerPreference.length) {
          allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
        }
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
    if (agencyId !== undefined && agencyId !== "") {
      ilter.userId={}
      filter.userId={$in:agencyId}
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
      }).populate('BookedBy');

      console.log("2nd")

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
        let filter2 = { bookingId: booking.bookingId }
        if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
          filter2['Passengers.Optional.TicketNumber'] = ticketNumber
        }
        const passengerPreference = await passengerPreferenceSchema.find(filter2);
        const configDetails = await config.findOne({ userId: booking.userId });
        if (passengerPreference.length) {
          allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
        }
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
    if (agencyId !== undefined && agencyId !== "") {
      filter.userId={}
      filter.userId={$in:agencyId}
     
      console.log(filter.userId)
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
      }).populate('BookedBy');
console.log("3rd")
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
        let filter2 = { bookingId: booking.bookingId }
        if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
          filter2['Passengers.Optional.TicketNumber'] = ticketNumber
        }
        const passengerPreference = await passengerPreferenceSchema.find(filter2);
        const configDetails = await config.findOne({ userId: booking.userId });
        if (passengerPreference.length) {
          allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
        }
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
  } else {
    const userCompanyId = checkUserIdExist.company_ID;
    const checkComapnyUser = await User.findOne({ company_ID: userCompanyId }).populate({
      path: 'roleId',
      match: { type: 'Default' }
    });
    if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Agency") {

      let filter = { userId: checkComapnyUser._id };
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId={}
      filter.userId={$in:agencyId}

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
        }).populate('BookedBy');


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
          let filter2 = { bookingId: booking.bookingId }
          if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
            filter2['Passengers.Optional.TicketNumber'] = ticketNumber
          }
          const passengerPreference = await passengerPreferenceSchema.find(filter2);
          const configDetails = await config.findOne({ userId: booking.userId });
          if (passengerPreference.length) {
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
          }
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
    } else if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Distributer") {
      let filter = { companyId: checkComapnyUser.company_ID._id };
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId={}
      filter.userId={$in:agencyId}
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
        }).populate('BookedBy');

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
          let filter2 = { bookingId: booking.bookingId }
          if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
            filter2['Passengers.Optional.TicketNumber'] = ticketNumber
          }
          const passengerPreference = await passengerPreferenceSchema.find(filter2);
          const configDetails = await config.findOne({ userId: booking.userId });
          if (passengerPreference.length) {
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
          }
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
    } else if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC" || checkComapnyUser?.company_ID?.type === "TMC") {

      let filter = {};
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId={}
      filter.userId={$in:agencyId}
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
        }).populate('BookedBy');


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
          let filter2 = { bookingId: booking.bookingId }
          if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
            filter2['Passengers.Optional.TicketNumber'] = ticketNumber
          }
          const passengerPreference = await passengerPreferenceSchema.find(filter2);
          const configDetails = await config.findOne({ userId: booking.userId });
          if (passengerPreference.length) {
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
          }
        }));
        let filteredBookingData = allBookingData; // Copy the original data

        console.log('sdhei')
        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
        }

        return {
          response: "Fetch Data Successfully",
          data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)), statusCounts: statusCounts }
        };
      }
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
      "itinerary.Sectors.Departure.DateTimeStamp": { $gte: new Date(fromDate), $lte: new Date(toDate + 'T23:59:59.999Z') }
    }
  }, {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: { $arrayElemAt: ["$itinerary.Sectors.Departure.DateTimeStamp", 0] }
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

const getDeparturesList = async (req, res) => {
  const { userId, fromDate, toDate } = req.body;
  if (!userId) {
    return {
      response: "UserId id does not exist",
    };
  }
  const getDepartureList = await bookingdetails.find({ userId, "itinerary.Sectors.Departure.DateTimeStamp": { $gte: new Date(fromDate), $lte: new Date(toDate + 'T23:59:59.999Z') } }).populate('BookedBy');;
  if (!getDepartureList.length) {
    return {
      response: "Data Not Found",
    };
  }
  return {
    response: "Fetch Data Successfully",
    data: getDepartureList,
  };
}

const getBookingBill = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  let MODEENV = "D"
  if (Config.MODE === "LIVE") {
    MODEENV = "P"
  }
  const bookingBill = await passengerPreferenceSchema.aggregate([{
    $match: {
      createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate + 'T23:59:59.999Z') }
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
    $lookup: {
      from: "users",
      localField: "bookingData.userId",
      foreignField: "_id",
      as: "userdata",
    },
  }, {
    $project: {
      bookingId: "$bookingData.providerBookingId",
      paxName: 1,
      ticketNo: 1,
      agencyName: { $arrayElemAt: ['$companiesData.companyName', 0] },
      agentId: { $arrayElemAt: ['$userdata.userId', 0] },
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
      tranFee: "0", sTax: "0", commission: "0", tds: "0", cashback: "0", accountPost: "$bookingData.accountPost", purchaseCode: "0",
      flightCode: "$bookingData.Supplier",
      airlineName: { $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineName', 0] },
      bookingId1: {
        $concat: [{ $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineCode', 0] }, "$bookingData.SalePurchase", `${MODEENV}~`,
          '$bookingData.itinerary.FareFamily']
      },
    }
  }]);
  bookingBill.forEach((element, index) => {
    element.ticketNo = element.ticketNo ? element.ticketNo : element.pnr
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

const getSalesReport = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  const salesReport = await passengerPreferenceSchema.aggregate([{
    $match: {
      createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate + 'T23:59:59.999Z') }
    }
  }, { $unwind: "$Passengers" }, {
    $project: {
      userId: 1,
      bookingId: 1,
      paxType: "$Passengers.PaxType",
      passengerName: { $concat: ["$Passengers.FName", " ", "$Passengers.LName"] },
      mealPrice: { $arrayElemAt: ['$Passengers.Meal.Price', 0] },
      seatPrice: { $arrayElemAt: ['$Passengers.Seat.Price', 0] },
      baggagePrice: { $arrayElemAt: ['$Passengers.Baggage.Price', 0] }
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
    $lookup: {
      from: "users",
      localField: "bookingData.userId",
      foreignField: "_id",
      as: "userData",
    },
  }, {
    $project: {
      _id: 0,
      bookingId: "$bookingData.providerBookingId",
      passengerName: 1,
      paxName: 1,
      paxType: 1,
      mealPrice: 1,
      seatPrice: 1,
      baggagePrice: 1,
      agentEmailId: { $arrayElemAt: ['$userData.email', 0] },
      agentState: "",
      agentCountry: { $arrayElemAt: ['$userData.nationality', 0] },
      agencyName: { $arrayElemAt: ['$companiesData.companyName', 0] },
      agentId: { $arrayElemAt: ['$companiesData.agentId', 0] },
      ticketNumber: "$bookingData.PNR",
      gdsPnr: "$bookingData.GPnr",
      pnr: "$bookingData.PNR",
      bookingType: "$bookingData.booking_Type",
      baseFare: "$bookingData.itinerary.BaseFare",
      description: {
        $concat: [{ $arrayElemAt: ['$bookingData.itinerary.Sectors.Departure.Code', 0] },
          ' ',
        { $arrayElemAt: ['$bookingData.itinerary.Sectors.Arrival.Code', 0] }]
      },
      flightNo: { $arrayElemAt: ['$bookingData.itinerary.Sectors.FltNum', 0] },
      status: "$bookingData.bookingStatus",
      bookingClass: { $arrayElemAt: ['$bookingData.itinerary.Sectors.Class', 0] },
      DepartureDateTime: { $arrayElemAt: ['$bookingData.itinerary.Sectors.Departure.Date', 0] },
      ArrivalDateTime: { $arrayElemAt: ['$bookingData.itinerary.Sectors.Arrival.Date', 0] },
      bookingDate: "$bookingData.bookingDateTime",
      taxable: "$bookingData.itinerary.Taxes",
      totalfare: "$bookingData.bookingTotalAmount",
      phf: "0", ttf: "0", asf: "0", yq: "0", yr: "0", taf: "0", cgst: "0", sgst: "0", psf: "0",
      igst: "0", ugst: "0", rcf: "0", rsf: "0", udf: "0", jn: "0", airlineGst: "0",
      ob: "0", oc: "0", serviceFeeGst: "0", grossFare: "0", serviceFee: "0", gst: "0",
      grossDiscount: "0", tds: "0", netDiscount: "0", netFare: "0", dealAmount: "0",
      cabinAmount: "0", promoAmount: "0", refundableAmount: "0", othertaxes: "0",
      flightCode: "$bookingData.Supplier",
      airlineCode: { $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineCode', 0] },
      tripType: "$bookingData.travelType",
      cabinClass: { $arrayElemAt: ['$bookingData.itinerary.Sectors.CabinClass', 0] },
      amendmentId: "",
      amendmentType: "",
      paymentStatus: "success",
      amendmentDate: "",
      getCommercialArray: '$bookingData.itinerary.PriceBreakup'
    }
  }]);

  salesReport.forEach((element, index) => {
    if (element.paxType == "ADT") {
      element.getCommercialArray[0].CommercialBreakup.map(item => {
        if (item.CommercialType == "SegmentKickback") {
          element.dealAmount = parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount = parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        } if (item.CommercialType == "Discount") {
          element.dealAmount = parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount = parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        } if (item.CommercialType == "GST") {
          element.dealAmount = parseFloat(element.dealAmount) - parseFloat(item.Amount)
        } if (item.CommercialType == "TDS") {
          element.tds = parseFloat(element.tds) + parseFloat(item.Amount)
        } if (item.CommercialType == "otherTax") {
          element.grossFare = parseFloat(element.tds) + parseFloat(item.Amount) + element.taxable
        } if (item.CommercialType == "GST") {
          element.gst = parseFloat(element.gst) + parseFloat(item.Amount)
        }
      })
    } if (element.paxType == "CHD") {
      element.getCommercialArray[1].CommercialBreakup.map(item => {
        if (item.CommercialType == "SegmentKickback") {
          element.dealAmount = parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount = parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        } if (item.CommercialType == "Discount") {
          element.dealAmount = parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount = parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        } if (item.CommercialType == "GST") {
          element.dealAmount = parseFloat(element.dealAmount) - parseFloat(item.Amount)
        } if (item.CommercialType == "TDS") {
          element.tds = parseFloat(element.tds) + parseFloat(item.Amount)
        } if (item.CommercialType == "otherTax") {
          element.grossFare = parseFloat(element.tds) + parseFloat(item.Amount) + element.taxable
        } if (item.CommercialType == "GST") {
          element.gst = parseFloat(element.gst) + parseFloat(item.Amount)
        }
      })
    } if (element.paxType == "INF") {
      element.getCommercialArray[2].CommercialBreakup.map(item => {
        if (item.CommercialType == "SegmentKickback") {
          element.dealAmount = parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount = parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        } if (item.CommercialType == "Discount") {
          element.dealAmount = parseFloat(element.dealAmount) + parseFloat(item.Amount);
          element.grossDiscount = parseFloat(element.grossDiscount) + parseFloat(item.Amount);
        } if (item.CommercialType == "GST") {
          element.dealAmount = parseFloat(element.dealAmount) - parseFloat(item.Amount)
        } if (item.CommercialType == "TDS") {
          element.tds = parseFloat(element.tds) + parseFloat(item.Amount)
        } if (item.CommercialType == "otherTax") {
          element.grossFare = parseFloat(element.tds) + parseFloat(item.Amount) + element.taxable
        } if (item.CommercialType == "GST") {
          element.gst = parseFloat(element.gst) + parseFloat(item.Amount)
        }
      })
    }
    element.netDiscount = element.grossDiscount - element.tds;
    element.netFare = element.grossFare - element.netDiscount;
    element.id = index + 1;
    const targetDate = moment(element.DepartureDateTime);
    const currentDate = moment();
    const daysLeft = targetDate.diff(currentDate, 'days');
    element.daysToTravel = daysLeft;
    delete element.getCommercialArray;
  });
  if (!salesReport.length) {
    return {
      response: "Data Not Found",
    };
  };
  return {
    response: "Fetch Data Successfully",
    data: salesReport,
  };
}

const getBookingByPaxDetails = async (req, res) => {
  const { paxName, userId, ticketNumber } = req.body;
  if (ticketNumber) {
    const getPaxByTicket = await passengerPreferenceSchema.aggregate([{
      $match: {
        userId: new ObjectId(userId), "Passengers.Optional.TicketNumber": ticketNumber
      }
    }, { $unwind: "$Passengers" }, {
      $lookup: {
        from: "bookingdetails",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "bookingDetails",
      }
    }, { $unwind: "$bookingDetails" }, {
      $group: {
        _id: "$bookingDetails._id", bookingDetails: { $first: "$bookingDetails" }, passengerPreference: { $push: "$$ROOT" }
      }
    }]);
    getPaxByTicket.map(items => {
      items?.passengerPreference.map(item => { delete item.bookingDetails })
    });
    if (!getPaxByTicket.length) {
      const getPaxByPnr = await bookingdetails.findOne({ PNR: ticketNumber });
      if (!getPaxByPnr) {
        return {
          response: "Data Not Found",
        };
      }
      const getPassPre = await passengerPreferenceSchema.find({ bookingId: getPaxByPnr?.bookingId });
      if (!getPassPre) {
        return {
          response: "Data Not Found",
        };
      }
      let getPassengerbyPnr = [{ bookingDetails: getPaxByPnr, passengerPreference: getPassPre }]
      return {
        response: "Fetch Data Successfully",
        data: { bookingList: getPassengerbyPnr.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)) }
      };
    }
    return {
      response: "Fetch Data Successfully",
      data: { bookingList: getPaxByTicket.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)) }
    };
  }
  if (!paxName) {
    return {
      response: "If there is not ticketNumber then provide paxName"
    }
  }
  let splitData = paxName.trim().split(' ');
  let regexFilter = {};
  if (splitData.length == 1) {
    regexFilter = {
      $or: [
        { "Passengers.FName": new RegExp(splitData[0], 'i') },
        { "Passengers.LName": new RegExp(splitData[0], 'i') }
      ]
    };
  }
  if (splitData.length == 2) {
    regexFilter["Passengers.FName"] = new RegExp(splitData[0], 'i')
    regexFilter["Passengers.LName"] = new RegExp(splitData[1], 'i')
  }
  if (splitData.length == 3) {
    regexFilter["Passengers.FName"] = new RegExp(splitData.slice(0, -1).join(' '), 'i')//new RegExp(splitData[0], 'i') new RegExp(splitData[1], 'i');
    regexFilter["Passengers.LName"] = new RegExp(splitData[2], 'i')
  }
  const getPassenger = await passengerPreferenceSchema.aggregate([
    {
      $match: regexFilter
    },
    {
      $lookup: {
        from: "bookingdetails",
        localField: "bookingId",
        foreignField: "bookingId",
        as: "bookingDetails"
      }
    },
    { $unwind: "$bookingDetails" },
    {
      $lookup: {
        from: "users",
        localField: "bookingDetails.userId",
        foreignField: "_id",
        as: "userData"
      }
    },
    { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "companies",
        localField: "userData.company_ID",
        foreignField: "_id",
        as: "companyData"
      }
    },
    { $unwind: { path: "$companyData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "agencies",
        localField: "bookingDetails.AgencyId",
        foreignField: "_id",
        as: "agencyData"
      }
    },
    { $unwind: { path: "$agencyData", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$bookingDetails._id",
        bookingDetails: { $first: "$bookingDetails" },
        passengerPreference: { $push: "$$ROOT" },
        companyData: { $first: "$companyData" },
        userId: { $first: "$userData" },
        agencyData: { $first: "$agencyData" }
      }
    }
  ]);

  getPassenger.forEach(items => {
    if (items?.passengerPreference && Array.isArray(items.passengerPreference)) {
      items.passengerPreference.forEach(item => {
        delete item.bookingDetails;
      });
    }
  });

  if (!getPassenger.length) {
    return {
      response: "Data Not Found"
    };
  }

  return {
    response: "Fetch Data Successfully",
    data: {
      bookingList: getPassenger.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime))
    }
  };

}

const getBillingData = async (req, res) => {
  const { key, fromDate, toDate } = req.query;
  const istDateString = await ISOTime(fromDate);
  const istDateString2 = await ISOTime(toDate)

  if (!fromDate || !toDate || !key) {
    return {
      response: "Please provide required fields"
    }
  }
  let MODEENV = "D"
  let authKey = "667bd5d44dccc9b2d2b80690"
  if (Config.MODE === "LIVE") {
    MODEENV = "P"
    authKey = "667bd64d2ca70f085a8328ca"
  }
  if (authKey != key) {
    return {
      response: "Access Denied! Provide a valid Key!"
    }
  }
  const billingData = await passengerPreferenceSchema.aggregate([{
    $match: {
      createdAt: { $gte: new Date(istDateString), $lte: new Date(istDateString2) }
    }
  }, { $unwind: "$Passengers" }, {
    $lookup: {
      from: "bookingdetails",
      localField: "bookingId",
      foreignField: "bookingId",
      as: "bookingData",
    },
  }, { $unwind: "$bookingData" }, {
    $match: {
      "bookingData.bookingStatus": "CONFIRMED", "Passengers.accountPost": "0"
    }
  }, {
    $lookup: {
      from: "companies",
      localField: "bookingData.AgencyId",
      foreignField: "_id",
      as: "companiesData",
    },
  }, {
    $lookup: {
      from: "users",
      localField: "bookingData.userId",
      foreignField: "_id",
      as: "userdata",
    },
  }, {
    $project: {
      _id: "$Passengers._id",
      accountPost: "$Passengers.accountPost",
      bookingId: "$bookingData.providerBookingId",
      ticketNo: "$Passengers.Optional.TicketNumber",
      paxName: { $concat: ["$Passengers.FName", " ", "$Passengers.LName"] },
      agencyName: { $arrayElemAt: ['$companiesData.companyName', 0] },
      agentId: { $arrayElemAt: ['$userdata.userId', 0] },
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
      tranFee: "0", sTax: "0", commission: "0", tds: "0", cashback: "0", purchaseCode: "0",
      flightCode: "$bookingData.Supplier",
      airlineName: { $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineName', 0] },
      bookingId1: {
        $concat: [{ $arrayElemAt: ['$bookingData.itinerary.Sectors.AirlineCode', 0] }, "$bookingData.SalePurchase", `${MODEENV}~`,
          '$bookingData.itinerary.FareFamily']
      },
    }
  }]);

  billingData.forEach(async (element, index) => {
    element.ticketNo = element.ticketNo ? element.ticketNo : element.pnr
    element.id = index + 1;
    element.travelDateOutbound = await ISTTime(element.travelDateOutbound);
    element.travelDateInbound = await ISTTime(element.travelDateInbound);
    element.issueDate = await ISTTime(element.issueDate);
  });
  if (!billingData.length) {
    return {
      response: "Data Not Found",
    };
  };
  return {
    response: "Fetch Data Successfully",
    data: billingData,
  };
}

const updateBillPost = async (req, res) => {
  const { accountPostArr } = req.body;
  if (!accountPostArr.length) {
    return {
      response: "Please provide valid AccountPost"
    }
  }
  const bulkOps = [];
  for (let item of accountPostArr) {
    bulkOps.push({
      updateOne: {
        filter: { 'Passengers._id': item._id },
        update: { $set: { 'Passengers.$.accountPost': item.accountPost } }
      }
    });
  }
  if (!bulkOps.length) {
    return {
      response: "Data Not Found"
    }
  }
  let updatedData = await passengerPreferenceSchema.bulkWrite(bulkOps);
  if (updatedData.modifiedCount < 1) {
    return {
      response: "Error in Updating AccountPost",
    }
  }
  return {
    response: "AccountPost Updated Successfully",
  }
}

const manuallyUpdateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!bookingId || !status) {
      return {
        response: "Please provide required fields"
      }
    }
    let getBooking = await bookingdetails.findById(bookingId);
    if (!getBooking) {
      return {
        response: "No booking Found for this BookingId."
      }
    }
    await bookingdetails.findByIdAndUpdate(bookingId, { bookingStatus: status });
    return {
      response: "Booking Status Updated Successfully."
    }
  } catch (error) {
    throw error
  }
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
  manuallyUpdateBookingStatus
};

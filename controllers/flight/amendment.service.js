const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const User = require("../../models/User");
const bookingDetails = require("../../models/booking/BookingDetails");
const amendmentDetails = require("../../models/booking/AmendmentDetails");
const amendmentPassengerPreference = require("../../models/booking/AmendmentPassengerPrefence");
const config = require("../../models/AgentConfig");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const agentConfig = require("../../models/AgentConfig");
const ledger = require("../../models/Ledger");
const axios = require("axios");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const flightCache = new NodeCache();

const amendment = async (req, res) => {
  try {
    const {
      Authentication,
      AmendmentId,
      AmendmentType,
      AmendmentRemarks,
      CartId,
      Sector,
    } = req.body;
    const fieldNames = [
      "Authentication",
      "AmendmentId",
      "AmendmentType",
      "AmendmentRemarks",
      "CartId",
      "Sector",
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

    const { AmendmentBy } = Authentication;
    const BookingIdDetails = await bookingDetails.find({
      bookingId: CartId,
    }).lean();

    if (!BookingIdDetails) {
      return {
        IsSucess: false,
        response: "Booking Id does not exist",
      };
    }

    const gitconfig = await config.findOne({
      companyId: BookingIdDetails[0].companyId,
    });
    if (!gitconfig) {
      return {
        IsSucess: false,
        response: "Config does not exist",
      };
    }
    let assignuserbyAmendmentType = null;
    if (AmendmentType === "Reschedule") {
      assignuserbyAmendmentType = gitconfig?.assignAmendmentReschedule ?? null;
    } else if (AmendmentType === "Cancellation") {
      assignuserbyAmendmentType =
        gitconfig?.assignAmendmentCancellation ?? null;
    } else if (AmendmentType === "Misc") {
      assignuserbyAmendmentType = gitconfig?.assignAmendmentMisc ?? null;
    }

    const existingAmendment = await amendmentDetails.findOne({
      amendmentId: AmendmentId,
    });

    if (existingAmendment) {
      return {
        IsSucess: false,
        response: "Amendment with this AmendmentId already exists",
      };
    }


    const getSector = BookingIdDetails.find((sector) => {
      const sectors = sector.itinerary?.Sectors;

      if (!sectors || sectors.length === 0) {
        return false;
      }

      const firstSector = sectors[0];
      const lastSector = sectors[sectors.length - 1];

      return (
        firstSector.Departure.Code === Sector.SRC &&
        lastSector.Arrival.Code === Sector.DES
      );
    });
    //console.log(getSector);
    if (!getSector) {
      return {
        IsSucess: false,
        response: "SRC DESC does not exist",
      };
    }
    const updatedSector = { ...getSector }; // Creating a shallow copy

    updatedSector.amendmentType = AmendmentType;
    updatedSector.amendmentId = AmendmentId;
    updatedSector.assignToUser = assignuserbyAmendmentType;
    updatedSector.amendmentStatus = "OPEN";
    updatedSector.paymentStatus = "NOT PROCESSED";
    updatedSector.amendmentRemarks = AmendmentRemarks;
    updatedSector.AmendmentBy = AmendmentBy;


    const amendmentBookingSave = await amendmentDetails.create(
      updatedSector
    );

    if (!amendmentBookingSave) {
      return {
        IsSucess: false,
        response: "Not Save Booking Data",
      };
    }

    const getPassengerPreference = await passengerPreferenceModel.findOne({
      bookingId: CartId,
    }).lean();
    if (!getPassengerPreference) {
      await amendmentDetails.deleteOne({ _id: amendmentBookingSave._id });
      return {
        IsSucess: false,
        response: "PassengerPrefence Not Exits",
      };
    }



    let passngerall = [];
    //Sector.Passengers.forEach((pasngr) => {
    for (const pasngr of Sector.Passengers) {
      const apiPassenger = getPassengerPreference.Passengers.find(
        (p) =>
          p.Title === pasngr.Title &&
          p.FName === pasngr.FName &&
          p.LName === pasngr.LName
      );
      if (apiPassenger) {
        passngerall.push(apiPassenger);
        await passengerPreferenceModel.updateOne(
          { bookingId: CartId, 'Passengers._id': apiPassenger._id },
          { $set: { 'Passengers.$.AmendmentType': true, 'Passengers.$.Status': "Amendment" } }
        );
      }
    }
    //});


    if (passngerall.length === 0) {
      await amendmentDetails.deleteOne({ _id: amendmentBookingSave._id });
      return {
        IsSucess: false,
        response: "PassengerPrefence Not Exits",
      };
    }

    const passngerupdatedata = { ...getPassengerPreference }; // Creating a shallow copy    
    passngerupdatedata.amendmentId = AmendmentId;
    passngerupdatedata.Passengers = passngerall;

    const createAmendmentPassengerPrefence =
      await amendmentPassengerPreference.create(passngerupdatedata);

    if (!createAmendmentPassengerPrefence) {
      await amendmentDetails.deleteOne({ _id: amendmentBookingSave._id });
      return {
        IsSucess: false,
        response: "PassengerPrefence Not Exits",
      };
    }

    return {
      response: "Fetch Data Successfully",
      data: "Amendment Cart Create Successfully",
      apiReq: "Amendment Cart Create Successfully",
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      IsSucess: false,
      response: "An error occurred while processing the request.",
    };
  }
};

const getAllAmendment = async (req, res) => {
  const {
    // userId,
    // agencyId,
    // bookingId,
    // pnr,
    // status,
    // fromDate,
    // toDate,
    // salesInchargeIds
    userId,
    agencyId,
    pnr,
    amendmentId,
    status,
    paymentStatus,
    amendmentStatus,
    amendmentType,
    fromDate,
    toDate,
    bookingId,
    salesInchargeIds,
    invoicingStatus
  } = req.body;
  const fieldNames = [
    // "userId",
    // "agencyId",
    // "bookingId",
    // "pnr",
    // "status",
    // "fromDate",
    // "toDate",
    // "salesInchargeIds"
    "userId",
    "agencyId",
    "pnr",
    "amendmentId",
    "status",
    "paymentStatus",
    "amendmentStatus",
    "amendmentType",
    "fromDate",
    "toDate",
    "bookingId",
    "salesInchargeIds",
    "invoicingStatus"
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
      filter.AgencyId = agencyId;
    }
    if (amendmentId) { filter.amendmentId = amendmentId }
    if (paymentStatus) { filter.paymentStatus = paymentStatus }
    if (amendmentStatus) { filter.amendmentStatus = amendmentStatus }
    if (amendmentType) { filter.amendmentType = amendmentType }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.bookingStatus = status;
    }
    // if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
    //   filter.createdAt = {
    //     $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
    //     $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
    //   };
    // } else if (fromDate !== undefined && fromDate.trim() !== "") {
    //   filter.createdAt = {
    //     $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
    //   };
    // } else if (toDate !== undefined && toDate.trim() !== "") {
    //   filter.createdAt = {
    //     $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
    //   };
    // }
    const amendmentdetails = await amendmentDetails.find(filter)
      .populate({
        path: 'userId',
        populate: {
          path: 'company_ID'
        }
      }).populate('AmendmentBy').populate('assignToUser');


    if (!amendmentdetails || amendmentdetails.length === 0) {
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

      // Iterate over the amendmentDetails array
      amendmentdetails.forEach(booking => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(amendmentdetails.map(async (booking) => {
        const passengerPreference = await amendmentPassengerPreference.find({ bookingId: booking.bookingId });
        const configDetails = await config.findOne({ userId: booking.userId });

        allBookingData.push({ amendmentdetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
      }));

      let filteredBookingData = allBookingData; // Copy the original data

      if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
        filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);

      }
      return {
        response: "Fetch Data Successfully",
        data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.amendmentdetails.createdAt - new Date(a.amendmentdetails.createdAt))), statusCounts: statusCounts }
      };
    }
  } else if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Distributer") {
    let filter = { companyId: checkUserIdExist.company_ID._id };
    if (agencyId !== undefined && agencyId.trim() !== "") {
      filter.userId = { _id: agencyId };
    }
    if (amendmentId) { filter.amendmentId = amendmentId }
    if (paymentStatus) { filter.paymentStatus = paymentStatus }
    if (amendmentStatus) { filter.amendmentStatus = amendmentStatus }
    if (amendmentType) { filter.amendmentType = amendmentType }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.bookingStatus = status;
    }
    // if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
    //   filter.createdAt = {
    //     $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
    //     $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
    //   };
    // } else if (fromDate !== undefined && fromDate.trim() !== "") {
    //   filter.createdAt = {
    //     $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
    //   };
    // } else if (toDate !== undefined && toDate.trim() !== "") {
    //   filter.createdAt = {
    //     $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
    //   };
    // }

    const amendmentdetails = await amendmentDetails.find(filter)
      .populate({
        path: 'userId',
        populate: {
          path: 'company_ID'
        }
      }).populate('AmendmentBy').populate('assignToUser');

    if (!amendmentdetails || amendmentdetails.length === 0) {
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

      // Iterate over the amendmentdetails array
      amendmentdetails.forEach(booking => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(amendmentdetails.map(async (booking) => {
        const passengerPreference = await amendmentPassengerPreference.find({ bookingId: booking.bookingId });
        const configDetails = await config.findOne({ userId: booking.userId });
        allBookingData.push({ amendmentdetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
      }));
      let filteredBookingData = allBookingData; // Copy the original data

      if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
        filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);

      }
      return {
        response: "Fetch Data Successfully",
        data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.amendmentdetails.createdAt) - new Date(a.amendmentdetails.createdAt)), statusCounts: statusCounts }
      };
    }
  } else if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "TMC" || checkUserIdExist?.company_ID?.type === "TMC") {

    let filter = {};
    if (agencyId !== undefined && agencyId.trim() !== "") {
      filter.userId = agencyId;
    }
    if (amendmentId) { filter.amendmentId = amendmentId }
    if (paymentStatus) { filter.paymentStatus = paymentStatus }
    if (amendmentStatus) { filter.amendmentStatus = amendmentStatus }
    if (amendmentType) { filter.amendmentType = amendmentType }

    if (bookingId !== undefined && bookingId.trim() !== "") {
      filter.bookingId = bookingId;
    }
    if (pnr !== undefined && pnr.trim() !== "") {
      filter.PNR = pnr;
    }
    if (status !== undefined && status.trim() !== "") {
      filter.bookingStatus = status;
    }
    // if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
    //   filter.createdAt = {
    //     $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
    //     $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
    //   };
    // } else if (fromDate !== undefined && fromDate.trim() !== "") {
    //   filter.createdAt = {
    //     $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
    //   };
    // } else if (toDate !== undefined && toDate.trim() !== "") {
    //   filter.createdAt = {
    //     $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
    //   };
    // }

    const amendmentdetails = await amendmentDetails.find(filter)
      .populate({
        path: 'userId',
        populate: {
          path: 'company_ID'
        }
      }).populate('AmendmentBy').populate('assignToUser');

    if (!amendmentdetails || amendmentdetails.length === 0) {
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

      // Iterate over the amendmentDetails array
      amendmentdetails.forEach(booking => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });
      const allBookingData = [];

      await Promise.all(amendmentdetails.map(async (booking) => {
        const passengerPreference = await amendmentPassengerPreference.find({ bookingId: booking.bookingId });
        const configDetails = await config.findOne({ userId: booking.userId });
        allBookingData.push({ amendmentdetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
      }));
      let filteredBookingData = allBookingData; // Copy the original data

      if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
        filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
      }

      return {
        response: "Fetch Data Successfully",
        data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.amendmentdetails.createdAt) - new Date(a.amendmentdetails.createdAt)), statusCounts: statusCounts }
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
      if (agencyId !== undefined && agencyId.trim() !== "") {
        filter.AgencyId = agencyId;
      }
      if (amendmentId) { filter.amendmentId = amendmentId }
      if (paymentStatus) { filter.paymentStatus = paymentStatus }
      if (amendmentStatus) { filter.amendmentStatus = amendmentStatus }
      if (amendmentType) { filter.amendmentType = amendmentType }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }

      // if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      //   filter.createdAt = {
      //     $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
      //     $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      //   };
      // } else if (fromDate !== undefined && fromDate.trim() !== "") {
      //   filter.createdAt = {
      //     $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      //   };
      // } else if (toDate !== undefined && toDate.trim() !== "") {
      //   filter.createdAt = {
      //     $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      //   };
      // }

      const amendmentdetails = await amendmentDetails.find(filter)
        .populate({
          path: 'userId',
          populate: {
            path: 'company_ID'
          }
        }).populate('AmendmentBy').populate('assignToUser');


      if (!amendmentdetails || amendmentdetails.length === 0) {
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

        // Iterate over the amendmentDetails array
        amendmentdetails.forEach(booking => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(amendmentdetails.map(async (booking) => {
          const passengerPreference = await amendmentPassengerPreference.find({ bookingId: booking.bookingId });
          const configDetails = await config.findOne({ userId: booking.userId });

          allBookingData.push({ amendmentdetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
        }));

        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);

        }
        return {
          response: "Fetch Data Successfully",
          data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.amendmentdetails.createdAt - new Date(a.amendmentdetails.createdAt))), statusCounts: statusCounts }
        };
      }
    } else if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Distributer") {
      let filter = { companyId: checkComapnyUser.company_ID._id };
      if (agencyId !== undefined && agencyId.trim() !== "") {
        filter.userId = { _id: agencyId };
      }
      if (amendmentId) { filter.amendmentId = amendmentId }
      if (paymentStatus) { filter.paymentStatus = paymentStatus }
      if (amendmentStatus) { filter.amendmentStatus = amendmentStatus }
      if (amendmentType) { filter.amendmentType = amendmentType }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      // if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      //   filter.createdAt = {
      //     $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
      //     $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      //   };
      // } else if (fromDate !== undefined && fromDate.trim() !== "") {
      //   filter.createdAt = {
      //     $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      //   };
      // } else if (toDate !== undefined && toDate.trim() !== "") {
      //   filter.createdAt = {
      //     $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      //   };
      // }

      const amendmentdetails = await amendmentDetails.find(filter)
        .populate({
          path: 'userId',
          populate: {
            path: 'company_ID'
          }
        }).populate('AmendmentBy').populate('assignToUser');

      if (!amendmentdetails || amendmentdetails.length === 0) {
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
        amendmentdetails.forEach(booking => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(amendmentdetails.map(async (booking) => {
          const passengerPreference = await amendmentPassengerPreference.find({ bookingId: booking.bookingId });
          const configDetails = await config.findOne({ userId: booking.userId });
          allBookingData.push({ amendmentdetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
        }));
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);

        }
        return {
          response: "Fetch Data Successfully",
          data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.amendmentdetails.createdAt) - new Date(a.amendmentdetails.createdAt)), statusCounts: statusCounts }
        };
      }
    } else if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC" || checkComapnyUser?.company_ID?.type === "TMC") {

      let filter = {};
      if (agencyId !== undefined && agencyId.trim() !== "") {
        filter.userId = agencyId;
      }
      if (amendmentId) { filter.amendmentId = amendmentId }
      if (paymentStatus) { filter.paymentStatus = paymentStatus }
      if (amendmentStatus) { filter.amendmentStatus = amendmentStatus }
      if (amendmentType) { filter.amendmentType = amendmentType }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      // if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      //   filter.createdAt = {
      //     $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
      //     $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      //   };
      // } else if (fromDate !== undefined && fromDate.trim() !== "") {
      //   filter.createdAt = {
      //     $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      //   };
      // } else if (toDate !== undefined && toDate.trim() !== "") {
      //   filter.createdAt = {
      //     $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      //   };
      // }

      const amendmentdetails = await amendmentDetails.find(filter)
        .populate({
          path: 'userId',
          populate: {
            path: 'company_ID'
          }
        }).populate('AmendmentBy').populate('assignToUser');


      if (!amendmentdetails || amendmentdetails.length === 0) {
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

        // Iterate over the amendmentdetails array
        amendmentdetails.forEach(booking => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(amendmentdetails.map(async (booking) => {
          const passengerPreference = await amendmentPassengerPreference.find({ bookingId: booking.bookingId });
          const configDetails = await config.findOne({ userId: booking.userId });
          allBookingData.push({ amendmentdetails: booking, passengerPreference: passengerPreference, salesInchargeIds: configDetails?.salesInchargeIds });
        }));
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
        }

        return {
          response: "Fetch Data Successfully",
          data: { bookingList: filteredBookingData.sort((a, b) => new Date(b.amendmentdetails.createdAt) - new Date(a.amendmentdetails.createdAt)), statusCounts: statusCounts }
        };
      }
    }


  }
};

const assignAmendmentUser = async (req, res) => {
  const { amendmentId, assignedUser, newCartId } = req.body;
  if (!amendmentId) { return { response: "Provide required fields" } };
  if (!assignedUser && !newCartId) { return { response: "Provide either assignedUser or newCartId" } };
  let setUpdate = {}, response;
  if (assignedUser && newCartId) {
    const getUser = await User.findById(assignedUser);
    if (!getUser) {
      return { response: "User id does not exist" }
    }
    setUpdate.assignToUser = assignedUser;
    setUpdate.newCartId = newCartId;
    response = "assignedUser and newCartId assigned successfully"
  }
  if (assignedUser && !newCartId) {
    const getUser = await User.findById(assignedUser);
    if (!getUser) {
      return { response: "User id does not exist" }
    }
    setUpdate.assignToUser = assignedUser;
    response = "User assigned Successfully"
  };
  if (newCartId && !assignedUser) {
    setUpdate.newCartId = newCartId;
    response = "newCartId assigned Successfully"
  };

  const updatedAmendment = await amendmentDetails.findOneAndUpdate({ amendmentId }, { $set: setUpdate });
  if (!updatedAmendment) {
    return { response: "Error in updating assignedUser" }
  }
  return { response }
}

const deleteAmendmentDetail = async (req, res) => {
  const { amendmentId } = req.query;
  if (!amendmentId) { return { response: "Provide required fields" } };
  await amendmentDetails.deleteMany({ amendmentId });
  await amendmentPassengerPreference.deleteMany({ amendmentId })
  return { response: "Amendment deleted Successfully" }
}


module.exports = {
  amendment,
  getAllAmendment,
  assignAmendmentUser,
  deleteAmendmentDetail
};

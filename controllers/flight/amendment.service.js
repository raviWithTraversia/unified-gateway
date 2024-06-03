const Company = require("../../models/Company");
const Supplier = require("../../models/Supplier");
const Users = require("../../models/User");
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
          { $set: { 'Passengers.$.AmendmentType': true } }
        );
      }
    }
    //});


    if(passngerall.length === 0){
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

module.exports = {
  amendment,
};

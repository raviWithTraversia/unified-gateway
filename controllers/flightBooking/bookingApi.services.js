const Company = require("../../models/Company");
const User = require("../../models/User");
const bookingdetails = require("../../models/booking/BookingDetails");
const passengerPreferenceSchema = require("../../models/booking/PassengerPreference");

const getAllBooking = async (req, res) => {
  const {
    userId,
    agencyId,
    bookingId,
    pnr,
    status,
    fromDate,
    toDate        
  } = req.body;
  const fieldNames = [
    "userId",
    "agencyId",
    "bookingId",
    "pnr",
    "status",
    "fromDate",
    "toDate"        
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
  const checkUserIdExist = await User.findById(userId).populate('roleId');
  if (!checkUserIdExist) {
    return {
      response: "User id does not exist",
    };
  } 

  if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") {
    let filter = { userId: userId };
    if (agencyId !== undefined && agencyId.trim() !== "") {
        filter.userId._id = agencyId;
    }

    if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
    }
    // if (pnr !== undefined && pnr.trim() !== "") {
    //     filter.pnr = pnr;
    // }
    if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
    }

    if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.bookingDateTime = { ...filter.bookingDateTime, $gte: fromDate };
    }

    if (toDate !== undefined && toDate.trim() !== "") {
        filter.bookingDateTime = { ...filter.bookingDateTime, $lte: toDate };
    }
    
    const bookingDetails = await bookingdetails.find(filter).populate('userId');

    if (!bookingDetails || bookingDetails.length === 0) {
        return {
            response: "Data Not Found",
        };
    } else {
        const allBookingData = [];

        await Promise.all(bookingDetails.map(async (booking) => {
            const passengerPreference = await passengerPreferenceSchema.find({ bookingId: booking.bookingId });
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference });
        }));

        return {
            response: "Fetch Data Successfully",
            data: allBookingData,
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
    const checkbookingdetails = await bookingdetails.find({ bookingId:bookingId });
    if (!checkbookingdetails) {
      return {
        response: "Booking id does not exist",
      };
    } 
    
    return {
        response: "Fetch Data Successfully",            
        data: checkbookingdetails,
      };

    if(checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency"){    
      const bookingDetails = await bookingdetails.find({ userId: userId });
      //const passengerPreference = await passengerPreference.find({ bookingId: bookingDetails.bookingId });
      
      if (!bookingDetails || bookingDetails.length === 0) {
          return {
            response: "Data Not Found",
          };
      }else{
          return {
              response: "Fetch Data Successfully",            
              data: bookingDetails,
            };
      } 
    }
    
  
  };

module.exports = {
    getAllBooking,
    getBookingByBookingId
};

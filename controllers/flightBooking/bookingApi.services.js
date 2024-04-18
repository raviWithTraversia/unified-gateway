const Company = require("../../models/Company");
const User = require("../../models/User");
const bookingdetails = require("../../models/booking/BookingDetails");
const config = require("../../models/AgentConfig");
const passengerPreferenceSchema = require("../../models/booking/PassengerPreference");

const getAllBooking = async (req, res) => {
  const {
    userId,
    agencyId,
    bookingId,
    pnr,
    status,
    fromDate,
    toDate,
    salesInchargeIds        
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
  const checkUserIdExist = await User.findById(userId).populate('roleId');
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
            
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds:configDetails?.salesInchargeIds  });
        }));

        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {            
            filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
            
          }
        return {
            response: "Fetch Data Successfully",
            data: {bookingList:filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime - new Date(a.bookingDetails.bookingDateTime))), statusCounts: statusCounts}
        };
    }
}else if( checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Distributer" ){
    let filter = { companyId: checkUserIdExist.company_ID };
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
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds:configDetails?.salesInchargeIds });
        }));
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {            
            filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
           
          }
        return {
            response: "Fetch Data Successfully",
            data: {bookingList:filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)), statusCounts: statusCounts}
        };
    }
}else if( checkUserIdExist.roleId && checkUserIdExist.roleId.name === "TMC" ){
 
  let filter = {};
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
            allBookingData.push({ bookingDetails: booking, passengerPreference: passengerPreference, salesInchargeIds:configDetails?.salesInchargeIds });
        }));
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {            
            filteredBookingData = allBookingData.filter(bookingData => bookingData.salesInchargeIds === salesInchargeIds);
            
            
          }
        return {
            response: "Fetch Data Successfully",
            data: {bookingList:filteredBookingData.sort((a, b) => new Date(b.bookingDetails.bookingDateTime) - new Date(a.bookingDetails.bookingDateTime)), statusCounts: statusCounts}
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

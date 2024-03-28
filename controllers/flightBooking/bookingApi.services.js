const Company = require("../../models/Company");
const User = require("../../models/User");
const bookingdetails = require("../../models/booking/BookingDetails");
const passengerPreference = require("../../models/booking/PassengerPreference");

const getAllBooking = async (req, res) => {
  const {
    userId        
  } = req.body;
  const fieldNames = [
    "userId"        
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
};

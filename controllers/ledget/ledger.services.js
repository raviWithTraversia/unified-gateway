const Company = require("../../models/Company");
const User = require("../../models/User");
const ledger = require("../../models/Ledger");
const getAllledger = async (req, res) => {
  const {
    userId,     
  } = req.body;
  const fieldNames = [
    "userId",          
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
    const ledgerDetails = await ledger.find(filter)
    .populate("userId").populate('companyId');


    if (!ledgerDetails || ledgerDetails.length === 0) {
        return {
            response: "Data Not Found",
        };
    } else {
        return {
            response: "Fetch Data Successfully",
            data:ledgerDetails
        };
    }
}else if( checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Distributer" ){
    let filter = { companyId: checkUserIdExist.company_ID };
    
    const ledgerDetails = await ledger.find(filter)
    .populate("userId").populate('companyId');

    if (!ledgerDetails || ledgerDetails.length === 0) {
        return {
            response: "Data Not Found",
        };
    } else {
        return {
            response: "Fetch Data Successfully",
            data:ledgerDetails
        };
    }
}else if( checkUserIdExist.roleId && checkUserIdExist.roleId.name === "TMC" ){
    let filter = {};    
    
    const ledgerDetails = await ledger.find(filter)
    .populate("userId").populate('companyId');
    if (!ledgerDetails || ledgerDetails.length === 0) {
        return {
            response: "Data Not Found",
        };
    } else {      
        return {
            response: "Fetch Data Successfully",
            data:ledgerDetails
        };
    }
}

  

};

module.exports = {
    getAllledger
};

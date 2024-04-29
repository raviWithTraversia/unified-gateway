const Company = require("../../models/Company");
const agentConfig = require("../../models/AgentConfig");
const idCreation = require("../../models/booking/idCreation");

const getIdCreation = async (req, res) => {
  const {
    companyId        
  } = req.body;
  const fieldNames = [
    "companyId"        
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
  if (!companyId) {
    return {
      response: "TMC Compnay id does not exist",
    };
  }

  // Check if company Id exists
  const checkCompanyIdExist = await Company.findById(companyId);
  if (!checkCompanyIdExist || checkCompanyIdExist.type !== "TMC") {
    return {
      response: "TMC Compnay id does not exist",
    };
  } 

  const getAgentConfig = await agentConfig.findOne({
    companyId: companyId,
  }); 
  if (!getAgentConfig) {
    return {
      response: "No data found for the given companyId"      
    };
  }
  // check id Creation Data
  const getIdCreation = await idCreation.findOne({ companyId: companyId, type:"prefix"});
  if (!getIdCreation) {
    return {
      response: "No data found for the given Prefix"      
    };
  }

  // check prefix 
  if(getIdCreation.prefix == getAgentConfig.bookingPrefix){
    const updateSuffix = await idCreation.updateOne({ companyId: companyId, type:"prefix" }, { $set: { suffix: getIdCreation.suffix + 1 } });
    
    if(updateSuffix){
        return {
            response: "Fetch Data Successfully",            
            data: getAgentConfig.bookingPrefix + (getIdCreation.suffix+1),
          };
    }else{
        return {
            response: "No Update"      
          };
    }
  }else{
    const updateSuffix = await idCreation.updateOne({ companyId: companyId, type:"prefix" }, { $set: { prefix: getAgentConfig.bookingPrefix, suffix: getIdCreation.suffix + 1  } });
        
    if(updateSuffix){
        return {
            response: "Fetch Data Successfully",            
            data: getAgentConfig.bookingPrefix + (getIdCreation.suffix+1),
          };
    }else{
        return {
            response: "No Update"      
          };
    }
    
    }
  
};

module.exports = {
    getIdCreation,
};

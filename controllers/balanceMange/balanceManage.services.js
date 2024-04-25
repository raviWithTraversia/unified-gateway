const User = require("../../models/User");
const agentConfig = require("../../models/AgentConfig");
const creditRequest = require("../../models/CreditRequest");

const getBalance = async (req, res) => {
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
  const checkuserIdIdExist = await User.findById(userId);
  
  if (!checkuserIdIdExist) {
    return {
      response: "User id does not exist",
    };
  } 
  
 
  const getAgentConfig = await agentConfig.findOne({
    userId: userId,
  }); 
  
  if (!getAgentConfig) {
    return {
      response: "No data found for the given UserId"      
    };
  }
  //console.log(getAgentConfig.companyId);
  // const getcreditRequest = await creditRequest.findOne({
  //   userId: userId,
  // }); 
  
  return {
    response: "Fetch Data Successfully",            
    data: {cashBalance:getAgentConfig.maxcreditLimit, tempBalance:10, expireDate:"2025-01-18"},
  };
        
    

  
};

module.exports = {
    getBalance,
};

const User = require("../../models/User");
const agentConfig = require("../../models/AgentConfig");
const creditRequest = require("../../models/CreditRequest");

const getBalance = async (req, res) => {
  const { userId } = req.body;
  const fieldNames = ["userId"];
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
  const checkuserIdIdExistfind = await User.find({ company_ID: userId }).populate("roleId");
  const userWithAgencyRole = checkuserIdIdExistfind.find(user => user.roleId.name === 'Agency');
const checkuserIdIdExistId = userWithAgencyRole ? userWithAgencyRole._id : null;
const checkuserIdIdExist = await User.findById(checkuserIdIdExistId);

  //console.log(checkuserIdIdExist);
  if (!checkuserIdIdExist) {
    return {
      response: "User id does not exist",
    };
  }

  const getAgentConfig = await agentConfig.findOne({
    userId: checkuserIdIdExistId,
  });

  if (!getAgentConfig) {
    return {
      response: "No data found for the given UserId",
    };
  }

  const getcreditRequest = await creditRequest.find({
    agencyId: checkuserIdIdExist.company_ID,
    expireDate: { $gte: new Date() }, // Assuming "expireDate" is a date field and you want to find requests that haven't expired yet
    status: "approved",
    product: "Flight"
  });

  if (getcreditRequest && getcreditRequest.length > 0) {
    let totalAmount = 0;
    getcreditRequest.forEach((request) => {
      totalAmount += request.amount;
    });
    const expireDate = getcreditRequest[0].expireDate;
    // console.log(getcreditRequest);

    return {
      response: "Fetch Data Successfully",
      data: {
        cashBalance: getAgentConfig.maxcreditLimit,
        tempBalance: totalAmount ?? 0,
        expireDate: expireDate,
      },
    };
  } else {
    return {
      response: "Fetch Data Successfully",
      data: {
        cashBalance: getAgentConfig.maxcreditLimit,
        tempBalance: 0,
        expireDate: '',
      },
    };
  }
};

module.exports = {
  getBalance,
};

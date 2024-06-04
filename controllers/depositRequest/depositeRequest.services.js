const depositDetail = require("../../models/DepositRequest");
const Company = require("../../models/Company");
const User = require("../../models/User");
const config = require("../../models/AgentConfig");
const ledger = require("../../models/Ledger");
const EventLogs = require("../logs/EventApiLogsCommon")

const adddepositDetails = async (req, res) => {
  try {
    const {
      companyId,
      agencyId,
      userId,
      depositDate,
      modeOfPayment,
      purpose,
      amount,
      remarks,
      status,
      createdDate,
      createdBy,
      product
    } = req.body;

    const fieldNames = [
      "companyId",
      "agencyId",
      "userId",
      "depositDate",
      "modeOfPayment",
      "purpose",
      "amount",
      "remarks",
      "status",
      "createdDate",
      "createdBy",
      "product"
    ];

    const missingFields = fieldNames.filter(
      fieldName => req.body[fieldName] === null || req.body[fieldName] === undefined
    );

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSomethingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`
      };
    }

    // Check if the same records exist
    const existingDepositRequest = await depositDetail.findOne({
      companyId,
      agencyId,
      userId,
      depositDate,
      modeOfPayment,
      purpose,
      amount,
      remarks,
      status,
      createdDate,
      createdBy,
      product
    });

    if (existingDepositRequest) {
      return {
        response: "The same deposit request already exists",
        data: existingDepositRequest,
      };
    }

    const checkCompanyId = await Company.findById(companyId);
    if (!checkCompanyId) {
      return {
        response: "companyId does not exist",
      };
    }

    // Check if userId exists
    const checkUserId = await User.findById(userId);
    if (!checkUserId) {
      return {
        response: "userId does not exist",
      };
    }

    let savedDepositRequest;
    const newDepositDetails = new depositDetail({
      companyId,
      agencyId,
      userId,
      depositDate,
      modeOfPayment,
      purpose,
      amount,
      remarks,
      status,
      createdDate,
      createdBy,
      product
    });
    savedDepositRequest = await newDepositDetails.save();
    if (savedDepositRequest) {
      return {
        response: "Deposit Request Added sucessfully",
        data: savedDepositRequest,
      };
    } else {
      return {
        response: "Some Datails is missing or Deposit Request not saved",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAlldepositList = async (req, res) => {
  try {
    const result = await depositDetail.find().populate('companyId', 'companyName');
    if (result.length > 0) {
      return {
        response: 'Fetch Data Successfully',
        data: result
      }
    } else {
      return {
        response: 'Not Found',
        data: null
      }
    }

  } catch (error) {
    throw error;
  }
}

const getDepositRequestByCompanyId = async (req, res) => {
  try {
    const CompanyId = req.params.companyId;
    // const getAllAgency = await Company.find({_id: CompanyId});
    // console.log(getAllAgency);
    const result = await depositDetail.find({ companyId: CompanyId }).populate('companyId', 'companyName').populate('agencyId').populate('userId');
    if (result.length > 0) {
      return {
        response: 'Fetch Data Successfuly!!',
        data: result
      }
    } else {
      return {
        response: 'Deposit request not available',
        data: null
      }
    }

  } catch (error) {
    throw error;
  }
}

const getDepositRequestByAgentId = async (req, res) => {
  try {
    const CompanyId = req.params.companyId;
    // const getAllAgency = await Company.find({_id: CompanyId});
    // console.log(getAllAgency);
    const result = await depositDetail.find({ agencyId: CompanyId }).populate('companyId', 'companyName').populate('agencyId').populate('userId');
    if (result.length > 0) {
      return {
        response: 'Fetch Data Successfuly!!',
        data: result
      }
    } else {
      return {
        response: 'Deposit request not available',
        data: null
      }
    }

  } catch (error) {
    throw error;
  }
}

const approveAndRejectDeposit = async (req, res) => {
  try {
    const { remarks, status } = req.body;
    const _id = req.params.creditRequestId;
    if (!remarks || !status) {
      return {
        response: 'Remark and status are required'
      }
    }
    // const doerId = req.user._id;
    const loginUser = await User.findById(req.user._id);

    let updateResponse;
    if (status == "approved") {
      // Approved
      updateResponse = await depositDetail.findByIdAndUpdate(_id, {
        remarks,
        status
      }, { new: true });
      //console.log(updateResponse);
      const configData = await config.findOne({ userId: updateResponse.userId });
      //console.log(updateResponse);
      if (!configData) {
        return {
          response: 'User not found'
        }
      }
      let runningAmount = 0;
      if (updateResponse.product === "Rail") {
        configData.maxRailCredit += updateResponse.amount;
        runningAmount = configData.maxRailCredit
      }
      if (updateResponse.product === "Flight") {
        configData.maxcreditLimit += updateResponse.amount
        runningAmount = configData.maxcreditLimit
      }
      await configData.save();
      const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
      await ledger.create({
        userId: updateResponse.userId,
        companyId: updateResponse.companyId,
        ledgerId: ledgerId,
        transactionAmount: updateResponse.amount,
        currencyType: "INR",
        fop: "Credit",
        transactionType: "Credit",
        runningAmount,
        remarks: "Deposit Request Added Into Your Account.",
        transactionBy: updateResponse.userId,
        product: updateResponse.product
      });
      const LogsData = {
        eventName: "creditRequest",
        doerId: loginUser._id,
        doerName: loginUser.fname,
        companyId: updateResponse.companyId,
        documentId: updateResponse._id,
        description: "Credit request approved"
      };
      EventLogs(LogsData)
      return {
        response: 'Deposit request approved successfully'
      }
    } else {
      // Rejected

      const updateCreditRequestRejected = await depositDetail.findByIdAndUpdate(_id, {
        remarks,
        status,
      }, { new: true })

      const LogsData = {
        eventName: "creditRequest",
        doerId: req.user._id,
        doerName: loginUser.fname,
        companyId: updateCreditRequestRejected.companyId,
        documentId: updateCreditRequestRejected._id,
        description: "Credit request rejected"
      };

      EventLogs(LogsData)
      // await commonFunction.eventLogFunction(
      //     'creditRequest' ,
      //     doerId ,
      //     loginUser.fname ,
      //     req.ip , 
      //     loginUser.company_ID , 
      //     'Credit request rejected'
      // );
      return {
        response: 'Deposit request rejected successfully'
      }
    }

  } catch (error) {
    console.log(error)
    throw error
  }
}

const depositAmountUsingExcel = async (req) => {
  try {
    const { jsonArray, createdBy } = req.body;
    if (!jsonArray.length) {
      return { response: "No input from Excel" };
    }
    const referenceIdArr = jsonArray.map(item => item.remarks);
    const getDatabyRefId = await depositDetail.find({ remarks: { $in: referenceIdArr } })
    const userReferenceIdArr = getDatabyRefId.map(item => item.remarks);
    if (getDatabyRefId.length) { return { response: `Amount already added for ref Id: ${userReferenceIdArr}` } }
    for (let i = 0; i < jsonArray.length; i++) {
      let getUser = await User.findOne({ userId: jsonArray[i].userId }).populate('roleId');
      if (getUser) {
        let updatedAgentConfig = await config.findOneAndUpdate({ userId: getUser._id }, { $inc: { maxcreditLimit: jsonArray[i].amount } }, { new: true })
        await depositDetail.create({
          "companyId": updatedAgentConfig.companyId,
          "agencyId": getUser._id,
          "userId": getUser._id,
          "depositDate": jsonArray[i]?.depositDate,
          "modeOfPayment": jsonArray[i]?.modeOfPayment,
          "purpose": jsonArray[i]?.purpose || "",
          "amount": jsonArray[i]?.amount,
          "status": "approved",
          "remarks": jsonArray[i].remarks,
          "createdDate": new Date(),
          createdBy,
          "product": jsonArray[i].product,
        });
        await ledger.create({
          userId: getUser._id,
          companyId: updatedAgentConfig.companyId,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: jsonArray[i].amount,
          currencyType: "INR",
          fop: "Credit",
          transactionType: "Credit",
          runningAmount: updatedAgentConfig.maxcreditLimit,
          remarks: "Deposit Request Added Into Your Account.",
          transactionBy: updatedAgentConfig.userId,
          referenceID: updatedAgentConfig.remarks
        });
      }
    }
    return { response: "Amount added successfully" };
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  adddepositDetails,
  getAlldepositList,
  getDepositRequestByCompanyId,
  getDepositRequestByAgentId,
  approveAndRejectDeposit,
  depositAmountUsingExcel
};

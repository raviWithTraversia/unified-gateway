const depositDetail = require("../../models/DepositRequest");
const Company = require("../../models/Company");
const User = require("../../models/User");

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

const getAlldepositList = async(req , res) => {
    try {
        const result = await depositDetail.find().populate('companyId' , 'companyName');
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

const getDepositRequestByCompanyId = async(req , res) => {
    try {
        const CompanyId = req.params.companyId;
        // const getAllAgency = await Company.find({_id: CompanyId});
        // console.log(getAllAgency);
        const result = await depositDetail.find({companyId : CompanyId}).populate('companyId' , 'companyName').populate('agencyId');
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
const getDepositRequestByAgentId = async(req , res) => {
    try {
        const CompanyId = req.params.companyId;
        // const getAllAgency = await Company.find({_id: CompanyId});
        // console.log(getAllAgency);
        const result = await depositDetail.find({agencyId : CompanyId}).populate('companyId' , 'companyName').populate('agencyId');
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

const approveAndRejectDeposit = async(req, res) => {
    try {
        const {remarks , status} = req.body;        
        const _id = req.params.creditRequestId;
        if(!remarks || !status) {
            return {
                response : 'Remark and status are required'
            }
        }
        // const doerId = req.user._id;
       // const loginUser = await User.findById(doerId);


        if(status == "approved") { 
            // Approved
            const updateCreditRequestApproved =  await depositDetail.findByIdAndUpdate(_id, {                
                remarks,
                status                
            }, { new: true })

            // await commonFunction.eventLogFunction(
            //     'creditRequest' ,
            //     doerId ,
            //     loginUser.fname ,
            //     req.ip , 
            //     loginUser.company_ID , 
            //     'Credit request approved'
            // );
            return {
                response : 'Deposit request approved successfully'
            }
        }else{           
            // Rejected
            
            const updateCreditRequestRejected =  await depositDetail.findByIdAndUpdate(_id, {
                remarks,
                status,
            }, { new: true })
          
            // await commonFunction.eventLogFunction(
            //     'creditRequest' ,
            //     doerId ,
            //     loginUser.fname ,
            //     req.ip , 
            //     loginUser.company_ID , 
            //     'Credit request rejected'
            // );
            return {
                response : 'Deposit request rejected successfully'
            }
        }

    } catch (error) {
       throw error 
    }
}
module.exports = {
    adddepositDetails,
    getAlldepositList,
    getDepositRequestByCompanyId,
    getDepositRequestByAgentId,
    approveAndRejectDeposit,
};

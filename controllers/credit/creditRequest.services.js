const CreditRequest = require('../../models/CreditRequest');
const Company = require('../../models/Company');
const User = require('../../models/User');
const commonFunction = require('../commonFunctions/common.function');
const config = require('../../models/AgentConfig');
const EventLogs = require('../logs/EventApiLogsCommon')

const addCreditRequest = async (req, res) => {
    try {
        const { companyId,
            agencyId,
            date,
            duration,
            purpose,
            amount,
            utilizeAmount,
            remarks,
            expireDate,
            createdDate,
            createdBy,
            requestedAmount,
            product
        } = req.body;

        if (!companyId || !createdBy || !requestedAmount || !agencyId) {
            return {
                response: 'All field are required'
            }
        }

        // check companyId exist or not
        const checkExistCompany = await Company.findById(companyId);
        if (!checkExistCompany) {
            return {
                response: 'companyId does not exist'
            }
        }

        // Check created BY id exist or not
        const checkUserIdExist = await User.findById(createdBy);
        if (!checkUserIdExist) {
            return {
                response: 'createdBy id does not exist'
            }
        }

        const saveResult = new CreditRequest({
            companyId,
            agencyId,
            date,
            duration,
            purpose,
            amount,
            utilizeAmount,
            remarks,
            expireDate,
            createdDate,
            createdBy,
            requestedAmount,
            product
        })

        const result = await saveResult.save();
        if (result) {

            // Log add 
            // const doerId = req.user._id;
            // const loginUser = await User.findById(doerId);

            // await commonFunction.eventLogFunction(
            //     'creditRequest',
            //     doerId ,
            //     loginUser.fname ,
            //     req.ip , 
            //     companyId , 
            //     'add credit request'
            // );

            return {
                response: 'Credit request created successfully'
            }
        } else {
            console.log("Failed to save result!");
        }
    } catch (error) {
        throw error;
    }
}
const addwallettopup = async (req, res) => {
    try {
        const {
            companyId,
            agencyId,
            amount,
            remarks,
            createdDate,
            createdBy,
            product,
            modeofpayment
        } = req.body;

        if (!companyId || !createdBy || !agencyId || !remarks || !createdDate || !product || !modeofpayment) {
            return {
                response: 'All field are required'
            }
        }

        // check companyId exist or not
        const checkExistCompany = await Company.findById(companyId);
        if (!checkExistCompany) {
            return {
                response: 'companyId does not exist'
            }
        }

        // Check created BY id exist or not
        const checkUserIdExist = await User.findById(createdBy);
        if (!checkUserIdExist) {
            return {
                response: 'createdBy id does not exist'
            }
        }

        const getResult = await config.findOne({ userId: agencyId });
        //console.log(getResult);
        if (getResult) {
            const maxCreditLimit = getResult.maxcreditLimit;
            const updatedMaxCreditLimit = maxCreditLimit + amount;
            const result = await config.updateOne({ userId: agencyId }, { maxcreditLimit: updatedMaxCreditLimit });
            if (result) {
                return {
                    response: 'Topup request created successfully'
                }
            } else {
                console.log("Failed to save result!");
            }
        } else {
            console.log("Agency Not Found!");
        }




    } catch (error) {
        throw error;
    }
}


const getAllCreditList = async (req, res) => {
    try {
        const result = await CreditRequest.find().populate('companyId', 'companyName');
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Credit request not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}



const getCredirRequestByCompanyId = async (req, res) => {
    try {
        const CompanyId = req.params.companyId;
        // const getAllAgency = await Company.find({_id: CompanyId});
        // console.log(getAllAgency);
        const result = await CreditRequest.find({ companyId: CompanyId }).populate('companyId', 'companyName').populate('agencyId');
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Credit request not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

const getCredirRequestByAgentId = async (req, res) => {
    try {
        const CompanyId = req.params.companyId;
        // const getAllAgency = await Company.find({_id: CompanyId});
        // console.log(getAllAgency);
        const result = await CreditRequest.find({ agencyId: CompanyId }).populate('companyId', 'companyName').populate('agencyId');
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Credit request not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

// accept and reject credit request

const approveAndRejectCredit = async (req, res) => {
    try {
        const { expireDate, utilizeAmount, remarks, status } = req.body;
        const _id = req.params.creditRequestId;
        if (!remarks || !status) {
            return {
                response: 'Remark and status are required'
            }
        }
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);


        if (status == "approved") {
            if (!expireDate || !utilizeAmount) {
                return {
                    response: 'All field are required',
                }
            }

            // Approved
            const updateCreditRequestApproved = await CreditRequest.findByIdAndUpdate(_id, {
                expireDate,
                utilizeAmount,
                remarks,
                status,
                amount: utilizeAmount
            }, { new: true })
            const LogsData = {
                eventName: "Credit Request",
                doerId: doerId,
                doerName: loginUser.fname,
                companyId: updateCreditRequestApproved.company_ID,
                documentId: updateCreditRequestApproved._id, // Replace this with the actual ID
                description: "Credit request approved"
            };
            EventLogs(LogsData)
            return {
                response: 'Credit request approved successfully'
            }
        } else {


            // Rejected
            const updateCreditRequestRejected = await CreditRequest.findByIdAndUpdate(_id, {
                remarks,
                status,
            }, { new: true })

            const LogsData = {
                eventName: "Credit Request",
                doerId: doerId,
                doerName: loginUser.fname,
                companyId: updateCreditRequestRejected.company_Id,
                documentId: updateCreditRequestRejected._id, // Replace this with the actual ID
                description: "Credit request rejected"
            };
            EventLogs(LogsData)
            return {
                response: 'Credit request rejected successfully'
            }
        }

    } catch (error) {
        throw error
    }
}

module.exports = {
    addCreditRequest,
    getAllCreditList,
    getCredirRequestByCompanyId,
    approveAndRejectCredit,
    getCredirRequestByAgentId,
    addwallettopup
}
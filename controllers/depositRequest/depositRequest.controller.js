const depositServices = require("./depositeRequest.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const { ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage, } = require("../../utils/constants");

const storeDepositRequest = async (req, res) => {
    try {
        const result = await depositServices.adddepositDetails(req, res)
        if (result.response == "Deposit Request Added sucessfully") {
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        } else if (result.response == "The same deposit request already exists") {
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }
        else if (result.response == "Some Datails is missing or Deposit Request not saved") {
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.PRECONDITION_FAILED,
                true
            )

        } else if (result.response == "companyId does not exist") {
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.PRECONDITION_FAILED,
                true
            )

        } else if (result.response == "agencyId does not exist") {
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.PRECONDITION_FAILED,
                true
            )

        } else if (result.response == "userId does not exist") {
            apiErrorres(
                res,
                result.response,
                ServerStatusCode.PRECONDITION_FAILED,
                true
            )

        } else if (result.isSometingMissing) {
            apiErrorres(
                res,
                result.data,
                ServerStatusCode.RESOURCE_NOT_FOUND,
                true
            )
        }

        else {
            apiErrorres(
                res,
                errorResponse.SOMETHING_WRONG,
                ServerStatusCode.SERVER_ERROR,
                true
            )
        }
    } catch (error) {
        apiErrorres(
            res,
            error,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const getAllDepositRequest = async (req, res) => {
    try {
        const result = await depositServices.getAlldepositList(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )

    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const getDepositByCompanyId = async (req, res) => {
    try {
        const result = await depositServices.getDepositRequestByCompanyId(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )

    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const getDepositByagencyId = async (req, res) => {
    try {
        const result = await depositServices.getDepositRequestByAgentId(req);
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )

    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const approveRejectDeposit = async (req, res) => {
    try {
        const result = await depositServices.approveAndRejectDeposit(req);
        if (result.response == 'Remark and status are required' || result.response == 'All field are required' || result.response == 'User not found') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            if (result.response == 'Deposit request approved successfully') {
                apiSucessRes(
                    res,
                    CrudMessage.DEPOSIT_APPROVE,
                    result.response,
                    ServerStatusCode.SUCESS_CODE
                )
            } else {
                apiSucessRes(
                    res,
                    CrudMessage.DEPOSIT_REJECTED,
                    result.response,
                    ServerStatusCode.SUCESS_CODE
                )
            }
        }

    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

const depositAmountUsingExcel = async (req, res) => {
    try {
        const result = await depositServices.depositAmountUsingExcel(req);
        if (result.response == 'No input from Excel' || result.response == 'All field are required') {
            apiErrorres(res, result.response, ServerStatusCode.BAD_REQUEST, true)
        }
        else {
            if (result.response == 'Amount added successfully' || result.response) {
                apiSucessRes(
                    res,
                    result.response,
                    ServerStatusCode.SUCESS_CODE
                )
            } else {
                apiSucessRes(
                    res,
                    result.response,
                    ServerStatusCode.SUCESS_CODE
                )
            }
        }

    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}

module.exports = {
    storeDepositRequest,
    getAllDepositRequest,
    getDepositByCompanyId,
    getDepositByagencyId,
    approveRejectDeposit,
    depositAmountUsingExcel
}
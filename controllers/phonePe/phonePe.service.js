const axios = require("axios");
const { Config } = require("../../configs/config");
const { create } = require("lodash");
const {commonFunctionsPGLogs}=require('../commonFunctions/common.function')
const crypto = require("crypto");

const phonePeAuthentication = async (credentialType) => {
    // let logs
    try {


        const body = {
            "client_id": Config[credentialType ?? "TEST"]?.phonePeClientId,
            "client_version": Config[credentialType ?? "TEST"]?.phonePeVersion,
            "client_secret": Config[credentialType ?? "TEST"]?.phonePeClientSecret,
            "grant_type": "client_credentials"
        }
let url=Config[credentialType ?? "TEST"]?.phonePeAuthUrl
  
        const response = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        if (!response?.data?.access_token) {
            return false;

        }
        // logs.res = JSON.stringify(response)
        // commonFunctionsPGLogs(logs)

        return response?.data?.access_token
    }
    catch (e) {
        // logs.res = JSON.stringify(e)
        // commonFunctionsPGLogs(logs)
        return false
    }

    // return response;
}
const phonePeRedirectUrl = async (req, res) => {
    // const {}=req.body
    // let logs
    const { apiBody, merchantId } = createPhonePeBody(req.body)
    const berarToken = await phonePeAuthentication(req.body.Authentication.CredentialType)
    if (!berarToken) {
        return {
            respone: "failed to get phonePe Token"
        }
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${berarToken}`
    }
    let url=Config[req.body.Authentication.CredentialType ?? "TEST"]?.phonePePaymentUrl
    // logs = {
    //     userId: req.body.Authentication.UserId,
    //     companyId: req.body.Authentication.CompanyId,
    //     traceId: merchantId,
    //     type: "PG",
    //     url: url,
    //     req: apiBody,
    // }
    try {
        const response = await axios.post(url, apiBody, {
            headers: headers
        })

        // logs.res = response?.data
        commonFunctionsPGLogs(req.body.Authentication.UserId, req.body.Authentication.CompanyId, merchantId, "PG", url, apiBody, response?.data)
        return {
            response: "success",
            data: response?.data
        }

    }
    catch (e) {
        // logs.res = e
        commonFunctionsPGLogs(req.body.Authentication.UserId, req.body.Authentication.CompanyId, merchantId, "PG", url, apiBody, e.stack)

throw e
    }



}
function createPhonePeBody(body) {
    const { Authentication,
        bookingId,
        amount,
        pgCharges,
        normalAmount,
        paymentFor,
        productinfo,
        agentId,
        paymentType
    } = body
    let merchantIdUnique =crypto.createHash("sha256").update(`${agentId}_${Date.now()}`).digest("hex").slice(0, 35);// `${agentId}_${Date.now()}`
    let url = "";
    if (
        paymentFor.toLowerCase() == "wallet" &&
        productinfo.toLowerCase() == "flight"
    ) {
        url = "flight/phonepe/wallet/success";
    } else if (
        productinfo.toLowerCase() == "flight" &&
        paymentFor.toLowerCase() == "booking"
    ) {
        url = "flight/phonepe/success";
    } else if (
        productinfo.toLowerCase() == "rail" &&
        paymentFor.toLowerCase() == "wallet"
    ) {
        url = "rail/phonepe/wallet/success";
    }
    const apiAmount = (Number(normalAmount) + Number(pgCharges ?? 0)) * 100;

    let enabledPaymentMode = null
    if (paymentType.endsWith("Card")) {
        enabledPaymentMode = {
            "type": "CARD",
            "cardTypes": [
                paymentType === "Credit Card" ? "CREDIT_CARD" : "DEBIT_CARD"
            ]
        };


    }
    else if (paymentType === "NetBanking") {
        enabledPaymentMode = {
            "type": "NET_BANKING"
        };
    }
    else if (paymentType === "UPI") {
        enabledPaymentMode = {
            "type": "UPI_INTENT"
        };
    }

let enablePayments=[enabledPaymentMode]
if(paymentType === "UPI"){
    enablePayments.push({
                    "type": "UPI_COLLECT"
                },
                {
                    "type": "UPI_QR"
                },);
}
    const apiBody = {

        "merchantOrderId": merchantIdUnique,
        "amount": apiAmount,
        // "expireAfter": 1200,
        "metaInfo": {
            "udf1": bookingId,
            "udf2": normalAmount,
            "udf3": pgCharges,
            "udf4": paymentType,
            "udf5": agentId
        },
        "paymentFlow": {
            "type": "PG_CHECKOUT",
            "message": `${productinfo} payment for ${paymentFor}`,
            "merchantUrls": {
                        "redirectUrl": `${
                    Config[Authentication?.CredentialType ?? "TEST"].baseURLBackend
                  }/api/${url}?merchantId=${merchantIdUnique}&credentialType=${Authentication?.CredentialType}`
                // redirectUrl: `http://localhost:3111/api/${url}?merchantId=${merchantIdUnique}&credentialType=${Authentication?.CredentialType}`,
            },
            "paymentModeConfig": {
                enabledPaymentModes: enablePayments

                // "disabledPaymentModes": [
                //     {
                //         "type": "UPI_INTENT"
                //     },
                //     {
                //         "type": "UPI_COLLECT"
                //     },
                //     {
                //         "type": "UPI_QR"
                //     },
                //     {
                //         "type": "NET_BANKING"
                //     },
                //     {
                //         "type": "CARD",
                //         "cardTypes": [
                //             "DEBIT_CARD",
                //             "CREDIT_CARD"
                //         ]
                //     }
                // ]
            }
        }

    }

    return {
        apiBody: apiBody,
        merchantId: merchantIdUnique
    }




}
const phonePeSuccess = async (req, res) => {
    const bookingId = req.query.merchantId;        // "12345"
    const credentialType = req.query.credentialType; // "wallet"
    if (!bookingId || !credentialType) {
        return {
            response: "failed to get phonePe Token"
        }
    }

    const berarToken = await phonePeAuthentication(credentialType)
    if (!berarToken) {
        return {
            respone: "failed to get phonePe Token"
        }
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${berarToken}`
    }
    try {
        const response = await axios.get(`${Config[credentialType ?? "TEST"]?.phonePePaymentDetailUrl}/${bookingId}/status?details=false`, {
            headers: headers
        })
        if (!response?.data) {
            return {
                response: "failed to get phonePe Token"
            }

        }
        commonFunctionsPGLogs(Config?.TMCID, Config?.TMCID, bookingId, "PG", `${Config[credentialType ?? "TEST"]?.phonePePaymentDetailUrl}/${bookingId}/status?details=false`, null, response?.data)
        const chnageResponse = {
            status: response?.data?.state === "COMPLETED" ? "PAID" : response?.data?.state === "FAILED" ? "Failed" : "Pending", txnid: `${response?.data?.orderId}_${bookingId}`, bookingId: response?.data?.orderId, udf1: response?.data?.metaInfo?.udf1, udf2: response?.data?.metaInfo?.udf2, udf3: response?.data?.metaInfo?.udf3, amount: response?.data?.amount, PG_TYPE: convetToPgType(response?.data?.metaInfo?.udf4), payment_source: "phonePe",bank_ref_num:response?.data?.orderId,cardCategory:response?.data?.metaInfo?.udf4
        }

        return {
            response: "success",
            data: chnageResponse
        }

    }
    catch (e) {
        return {
            response: "error in phonePe payment",
            data:e.stack

        }
    }
}

const convetToPgType = (pgType) => {
    if (pgType === "Credit Card") {
        return "PG_CC"
    } else if (pgType === "Debit Card") {
        return "PG_DC"
    } else if (pgType === "UPI") {
        return "PG_UPI"
    } else if (pgType === "NetBanking") {
        return "PG_NB"
    }


}

function getExpectedAuthHeader() {
    let PHONEPE_USERNAME = "testuser";
    let PHONEPE_PASSWORD = "testpassword123";
  const authString = `${PHONEPE_USERNAME}:${PHONEPE_PASSWORD}`;
  const hash = crypto.createHash('sha256').update(authString).digest('hex');
  return `SHA256 ${hash}`;
}

const phonePeWebhoockUrlIntegration = async (req, res) => {
    try{

    
    const incomingAuth = req.headers['authorization']??"";

  // Validate Authorization header
    commonFunctionsPGLogs("68d116cb9d77fc1d3fe38cc0", "68d116cb9d77fc1d3fe38cc0", "", "PG", incomingAuth, req.body, {})

  const expectedAuth = getExpectedAuthHeader();
  if (incomingAuth !== expectedAuth) {
    return res.status(401).json({ IsSucess: false, Message: "Unauthorized" });
  }
    commonFunctionsPGLogs("68d116cb9d77fc1d3fe38cc0", "68d116cb9d77fc1d3fe38cc0", "", "PG", `${incomingAuth}-${expectedAuth}`, req.body,{})

  return res.status(200).json({ IsSucess: true, Message: "Authorized", bodyData:req.body});
}
catch(e){
    commonFunctionsPGLogs("68d116cb9d77fc1d3fe38cc0", "68d116cb9d77fc1d3fe38cc0", "", "PG", "", {}, e?.stack)
    return res.status(400).json({ IsSucess: false, Message: e.message, error:e.stack});
}
}

module.exports = {
    phonePeAuthentication,
    phonePeRedirectUrl,
    phonePeSuccess,
    phonePeWebhoockUrlIntegration
}



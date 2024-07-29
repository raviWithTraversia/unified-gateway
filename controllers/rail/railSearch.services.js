const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require('axios');
const { Config } = require("../../configs/config");

const getRailSearch = async (req, res) => {
    try {
        const { fromStn, toStn, date, Authentication } = req.body;
        if (!fromStn, !toStn, !date, !Authentication) { return { response: "Provide required fields" } };
        if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
            return {
                IsSucess: false,
                response: "Credential Type does not exist",
            };
        }
        const checkUser = await User.findById(Authentication.UserId).populate('roleId');
        const checkCompany = await Company.findById(Authentication.CompanyId);
        if (!checkUser || !checkCompany) {
            return { response: "Either User or Company must exist" }
        }
        if (checkUser?.roleId?.name !== "Agency") { return { response: "User role must be Agency" } }
        if (checkCompany?.type !== "TMC") { return { response: "companyId must be TMC" } }
        let renewDate = date.split("-");
        let url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Authentication.CredentialType === "LIVE") {
            url = `https://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        }

        const response = (await axios.get(url, { headers: { 'Authorization': auth } }))?.data;
        if (!response?.trainBtwnStnsList?.length) {
            return {
                response: "Error in fetching data",
            }
        } else {
            return {
                response: "Fetch Data Successfully",
                data: response,
            }
        }
    } catch (error) {
        console.log(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

const railSearchBtwnDate = async (req, res) => {
    try {
        const { trainNo, fromStn, toStn, date, Authentication, quota, cls } = req.body;
        if (!fromStn, !toStn, !date, !Authentication) { return { response: "Provide required fields" } };
        if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
            return {
                IsSucess: false,
                response: "Credential Type does not exist",
            };
        }
        const checkUser = await User.findById(Authentication.UserId).populate('roleId');
        const checkCompany = await Company.findById(Authentication.CompanyId);
        if (!checkUser || !checkCompany) {
            return { response: "Either User or Company must exist" }
        }
        if (checkUser?.roleId?.name !== "Agency") { return { response: "User role must be Agency" } }
        if (checkCompany?.type !== "TMC") { return { response: "companyId must be TMC" } }
        let renewDate = date.split("-");
        let url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${fromStn}/${toStn}/${cls}/${quota}/N`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Authentication.CredentialType === "LIVE") {
            url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${fromStn}/${toStn}/${cls}/${quota}/N`;
        }

        const response = (await axios.post(url, {
            "masterId": "WNEPTPL00000", //this is hard code master id for temp use
            "enquiryType": "3",
            "reservationChoice": "99",
            "moreThanOneDay": "true"
        }, { headers: { 'Authorization': auth } }))?.data;
        if (!response) {
            return {
                response: "Error in fetching data",
            }
        } else {
            return {
                response: "Fetch Data Successfully",
                data: response,
            }
        }
    } catch (error) {
        console.log(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

const railRouteView = async (req, res) => {
    try {
        const { trainNo, journeyDate, startingStationCode, Authentication } = req.body;
        if (!trainNo, !Authentication) {
             return { response: "Provide required fields" } 
        };
        if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
            return {
                IsSucess: false,
                response: "Credential Type does not exist",
            };
        }
        const checkUser = await User.findById(Authentication.UserId).populate('roleId');
        const checkCompany = await Company.findById(Authentication.CompanyId);
        if (!checkUser || !checkCompany) {
            return { response: "Either User or Company must exist" }
        }
        if (checkUser?.roleId?.name !== "Agency") { return { response: "User role must be Agency" } }
        if (checkCompany?.type !== "TMC") { return { response: "companyId must be TMC" } }
        // let renewDate = journeyDate.split("-");
        let url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/trnscheduleEnq/${trainNo}`; //?journeyDate=${journeyDate}&startingStationCode=${startingStationCode}`;
        // console.log(url,"url");
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Authentication.CredentialType === "LIVE") {
            url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/trnscheduleEnq/${trainNo}`;//?journeyDate=${journeyDate}&startingStationCode=${startingStationCode}`;
        }

        const response = (await axios.get(url, { headers: { 'Authorization': auth } }))?.data;

        if (!response) {
            return {
                response: "Error in fetching data",
            }
        } else {
            return {
                response: "Fetch Data Successfully",
                data: response,
            }
        }
    } catch (error) {
        console.log(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

const railFareEnquiry = async (req, res) => {
    try {
        const { trainNo, journeyDate, frmStn,toStn,jClass,jQuota,paymentEnqFlag, Authentication,passengerList,mobileNumber ,travelInsuranceOpted,ignoreChoiceIfWl,reservationMode,agentDeviceId,autoUpgradationSelected,ticketType,boardingStation,clientTransactionId,gstDetailInputFlag,infantList,gstDetails} = req.body;
        if (!trainNo, !Authentication) {
             return { response: "Provide required fields" } 
        };
        if (!["LIVE", "TEST"].includes(Authentication.CredentialType)) {
            return {
                IsSucess: false,
                response: "Credential Type does not exist",
            };
        }
        const checkUser = await User.findById(Authentication.UserId).populate('roleId');
        const checkCompany = await Company.findById(Authentication.CompanyId);
        if (!checkUser || !checkCompany) {
            return { response: "Either User or Company must exist" }
        }
        if (checkUser?.roleId?.name !== "Agency") { return { response: "User role must be Agency" } }
        if (checkCompany?.type !== "TMC") { return { response: "companyId must be TMC" } }
        let renewDate = journeyDate.split("-");
        let url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}/${jQuota}/${paymentEnqFlag}`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Authentication.CredentialType === "LIVE") {
            url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/avlFareenquiry/${trainNo}/${renewDate[0]}${renewDate[1]}${renewDate[2]}/${frmStn}/${toStn}/${jClass}/${jQuota}/${paymentEnqFlag}`;
        } 
        
        let queryParams = {
            "masterId": "WNEPTPL00000", 
            "wsUserLogin": "WNEPTPL00001",
            "enquiryType": "3",
            "reservationChoice": "99",
            "moreThanOneDay": "true",
            "ignoreChoiceIfWl":ignoreChoiceIfWl,
            "gnToCkOpted":"false",
            "ticketType":ticketType,
            "travelInsuranceOpted":travelInsuranceOpted,
            "passengerList": passengerList,
            "mobileNumber": mobileNumber,
            "autoUpgradationSelected": autoUpgradationSelected,
            "boardingStation": boardingStation,
            "reservationMode": reservationMode,//B2B_WEB_OTP
            "clientTransactionId": clientTransactionId,
            "gstDetailInputFlag": gstDetailInputFlag,
            "agentDeviceId": agentDeviceId,
            "infantList": infantList,
            "gstDetails": gstDetails
        };
        const response = (await axios.post(url,queryParams ,{ headers: { 'Authorization': auth } }))?.data;
        // console.log(response);
        if (!response) {
            return {
                response: "Error in fetching data",
            }
        } else {
            return {
                response: "Fetch Data Successfully",
                data: response,
            }
        }
    } catch (error) {
        console.log(error,"error");
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

module.exports = { getRailSearch, railSearchBtwnDate, railRouteView, railFareEnquiry }
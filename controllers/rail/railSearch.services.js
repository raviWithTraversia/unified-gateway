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
            url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
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

module.exports = { getRailSearch, railSearchBtwnDate }
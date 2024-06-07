const User = require("../../models/User");
const Company = require("../../models/Company");
const axios = require('axios');
const { Config } = require("../../configs/config");

const getRailSearch = async (req, res) => {
    try {
        const { fromStn, toStn, date, Authentication } = req.body;
        if (!fromStn, !toStn, !date, !Authentication) { return { response: "Provide required fields" } };
        const checkUser = await User.findById(Authentication.UserId).populate('roleId');
        const checkCompany = await Company.findById(Authentication.CompanyId);
        if (!checkUser || !checkCompany) {
            return { response: "Either User or Company must exist" }
        }
        if (checkUser?.roleId?.name !== "Agency") { return { response: "User role must be Agency" } }
        if (checkCompany?.type !== "TMC") { return { response: "companyId must be TMC" } }
        let renewDate = date.split("-");
        const url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${fromStn}/${toStn}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Config.MODE === "LIVE") {
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

const railSearchBwnDate = async (req, res) => {

}

module.exports = { getRailSearch, railSearchBwnDate }
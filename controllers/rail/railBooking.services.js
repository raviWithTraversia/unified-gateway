const axios = require('axios');

const getRailSearch = async (req, res) => {
    try {
        const { from, to, date/*, quota, class */ } = req.body;
        if (!from, !to, !date) { return { response: "Provide required fields" } };
        let renewDate = date.split("-");
        const url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${from}/${to}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
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
        console.error(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

module.exports = { getRailSearch }
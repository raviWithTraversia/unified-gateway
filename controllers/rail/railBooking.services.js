const axios = require('axios');
const { Config } = require("../../configs/config");
const trainStation=require('../../models/TrainStation');
const { response } = require('../../routes/railRoute');
const getRailSearch = async (req, res) => {
    try {
        const { from, to, date/*, quota, class */ } = req.body;
        if (!from, !to, !date) { return { response: "Provide required fields" } };
        let renewDate = date.split("-");
        const url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${from}/${to}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Config.MODE === "LIVE") {
            url = `http://43.205.65.20:8000/eticketing/webservices/taenqservices/tatwnstns/${from}/${to}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
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
        console.error(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}

const getTrainStation=async(req,res)=>{
    try{
        const { StationCode, StationName, Location } = req.body; 
    if(!StationCode&&!StationName&&!Location){
        return {
response:"Station Code and StationName not found"
        }
    }
else{
    let orConditions = [];
    if (StationCode) {
      orConditions.push({ StationCode: new RegExp(StationCode, 'i') });
    }
    if (StationName) {
      orConditions.push({ StationName: new RegExp(StationName, 'i') });
    }
    if (Location) {
      orConditions.push({ Location: new RegExp(Location, 'i') });
    }

    let query = {};
    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const findTrainStation = await trainStation.find(query);

    if(findTrainStation.length>0){
        return {
            response:"Station(s) found successfully",
            data:findTrainStation
        }
    }
}

    }catch(error){
        console.error(error);
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        );
    }
}


module.exports = { getRailSearch ,getTrainStation}
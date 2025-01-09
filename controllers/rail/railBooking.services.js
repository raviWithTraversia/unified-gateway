const axios = require('axios');
const { Config } = require("../../configs/config");
const trainStation=require('../../models/TrainStation');
const { response } = require('../../routes/railRoute');
const getRailSearch = async (req, res) => {
    try {
        const { from, to, date/*, quota, class */ } = req.body;
        if (!from, !to, !date) { return { response: "Provide required fields" } };
        let renewDate = date.split("-");
        const url = `${Config.TEST.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/tatwnstns/${from}/${to}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        const auth = 'Basic V05FUFRQTDAwMDAwOlRlc3Rpbmcx';
        if (Config.MODE === "LIVE") {
            url = `${Config.LIVE.IRCTC_BASE_URL}/eticketing/webservices/taenqservices/tatwnstns/${from}/${to}/${renewDate[0]}${renewDate[1]}${renewDate[2]}`;
        }
        const response = (await axios.get(url, { headers: { 'Authorization': auth } }))?.data;
        if (!response?.trainBtwnStnsList?.length) {
            return {
                response: "No Response from Irctc",
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
        const { Station} = req.body; 
    if(!Station){
        return {
response:"Station Code and StationName not found"
        }
    }
else{
    let orConditions = [];
    if (Station) {
      orConditions.push({ StationCode: new RegExp(`^${Station}`, 'i') },{stationName:new RegExp(`^${Station}`, 'i')});
    }
   

    let query = {};
    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const findTrainStation = await trainStation.find(query)

    if(findTrainStation.length>0){
        return {
            response:"Station(s) found successfully",
            data:findTrainStation
        }
    }
}

    }catch(error){
        console.error(error);
        throw error;
    }
}


const createTrainStation = async (req, res) => {
    try {
        const { StationCode, StationName, Location, CountryCode } = req.body;

        if (!StationCode || !StationName || !Location || !CountryCode) {
            return {
                response: "Provide required fields",
            };
        }
        const trainStationS = new trainStation(req.body);
        await trainStationS.save();
        return {
            response: "Train Station Added Successfully",
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateTrainStation = async (req, res) => {
    try {
        console.log(req.query)
        const id=req.query.id;
        if(!id){
            return {
                response:"id not found"
            }
        }
        const trainStationS = await trainStation.findByIdAndUpdate(id,req.body,{new:true});
        if(!trainStationS){
            return {
                response:"Train Station not found"
            }
        }
        return {
            response:"Train Station Updated Successfully",
        }

}catch(error){
    console.error(error);
    throw error;
}
}
module.exports = { getRailSearch ,getTrainStation,createTrainStation,updateTrainStation}
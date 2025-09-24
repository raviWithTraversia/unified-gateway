const axios = require("axios");
const getFixedFareService=async(req,res)=>{
    try{
        let payloadDate=dateDecorate(new Date().toISOString(),true);
      let Url = "";
    let  payload = {
    "P_TYPE": "CC",
    "R_TYPE": "FLIGHT",
    "R_NAME": "FFMongoRetriveCC",
    "R_DATA": {
        "Fcode": "",
        "Fno": "",
        "FromDdate": payloadDate.fromDate??"",
        "ToDdate": payloadDate.toDate??"",
        "Src": "",
        "Des": ""
    },
    "AID": "18785869",
    "MODULE": "B2B",
    "IP": "182.73.146.154",
    "TOKEN": "a27f1a2a786d453856c7e058da09bdfa",
    "ENV": "D",
    "Version": "1.0.0.0.0.0"
};
    if (
      req.headers.host == "localhost:3111"
    ) {
      Url = "https://mongo.ksofttechnology.com/api/Freport";
      
    } else if (req.headers.host == "agentapi.kafilaholidays.in"||req.headers.host == "kafila.traversia.net") {
      Url = "https://busy.ksofttechnology.com/api/FReport";
      payload.ENV = "P";

    } else {
      return {
        response: "url not found",
      };
    }

    const response = await axios.post(Url, payload);
    if(!response?.data){
        return {
            response:"Data Not Found"
        }
    }
    const fixedFareData=  decorateFF(response.data)
    if(!fixedFareData){
        return {
            response:"Data Not Found",
            data:[]
        }
    }
    return {
        response:"fixed Fare Details found sucessfully",
        data:fixedFareData
    }


    }catch(error){
        throw error
    }
    
}



 function decorateFF(data) {
  if (!data?.Result) return [];

  const groupMap = new Map();

  data.Result.filter(ele => ele.SeatA > 0).forEach(ele => {
    const srcDes = `${ele.Src}-${ele.Des}`;
    const availableDate = dateDecorate(ele?.Ddate);

    if (!groupMap.has(srcDes)) {
      groupMap.set(srcDes, {
        AvailableDates: [availableDate], // array instead of string
        Destination: ele.Des,
        MaxTravelDate: null,
        Origin: ele.Src
      });
    } else {
      const existing = groupMap.get(srcDes);
      existing.AvailableDates.push(availableDate);
    //   existing.MaxTravelDate = new Date(Math.max(
        // existing.MaxTravelDate,
        // new Date(ele.Ddate)
    //   ));
    }
  });

  return [...groupMap.values()].map(obj => ({
    ...obj,
    AvailableDates: obj.AvailableDates.join(",") // convert to string if needed
  }));
}


function dateDecorate(date,isPayload=false) {
    try{

    const dateArray = date.split("T")[0].split("-")
    const year = dateArray[0];
    const month = dateArray[1];
    const day = dateArray[2];
    if(!isPayload){
        return `${day}/${month}/${year}`;
    }else{
        return {fromDate:`${year}-${month}-${day}`,toDate:`${Number(year)+4}-${month}-${day}`}
    }
  }
  catch(e){
    throw e
  }
}
module.exports={
    getFixedFareService
}
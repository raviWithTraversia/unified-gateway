const seriesDepartureModel = require("../../models/SeriesDeparture");
const seriesDepartureCounter = require("../../models/seriesDepartureCounter");
const seriesDepartureGroupServices = require("../seriesDepartureGroup/seriesDepartureGroup.services");
const xlsx = require("xlsx");
const addFixedDepartureTicket = async (req, res) => {
  try {
    if (req.file) {
      let { userId, companyId,groupId} = req.body;
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const options = {
        sheet: sheetName,
        header: 1, 
        blankrows: true,
      };
      let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],options);
     const result = data.slice(1).map(row => {
      const obj = {};
      data[0].forEach((key, index) => {
        if(row[index] == undefined){
          obj[key] = null
        }else if(key == "ISREFUNDABLE" || key == "ISACTIVE" || key == "AUTOTICKETING"){
          if(row[index] == 1){
            row[index] = true
          }else{
            row[index] = false
          }
          obj[key] = row[index]
        }
        else{
        obj[key] = row[index] ;
        }
      });
      return obj;
    });
    data = result
      data = changeArrKeys(data);
   ///  data = transformDataF(data);
      console.log("==========>data1", data);
      data = transformData(data, companyId, userId,groupId);
      //console.log("==========>data2", data);
      let seriesCounter = await seriesDepartureCounter.findOne();
      seriesCounter = seriesCounter.counter;
      for(let i = 0; i < data.length; i++){
        seriesCounter = seriesCounter;
        data[i].seriesId =`SE00${seriesCounter}`;
        data[i].status = 'Pending';
        data[i].autoTicketing = false;
      };
      req.body.count = data.length

      await seriesDepartureGroupServices.updatedSeriesDepartureGroup(req)
      let updateCounter = await seriesDepartureCounter.findOneAndUpdate({_id :seriesCounter._id ,counter : seriesCounter })
      try {
        let newFlightTicket = await seriesDepartureModel.insertMany(data, {
          ordered: false,
          maxTimeMS: 3000,
        });
        return {
          response: "Ticket Data Insert Successfully",
          data: newFlightTicket,
        };
      } catch (error) {
        if (error.code === 11000) {
          const duplicateKey = error.keyPattern
            ? Object.keys(error.keyPattern)
            : null;
          return {
            response: duplicateKey
              ? `Duplicate key error. The "${duplicateKey}" field must have unique values.`
              : "Duplicate key error. Unique values must be enforced.",
            data: [],
          };
        } else {
          return {
            response: "An error occurred during insertion.",
            data: [],
          };
        }
      }
    } else {
      let seriesCounter = await seriesDepartureCounter.findOne();
      seriesCounter = seriesCounter.counter + 1;
      seriesId =`SE00${seriesCounter}`;
      req.body.seriesId = seriesId;
      const newFlightData = new seriesDepartureModel(req.body);
      const savedData = await newFlightData.save();
      req.body.count = 1;
      await seriesDepartureGroupServices.updatedSeriesDepartureGroup(req)
      if(savedData){
        return {
          response : "Ticket Data Insert Successfully",
          data : savedData 
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
function changeArrKeys(arr) {
  const newArr = [];
  for (const item of arr) {
    const newItem = {};
    for (const [key, value] of Object.entries(item)) {
      const newKey = key.toLowerCase().replace(/ /g, "_");
      newItem[newKey] = value;
    }
    newArr.push(newItem);
  }
  return newArr;
};
function transformData(input, companyId, userId,groupId) {
  const output = [];
  const groupedByPnr = input.reduce((acc, item) => {
    if (!acc[item.pnr]) {
      acc[item.pnr] = { ...item, flights: [], baggage: [], 
      meal: [], };
    }
    for (let i = 0; ; i++) {
     // console.log(i);
      const airlineCodeProp = `airline_code_${i}`;
      if (!item[airlineCodeProp]) {
        break;
      }
      const baggageInfo = {
        name: item[`baggage_name_${i}`] || null,
        charge: item[`baggage_charge_${i}`] || null,
      };
      const mealInfo = {
        name: item[`meal_${i}`] || null,
        charge: item[`meal_charge_${i}`] || null,
      };
      const flightInfo = {
        airline_code: item[airlineCodeProp] || null,
        boundtype: item[`boundtype_${i}`] || null,
        flightnumber: item[`flightnumber_${i}`] || null,
        origin: item[`origin_${i}`] || null,
        oterm: item[`oterm_${i}`] || null,
        destination: item[`destination_${i}`] || null,
        dterm: item[`dterm_${i}`] || null,
        departuredate: item[`departuredate_${i}`] || null,
        departuretime: item[`departuretime_${i}`] || null,
        arrivaldate: item[`arrivaldate_${i}`] || null,
        arrivaltime: item[`arrivaltime_${i}`] || null,
        flyingtime: item[`flyingtime_${i}`] || null,
        distance: item[`distance_${i}`] || null,
      };
    //  console.log("====>>>",baggageInfo)
      acc[item.pnr].companyId = companyId;
      acc[item.pnr].userId = userId;
      acc[item.pnr].flights.push(flightInfo);
      acc[item.pnr].groupId = groupId;
      acc[item.pnr].baggage.push(baggageInfo);
      acc[item.pnr].meal.push(mealInfo)
    }
  //  console.log("===>>>", acc)
    return acc;
  }, {});
  for (const pnr in groupedByPnr) {
    output.push(groupedByPnr[pnr]);
  }
  return output;
};
const getFixedDepartureTicket = async (req, res) => {
  try {
    let { groupId } = req.query;
    let ticketDetail = await seriesDepartureModel
      .find({ groupId })
      .populate("userId companyId");
    if (ticketDetail.length > 0) {
      return {
        response: "Ticket Detail Found Sucessfully",
        data: ticketDetail,
      };
    }
    return {
      response: "Ticket Data Not Found",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateFixedDepartureTicket = async (req, res) => {
  try {
    let id = req.query.id;
    const updates = req.body;
    if (!updates.pnr || !updates.airline_code) {
      return {
        response: "Missing required fields",
      }
    }
    const updatedSeriesDeparture = await seriesDepartureModel.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
      }
    );
    if (!updatedSeriesDeparture) {
      return {
        response: "Series departure not found",
      };
    }
    return {
      response: "Series departure updated successfully",
      data: updatedSeriesDeparture,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  addFixedDepartureTicket,
  getFixedDepartureTicket,
  updateFixedDepartureTicket
};

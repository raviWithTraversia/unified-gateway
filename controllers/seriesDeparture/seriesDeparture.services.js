const seriesDepartureModel = require("../../models/SeriesDeparture");
const seriesDepartureCounter = require("../../models/seriesDepartureCounter");
const seriesDepartureGroupServices = require("../seriesDepartureGroup/seriesDepartureGroup.services");
const xlsx = require("xlsx");
const mongoose = require('mongoose');
const addFixedDepartureTicket = async (req, res) => {
  try {
    if (req.file) {
      let { userId, companyId,groupId} = req.body;
        companyId = new mongoose.Types.ObjectId(companyId);
        userId = new mongoose.Types.ObjectId(userId);
        console.log(typeof companyId);
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
      data = transformFlightData(data);
      console.log(data);
      return {
        response: "Ticket Data Insert Successfully",
        data: data,
      };
      return;
      let seriesCounter = await seriesDepartureCounter.findOne();
      seriesCounter = seriesCounter.counter;
      for(let i = 0; i < data.length; i++){
        seriesCounter = seriesCounter +1;
        data[i].seriesId =`SE00${seriesCounter}`;
        data[i].status = 'Pending';
        data[i].autoTicketing = false;
        data[i].companyId = companyId;
        data[i].userId = userId
            };
     req.body.count = data.length
     let updateCounterInGroup= await seriesDepartureGroupServices.updatedSeriesDepartureGroup(req);
      let updateCounter = await seriesDepartureCounter.findOneAndUpdate({_id :seriesCounter._id ,counter : seriesCounter });
   //  console.log(data);
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
function transformFlightData(request) {
  let transformedResponse = [];

  request.forEach((item) => {
      let flightItem = {
          pnr: item.pnr,
          account_code: item.account_code,
          flight_type: item.flight_type,
          cabin_class: item.cabin_class,
          trip_type: item.trip_type,
          fare_name: item.fare_name,
          aircraft_type: item.aircraft_type,
          airline_code: item.airline_code,
          flight_number: item.flight_number,
          origin_airport_code: item.origin_airport_code,
          origin_airport_terminal: item.origin_airport_terminal,
          destination_airport_code: item.destination_airport_code,
          destination_airport_terminal: item.destination_airport_terminal,
          departure_date: convertToDate(item.departure_date),
          departure_time: item.departure_time,
          arrival_date: convertToDate(item.arrival_date),
          arrival_time: item.arrival_time,
          distance: item.distance,
          travel_time: item.travel_time,
          stops: item.stops,
          total_seats: item.total_seats,
          available_seats: item.available_seats,
          rbd: item.rbd,
          baseamount: item.baseamount,
          fuelsurchg: item.fuelsurchg,
          taxamount: item.taxamount,
          baseamountchd: item.baseamountchd,
          fuelsurchgchd: item.fuelsurchgchd,
          taxamountchd: item.taxamountchd,
          baseamountinf: item.baseamountinf,
          fuelsurchginf: item.fuelsurchginf,
          taxamountinf: item.taxamountinf,
          carryonallowance: item.carryonallowance,
          baggageallowance: item.baggageallowance,
          isrefundable: item.isrefundable,
          cancelpenalty: item.cancelpenalty,
          changepenalty: item.changepenalty,
          isactive: item.isactive,
          baseamountcost: item.baseamountcost,
          fuelsurchgcost: item.fuelsurchgcost,
          taxamountcost: item.taxamountcost,
          baseamountchdcost: item.baseamountchdcost,
          fuelsurchgchdcost: item.fuelsurchgchdcost,
          taxamountchdcost: item.taxamountchdcost,
          baseamountinfcost: item.baseamountinfcost,
          fuelsurchginfcost: item.fuelsurchginfcost,
          taxamountinfcost: item.taxamountinfcost,
          flights: [],
          baggage: [],
          meal: [],
          companyId: item.companyId,
          userId: item.userId,
          groupId: item.groupId,
          seriesId: item.seriesId,
          status: item.status,
          autoTicketing: item.autoTicketing
      };

      // Process flights
      for (let i = 0; i < 6; i++) {
          if (item[`airline_code_${i}`]) {
              flightItem.flights.push({
                  airline_code: item[`airline_code_${i}`],
                  boundtype: item[`boundtype_${i}`],
                  flightnumber: item[`flightnumber_${i}`],
                  origin: item[`origin_${i}`],
                  oterm: item[`oterm_${i}`],
                  destination: item[`destination_${i}`],
                  dterm: item[`dterm_${i}`],
                  departuredate: convertToDate(item[`departuredate_${i}`]),
                  departuretime: item[`departuretime_${i}`],
                  arrivaldate: convertToDate(item[`arrivaldate_${i}`]),
                  arrivaltime: item[`arrivaltime_${i}`],
                  flyingtime: item[`flyingtime_${i}`],
                  distance: item[`distance_${i}`],
                  rbd: item.rbd,
                  carryonallowance: item.carryonallowance,
                  baggageallowance: item.baggageallowance
              });
          }
      }

      // Process baggage
      for (let i = 0; i < 6; i++) {
          if (item[`baggage_name_${i}`]) {
              flightItem.baggage.push({
                  name: item[`baggage_name_${i}`],
                  charge: item[`baggage_charge_${i}`]
              });
          }
      }

      // Process meal
      for (let i = 0; i < 6; i++) {
          if (item[`meal_${i}`]) {
              flightItem.meal.push({
                  name: item[`meal_${i}`],
                  charge: item[`meal_charge_${i}`]
              });
          }
      }

      transformedResponse.push(flightItem);
  });

  return transformedResponse;
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
    // if(req.body.flights || req.body.baggage || req.body.meal){
    //   let updatedSeriesDepartureData = await seriesDepartureModel.findById(id);
    //   let createSeriesDepartureData = {

    //   }
    // }
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
      data: updatedSeriesDeparture
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
function convertToDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(`${month}/${day}/${year}`);
};
module.exports = {
  addFixedDepartureTicket,
  getFixedDepartureTicket,
  updateFixedDepartureTicket
};

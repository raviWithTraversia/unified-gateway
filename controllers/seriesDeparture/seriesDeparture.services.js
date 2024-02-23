const seriesDepartureModel = require('../../models/SeriesDeparture');
const xlsx = require('xlsx');

const addFixedDepartureTicket = async (req,res) => {
    try{
  
    if(req.file){
      let {userId, companyId} = req.body;
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
       data = changeArrKeys(data)
       data = transformData(data, companyId,userId)
       console.log(data);
     
      try {
        let newFlightTicket = await seriesDepartureModel.insertMany(data);
        return {
          response: 'Ticket Data Insert Successfully',
          data: newFlightTicket
        };
      } catch (error) {
        if (error.code === 11000) {
          return {
            response: 'Duplicate key error. Ensure unique values for the "pnr" field.',
            data: []
          };
        } else {
          return {
            response: 'An error occurred during insertion.',
            data: []
          };
        }
      }

    }else{
      let documents = {...req.body}
      let newFlightTicket =  new seriesDepartureModel(req.body);
      newFlightTicket = await newFlightTicket.save();
    if(newFlightTicket){
        return {
            response : 'Ticket Data Insert Sucessfully',
            data : newFlightTicket
        }
    }else{
      return {
        response : 'Ticket Data Not Insert',
        data : []
      }
    }

    }

    }catch(error){
      console.log(error);
      throw error
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
function transformData(input, companyId, userId) {
  const output = [];

  
  const groupedByPnr = input.reduce((acc, item) => {
    if (!acc[item.pnr]) {
      acc[item.pnr] = { ...item, flights: [] };
    }

    for (let i = 0; ; i++) {
      const airlineCodeProp = `airline_code_${i}`;
      if (!item[airlineCodeProp]) {
        break; 
      }
      const flightInfo = {
        airline_code: item[airlineCodeProp],
        boundtype: item[`boundtype_${i}`],
        flightnumber: item[`flightnumber_${i}`],
        origin: item[`origin_${i}`],
        oterm: item[`oterm_${i}`],
        destination: item[`destination_${i}`],
        dterm: item[`dterm_${i}`],
        departuredate: item[`departuredate_${i}`],
        departuretime: item[`departuretime_${i}`],
        arrivaldate: item[`arrivaldate_${i}`],
        arrivaltime: item[`arrivaltime_${i}`],
        flyingtime: item[`flyingtime_${i}`],
        distance: item[`distance_${i}`],
        baggage: { name: item[`baggage_name_${i}`], charge: item[`baggage_charge_${i}`] },
        meal: item[`meal_${i}`]
      };
      acc[item.pnr].companyId = companyId;
      acc[item.pnr].userId  = userId;
      acc[item.pnr].flights.push(flightInfo);
    }

    return acc;
  }, {});

  for (const pnr in groupedByPnr) {
    output.push(groupedByPnr[pnr]);
  }

  return output;
};

const getFixedDepartureTicket = async (req,res) => {
  try{
    let {userId} = req.query;
    let ticketDetail = await seriesDepartureModel.find({userId}).populate('userId companyId');
    if(ticketDetail.length > 0){
     return {
      response : "Ticket Detail Found Sucessfully",
      data : ticketDetail
     }
    }
    return{
      response : 'Ticket Data Not Found'
    }
  }catch(error){
     console.log(error);
     throw error
  }
};

const updateFixedDepartureTicket = async (req,res) => {
  try{
  let id = req.query.id;
  const updates = req.body;

  if (!updates.pnr || !updates.airline_code) {
    return  {
     response : 'Missing required fields' 
  }
}

  const updatedSeriesDeparture = await seriesDepartureModel.findByIdAndUpdate(id, updates, {
    new: true 
  });

  if (!updatedSeriesDeparture) {
    return{
     response :'Series departure not found' 
    }
  }
  return {
    response : 'Series departure updated successfully',
    data: updatedSeriesDeparture
  }
 
  }catch(error){
    console.log(error);
    throw error
  }
}

module.exports = {
    addFixedDepartureTicket,
    getFixedDepartureTicket,
    updateFixedDepartureTicket
}
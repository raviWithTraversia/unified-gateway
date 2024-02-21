const seriesDepartureModel = require('../../models/SeriesDeparture');
const xlsx = require('xlsx');

const addFixedDepartureTicket = async (req,res) => {
    try{
    if(req.file){
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
       // console.log("[[[[[[[[[===>>" , data, "<<<====]]]]]]]]]]]]]]]]]]]]");

        for(let i = 0; i < data.length; i++){
                
        }
     // console.log("====>>", data,)
 
        return {
            response : 'Ticket Data Insert Sucessfully'
        }
        await seriesDepartureModel.create(data);

    }else{
        const {
            userId,
            companyId,
            pnr,
            accountCode,
            flightType,
            cabinClass,
            tripType,
            fareName,
            aircraftType,
            airLineCode,
            flightNumber,
            originAirportCode,
            originAirportTerminal,
            destinationAirportCode,
            destinationAirportTerminal,
            departureDate,
            departureTime,
            arrivalDate,
            arrivaltime,
            Distance,
            travelTime,
            stops,
            totalSeats,
            availableSeats,
            rbd,
            baseAmount,
            fuleSurcharge,
            taxAmount,
            baseAmountChd,
            fuleSurchargeChd,
            taxAmountChd,
            baseAmountInf,
            fuleSurchargeInf,
            taxAmountInf,
            carryOnAllowance,
            baggageAllowance,
            isRefundable,
            canclePenalty,
            changePenalty,
            isActive,
            baseAmountConst,
            fuleSurchargeConst,
            taxAmountConst,
            baseAmountChildConst,
            fuleSurchargeChildConst,
            taxAmountChildConst,
            baseAmountInftConst,
            fuleSurchargeInftConst,
            taxAmountInftConst,
            airLineDetails
          } = req.body; 
    let fixedDepartureTicketDetail = new seriesDepartureModel({
        userId,
        companyId,
        pnr,
        accountCode,
        flightType,
        cabinClass,
        tripType,
        fareName,
        aircraftType,
        airLineCode,
        flightNumber,
        originAirportCode,
        originAirportTerminal,
        destinationAirportCode,
        destinationAirportTerminal,
        departureDate,
        departureTime,
        arrivalDate,
        arrivaltime,
        Distance,
        travelTime,
        stops,
        totalSeats,
        availableSeats,
        rbd,
        baseAmount,
        fuleSurcharge,
        taxAmount,
        baseAmountChd,
        fuleSurchargeChd,
        taxAmountChd,
        baseAmountInf,
        fuleSurchargeInf,
        taxAmountInf,
        carryOnAllowance,
        baggageAllowance,
        isRefundable,
        canclePenalty,
        changePenalty,
        isActive,
        baseAmountConst,
        fuleSurchargeConst,
        taxAmountConst,
        baseAmountChildConst,
        fuleSurchargeChildConst,
        taxAmountChildConst,
        baseAmountInftConst,
        fuleSurchargeInftConst,
        taxAmountInftConst,
        airLineDetails
    });
    fixedDepartureTicketDetail = await fixedDepartureTicketDetail.save();
    if(fixedDepartureTicketDetail){
        return {
            response : 'Ticket Data Insert Sucessfully',
            data : fixedDepartureTicketDetail
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
const convertToCamelCase = (obj) => {
    const newObj = {};
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        newObj[camelCaseKey] = typeof obj[key] === 'object' ? convertToCamelCase(obj[key]) : obj[key];
      }
    }
  
    return newObj;
  };
  
module.exports = {
    addFixedDepartureTicket 
}
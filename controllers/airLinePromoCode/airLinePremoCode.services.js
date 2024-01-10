const airLinePromo = require('../../models/AirlinePromoCode');
const FUNC = require('../commonFunctions/common.function');

const addAirlinePromoCode = async (req,res) => {
    try{
    let { companyId, supplierCode, airLineCode,fareFamily,premoCode,displayName,type } = req.body;
    let checkIsValidCompanyId = FUNC.checkIsValidId(companyId); 
    if(checkIsValidCompanyId ==  'Invalid Mongo Object Id'){
        return{
            response : 'Invalid Mongo Object Id'
        }
    }
    let insertAirlinePromoCode = new airLinePromo({
        companyId, 
        supplierCode,
        airLineCode,
        fareFamily,
        premoCode,
        displayName,
        type
    }) ;
    insertAirlinePromoCode = await insertAirlinePromoCode.save();
    if(insertAirlinePromoCode){
        return {
            response : 'Airline PromoCode added sucessfully',
            data : insertAirlinePromoCode
        }
    }
    else{
        return {
            response : 'Airline PromoCode Not Added'
        }
    }

    }catch(error){
        console.log(error);
        throw error
    }
};

const editAirlinePromoCode = async (req,res) => {
    try{
       let id = req.query.id;
       let data = req.body;
      let checkIsValidId = FUNC.checkIsValidId(id); 
      if(checkIsValidId == 'Invalid Mongo Object Id'){
         return {
            response : 'Invalid Mongo Object Id'
         }
      }

       const updatedPromoCodeData = await airLinePromo.findByIdAndUpdate(
         id,
        { $set: data },
        { new: true }
      );
      if(updatedPromoCodeData){
         return {
            response : 'AirLine PromoCode Data Updated Sucessfully'
         }
    }
    else{
      return {
        response : 'AirLine PromoCode Data Not Updated'
      }  

    }
   }catch(error){
        console.log(error);
        throw error
    }
};

const getPromoCode = async (req,res) => {
    try{
    let id = req.query.companyId;
    let checkIsValidId = FUNC.checkIsValidId(id); 
    if(checkIsValidId == 'Invalid Mongo Object Id'){
       return {
          response : 'Invalid Mongo Object Id'
       }
    }
    let airlinePromoCodeData;
    airlinePromoCodeData = await airLinePromo.find({companyId : id}).populate('supplierCode')
    .populate('airLineCode')
    .populate('fareFamily');
   
   // console.log(airlinePromoCodeData)
    if(airlinePromoCodeData){
        return{
            response : "Data Fetch Sucessfully",
            data : airlinePromoCodeData
        }
    }else{
        return {
            response : 'No Airline Promo Data Found'
        }
    }

    }catch(error){
        console.log(error);
        throw error
    }
}
const deletePromoCode = async(req,res) => {
    try{
    let airLinePromoCodeId = req.query.id;
    let checkIsValidId = FUNC.checkIsValidId(airLinePromoCodeId); 
    if(checkIsValidId == 'Invalid Mongo Object Id'){
       return {
          response : 'Invalid Mongo Object Id'
       }
    };
    let deletedPromoCode = await airLinePromo.findByIdAndDelete(airLinePromoCodeId);

        if (deletedPromoCode) {
           return{
            response : "Promo Code deleted Sucessfully",
           }
        }
        else{
            return {
                response : "Promo Code Not Found"
            }
        }
    }catch(error){
        console.log(error);
        throw error
    }
}

module.exports = {
    addAirlinePromoCode ,
    editAirlinePromoCode,
    getPromoCode,
    deletePromoCode
}
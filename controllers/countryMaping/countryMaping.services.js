const countryMapSchema = require('../../models/CountryMapping');

const addCountryMaping = async (req,res) => {
        try {
           
            const { countries, continentCode , companyId } = req.body;
            const newCountryMapping = new countryMapSchema({
              countries,
              continentCode,
              modifyBy : req?.user?._id || null,
              companyId
            });
        
            const result = await newCountryMapping.save(); 
            return {
                response : "Data Add Sucessfully",
                data : result
            }

    }catch(error){
        console.log(error)
      throw error
    }
};
const getCountryMaping = async (req,res) => {
    try{
      let companyId = req.query.id;
      let countryMapingData = await countryMapSchema.find({companyId : companyId}) ;
      if(countryMapingData.length > 0){
        return {
            response : 'Data Found Sucessfully',
            data : countryMapingData
        }
      }else{
        return {
            response : 'Data Not Found'
        }
      }
    }catch(error){
        console.log(error);
        throw error
    }
};
const editCountryMaping = async (req,res) => {
    try{
    let id = req.query.id;
    let dataForUpdate = {
        ...req.body
    };
    
    let updateCountryMaping = await countryMapSchema.findByIdAndUpdate(
        id,
        {
          $set: dataForUpdate,
          modifyBy: req?.user?._id || null,
        },
        { new: true } 
      );
    if(updateCountryMaping){
        return{
            response  : 'Data Update Sucessfully',
            data : [updateCountryMaping]
        }
    }else{
        return {
            response : 'Data Not Updated'
        }
    }
    }catch(error){
        console.log(error);
        throw error
    }
};
const deleteCountryMaping = async (req,res) => {
    try{
    const id = req.query.id;
    let deletCountryMapindData = await countryMapSchema.findByIdAndDelete(id);
    if(deletCountryMapindData){
        return {
            response : 'Data Deleted Sucessfully',
            data : []
        }
    }else{
        return {
            response : 'Data For This Id Is Not Found'
        }
    }

    }catch(error){
        throw error
        console.log(error)
    }
};
module.exports = {
    addCountryMaping,
    getCountryMaping,
    deleteCountryMaping,
    editCountryMaping
}
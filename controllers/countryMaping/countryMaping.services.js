const countryMapSchema = require('../../models/CountryMapping');

const addCountryMaping = async (req,res) => {
        try {
           
            const { countries, ContinentCode } = req.body;
        
            const newCountryMapping = new countryMapSchema({
              countries,
              ContinentCode,
              modifyBy : req?.user?._id || null,
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
module.exports = {
    addCountryMaping 
}
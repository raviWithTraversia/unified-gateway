const countryDialCodeModel = require('../../models/CountryDialCode');

const getCountryDialCode = async (req,res) => {
    try{
        const result = await countryDialCodeModel.find();
       // console.log("=========>", result)
        result.sort((a, b) => {
            const countryA = a.name.toUpperCase(); 
            const countryB = b.name.toUpperCase();
        
            if (countryA < countryB) {
                return -1; 
            } else if (countryA > countryB) {
                return 1; 
            } else {
                return 0;
            }
        });
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Country not available',
                data: null
            }
        }


    }catch(error){

    }
};
module.exports = {
    getCountryDialCode  
}
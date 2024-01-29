const countryMapServices = require('./countryMaping.services');
const { apiSucessRes, apiErrorres } = require('../../utils/commonResponce');
const { ServerStatusCode, errorResponse, CrudMessage } = require('../../utils/constants');

const addCountryMaping = async(req, res) => {
    try {
        const result = await countryMapServices.addCountryMaping(req,res);
        if(result.response == "Data Add Sucessfully"){
            apiSucessRes(
                res,
                result.response,
                result.data,
                ServerStatusCode.SUCESS_CODE
            )
        }
        
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
};

const getCountryMaping = async (req,res) => {
    try{
    let result = await countryMapServices.getCountryMaping(req,res);
    if(result.response == 'Data Found Sucessfully'){
        apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
        )
    }else if(result.response == 'Data Not Found'){
       apiErrorres(
        res,
        result.response,
        ServerStatusCode.RESOURCE_NOT_FOUND,
        true
       )
    }

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true
        )
    }
}


module.exports = {addCountryMaping,
    getCountryMaping}
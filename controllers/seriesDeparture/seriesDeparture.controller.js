const seriesDepartureServices = require('./seriesDeparture.services');
const {apiSucessRes , apiErrorres} = require('../../utils/commonResponce');
const {ServerStatusCode, errorResponse, ADMIN_USER_TYPE, CrudMessage}  = require('../../utils/constants');

const addFixedDepartureTicket = async (req,res) => {
    try {
    const result = await seriesDepartureServices.addFixedDepartureTicket(req,res);

    }catch(error){
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true 
            )
    }
};
module.exports = {
    addFixedDepartureTicket 
}

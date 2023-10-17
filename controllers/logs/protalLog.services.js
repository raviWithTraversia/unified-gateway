const PortalLog = require('../../models/Logs/PortalApiLogs');

const addPortalLog = async(req , res) => {
    try {
        const {traceId , companyId , source , product , request , responce} = req.body
        
        if(!companyId) {
            return {
                responce : 'companyId fields are required'
            }
        }

        const newPortalLog = new PortalLog({
            traceId,
            companyId,
            source,
            product,
            request,
            responce
        });
        const storeLogs = await newPortalLog.save();
        return {
            response: 'Portal Log added successfully'
        }
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}


const getPortalLog = async(req , res) => {

    try {
        const traceIdToFind = req.params.traceId;

        const logs = await PortalLog.find({traceId : traceIdToFind});
        if(logs.length > 0) {
            return {
                data: logs
            }
        }else {
            return {
                response: 'Portal Log Not Found',
                data: null
            }
        }
        
    } catch (error) {
        apiErrorres(
            res,
            errorResponse.SOMETHING_WRONG,
            ServerStatusCode.SERVER_ERROR,
            true)
    }
}

module.exports = {addPortalLog , getPortalLog}
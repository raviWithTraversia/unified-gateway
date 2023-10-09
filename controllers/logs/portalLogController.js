const  PortalLog = require('../../models/Logs/PortalApiLogs');


const storePortalLog =  async(req , res) => {
    try {

        const {traceId , companyId , source , product , request , responce} = req.body
        
        if(!companyId) {
            return res.status(400).json({ success: false, msg: "CompanyId fields are required", data: null });
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
        return res.status(200).json({ success: true, msg: "Portal Log Save Successfully!", data: null });

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }
}

const  retrivePortalLog = async(req ,res) => {

    try {
        const traceIdToFind = req.params.traceId;

        const logs = await PortalLog.find({traceId : traceIdToFind});
        if(logs) {
            return res.status(200).json({ success: true, data: logs }); 
        }else {
            return res.status(200).json({ success: true, msg: "Portal Log Not Found" , data: null }); 
        }

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, 
            data: null });
    }
}

module.exports = {storePortalLog , retrivePortalLog}
const  EventLog = require('../../models/Logs/EventLogs');


const storeEventLog =  async(req , res) => {
    try {

        const {eventName , doerId , doerName , ipAddress , companyId} = req.body
        
        if(!companyId) {
            return res.status(400).json({ success: false, msg: "CompanyId fields are required", data: null });
        }

        const newEventLog = new EventLog({
            eventName,
            doerId,
            doerName,
            ipAddress,
            companyId
        });
        const storeLogs = await newEventLog.save();
        return res.status(200).json({ success: true, msg: "Event Log Save Successfully!", data:null });

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }
}

const  retriveEventLogByCompanyId = async(req ,res) => {

    try {
        const companyIdToFind = req.params.companyId;

        const logs = await EventLog.find({companyId : companyIdToFind});
        if(logs) {
            return res.status(200).json({ success: true, data: logs }); 
        }else {
            return res.status(200).json({ success: true, msg: "Event Log Not Found" , data: null }); 
        }

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, 
            data: null });
    }
}

module.exports = {storeEventLog , retriveEventLogByCompanyId}
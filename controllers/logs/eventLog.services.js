const EventLog = require("../../models/Logs/EventLogs");

const addEventLog = async (req, res) => {

    try {
        const { eventName, doerId, doerName, ipAddress, companyId } = req.body
        if (!companyId) {
            return {
                response: 'CompanyId fields are required'
            }
        }

        const newEventLog = new EventLog({
            eventName,
            doerId,
            doerName,
            ipAddress,
            companyId
        });
        const storeLogs = await newEventLog.save();
        return {
            response: 'Event Log added successfully'
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const retriveEventLog = async (req, res) => {
    try {
        const companyIdToFind = req.params.companyId;

        const logs = await EventLog.find({ companyId: companyIdToFind });
        if (logs.length > 0) {
            return {
                data: logs
            }
        } else {
            return {
                response: 'Event Log Not Found',
                data: null
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getEventLog = async (req, res) => {
    try {
        const { companyId } = req.query;
        if ( !companyId) {
            return {
                response: "Either companyId does not exist",
            };
        }
        const getEventLogs = await EventLog.find({
            $and: [
              { companyId: companyId },
              { doerId: req.user._id }
            ]
          }).populate([{ path: "doerId", select:"fname email lastName"}, { path: "companyId", select:"companyName type"}]);
          console.log(getEventLogs)
        if (!getEventLogs.length) {
            return {
                response: "Data Not Found",
            };
        }
        return {
            response: "Fetch Data Successfully",
            data: getEventLogs,
        };
    } catch (error) {
        throw error;
    }
}


const getEventlogbyid=async(req,res)=>{
    try{
        const { doucmentId } = req.query;
        if ( !doucmentId) {
            return {
                response: "Either _id does not exist",
            };
        }
        const getEventLogs = await EventLog.find({documentId:doucmentId}).populate([{ path: "doerId", select:"fname email lastName userId"}, { path: "companyId", select:"companyName type"}]);
        if (!getEventLogs) {
            return {
                response: "Data Not Found",
            };
        }
        return {
            response: "Fetch Data Successfully",
            data: getEventLogs,
        };

    }catch(error){
        console.log(error);
        throw error;
    }

}
module.exports = { addEventLog, retriveEventLog, getEventLog,getEventlogbyid }
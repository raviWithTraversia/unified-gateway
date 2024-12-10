const PortalLog = require('../../models/Logs/PortalApiLogs');
const {ObjectId}=require('mongodb')
const addPortalLog = async (req, res) => {
    try {
        const { traceId, companyId, source, product, request, responce } = req.body

        if (!companyId) {
            return {
                responce: 'companyId fields are required'
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


const getPortalLog = async (req, res) => {

    try {
        const traceIdToFind = req.params.traceId;

        const logs = await PortalLog.find({ traceId: traceIdToFind });
        if (logs.length > 0) {
            return {
                data: logs
            }
        } else {
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

const getBookingLogs = async (req, res) => {
    try {
      const { companyId, traceId, BookingId, type } = req.body;
      
      let fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15); // Get the date 5 days ago
  
      // Directly delete records older than 5 days
      await PortalLog.deleteMany({ createdAt: { $lt: fifteenDaysAgo } });
  
      if (!companyId) {
        return ({
          response: "CompanyId does not exist",
        });
      }
  
      let filter = {}
      if (BookingId) {
        filter.BookingId = BookingId;
      }
  
      if(companyId){
        filter.companyId=new ObjectId(companyId)
      }
      if(traceId){
        filter.traceId= traceId
      }
      if(type){
        filter.type=type
      }
      
    //   console.log(filter, "Filter");
      const getPortalBookingLogs = await PortalLog.find(filter);
      if (!getPortalBookingLogs.length) {
        return ({
          response: "Data Not Found",
        });
      }
  
      return ({
        response: "Fetch Data Successfully",
        data: getPortalBookingLogs,
      });
      
    } catch (error) {
      console.error("Error in getBookingLogs:", error);
      return ({
        response: "Internal Server Error",
        error: error.message,
      });
    }
  };
  

module.exports = { addPortalLog, getPortalLog, getBookingLogs }
const PortalLog = require('../../models/Logs/PortalApiLogs');

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
    const { companyId, traceId, BookingId } = req.body;
    let fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(new Date().getDate() - 5); //get 15 days before date for deleting the previous data
    const getFifteenDaysBeforeData = await PortalLog.find({ createdAt: { $lt: new Date(fifteenDaysAgo) } });
    if (getFifteenDaysBeforeData.length) {
        await PortalLog.deleteMany({ createdAt: { $lt: new Date(fifteenDaysAgo) } });
    }
    if (!companyId) {
        return {
            response: "CompanyId does not exist",
        };
    }
    const getPortalBookingLogs = await PortalLog.find({ companyId, traceId, BookingId });
    if (!getPortalBookingLogs.length) {
        return {
            response: "Data Not Found",
        };
    }
    return {
        response: "Fetch Data Successfully",
        data: getPortalBookingLogs,
    };
}

module.exports = { addPortalLog, getPortalLog, getBookingLogs }
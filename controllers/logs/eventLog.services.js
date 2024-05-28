const { ObjectId } = require("mongodb");
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

const getAgencyLog=async(req,res)=>{
    try{
        const { doucmentId } = req.query;
        if ( !doucmentId) {
            return {
                response: "Either _id does not exist",
            };
        }
       

        const getEventLogs=await EventLog.find({documentId:doucmentId}).populate([
            { path: "doerId", select:"fname email lastName userId"}, { path: "companyId", select:"companyName type"},
            { path: 'oldValue.commercialPlanId', model: 'CommercialAirPlan' ,select:"commercialPlanName modifiedDate" },
            { path: 'oldValue.plbGroupId', model: 'PLBGroupMaster', select:"PLBGroupName"},
            { path: 'oldValue.privilagePlanId', model: 'privilagePlan', select:"privilagePlanName" },
            {path:"oldValue.incentiveGroupId",model:"IncentiveGroupMaster",select:"incentiveGroupName"},
            {path:"oldValue.fairRuleGroupId",model:"fareRuleGroup" ,select:"fareRuleGroupName modifyAt"},
            {path:"oldValue.diSetupGroupId",model:"diSetupGroupModel",select:"diSetupGroupName modifyAt"},
            {path:"oldValue.pgChargesGroupId",model:"paymentGatewayGroupModel", select:"paymentGatewayGroupName modifyAt"},
            {path:"oldValue.airlinePromoCodeGroupId",model:"airlinePromoCodeGroupModel",select:"airlinePromcodeGroupName modifyAt"},
            {path:"oldValue.ssrCommercialGroupId",model:"ssrCommercialGroup",select:"ssrCommercialName modifyAt"},
            { path: 'newValue.commercialPlanId', model: 'CommercialAirPlan' ,select:"commercialPlanName modifiedDate" },
            { path: 'newValue.plbGroupId', model: 'PLBGroupMaster', select:"PLBGroupName"},
            { path: 'newValue.privilagePlanId', model: 'privilagePlan', select:"privilagePlanName" },
            {path:"newValue.incentiveGroupId",model:"IncentiveGroupMaster",select:"incentiveGroupName"},
            {path:"newValue.fairRuleGroupId",model:"fareRuleGroup" ,select:"fareRuleGroupName modifyAt"},
            {path:"newValue.diSetupGroupId",model:"diSetupGroupModel",select:"diSetupGroupName modifyAt"},
            {path:"newValue.pgChargesGroupId",model:"paymentGatewayGroupModel", select:"paymentGatewayGroupName modifyAt"},
            {path:"newValue.airlinePromoCodeGroupId",model:"airlinePromoCodeGroupModel",select:"airlinePromcodeGroupName modifyAt"},
            {path:"newValue.ssrCommercialGroupId",model:"ssrCommercialGroup",select:"ssrCommercialName modifyAt"},  
 ]
    

 )
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



const getAgencyLogConfig=async(req,res)=>{
    try{
        const { doucmentId } = req.query;
        if ( !doucmentId) {
            return {
                response: "Either _id does not exist",
            };
        }
       

        const populateOptions = [
            { path: "doerId", select: "fname email lastName userId" },
            { path: "companyId", select: "companyName type" },
            { path: 'oldValue.commercialPlanIds', model: 'CommercialAirPlan', select: "commercialPlanName modifiedDate" },
            { path: 'oldValue.plbGroupIds', model: 'PLBGroupMaster', select: "PLBGroupName" },
            { path: 'oldValue.privilegePlansIds', model: 'privilagePlan', select: "privilagePlanName" },
            { path: 'oldValue.incentiveGroupIds', model: 'IncentiveGroupMaster', select: "incentiveGroupName" },
            { path: 'oldValue.fareRuleGroupIds', model: 'fareRuleGroup', select: "fareRuleGroupName modifyAt" },
            { path: 'oldValue.diSetupIds', model: 'diSetupGroupModel', select: "diSetupGroupName modifyAt" },
            { path: 'oldValue.paymentGatewayIds', model: 'paymentGatewayGroupModel', select: "paymentGatewayGroupName modifyAt" },
            { path: 'oldValue.airlinePromocodeIds', model: 'airlinePromoCodeGroupModel', select: "airlinePromcodeGroupName modifyAt" },
            { path: 'oldValue.ssrCommercialGroupId', model: 'ssrCommercialGroup', select: "ssrCommercialName modifyAt" },
            { path: 'oldValue.salesInchargeIds', model: 'User', select:"title fname lastname email"},

            { path: 'newValue.commercialPlanIds', model: 'CommercialAirPlan', select: "commercialPlanName modifiedDate" },
            { path: 'newValue.plbGroupIds', model: 'PLBGroupMaster', select: "PLBGroupName" },
            { path: 'newValue.privilegePlansIds', model: 'privilagePlan', select: "privilagePlanName" },
            { path: 'newValue.incentiveGroupIds', model: 'IncentiveGroupMaster', select: "incentiveGroupName" },
            { path: 'newValue.fareRuleGroupIds', model: 'fareRuleGroup', select: "fareRuleGroupName modifyAt" },
            { path: 'newValue.diSetupIds', model: 'diSetupGroupModel', select: "diSetupGroupName modifyAt" },
            { path: 'newValue.paymentGatewayIds', model: 'paymentGatewayGroupModel', select: "paymentGatewayGroupName modifyAt" },
            { path: 'newValue.airlinePromocodeIds', model: 'airlinePromoCodeGroupModel', select: "airlinePromcodeGroupName modifyAt" },
            { path: 'newValue.ssrCommercialGroupId', model: 'ssrCommercialGroup', select: "ssrCommercialName modifyAt" },
            { path: 'newValue.salesInchargeIds', model: 'User',select:"title fname lastname email" }

          ];
          
          const getEventLogs = await EventLog.find({ documentId:doucmentId }).populate(populateOptions);
          
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
module.exports = { addEventLog, retriveEventLog, getEventLog,getEventlogbyid,getAgencyLog ,getAgencyLogConfig}
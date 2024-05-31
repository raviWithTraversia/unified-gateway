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
            {path:"oldValue.fareRuleGroupId",model:"fareRuleGroup" ,select:"fareRuleGroupName modifyAt"},
            {path:"oldValue.diSetupGroupId",model:"diSetupGroupModel",select:"diSetupGroupName modifyAt"},
            {path:"oldValue.pgChargesGroupId",model:"paymentGatewayGroupModel", select:"paymentGatewayGroupName modifyAt"},
            {path:"oldValue.airlinePromoCodeGroupId",model:"airlinePromoCodeGroupModel",select:"airlinePromcodeGroupName modifyAt"},
            {path:"oldValue.ssrCommercialGroupId",model:"ssrCommercialGroup",select:"ssrCommercialName modifyAt"},
            { path: 'newValue.commercialPlanId', model: 'CommercialAirPlan' ,select:"commercialPlanName modifiedDate" },
            { path: 'newValue.plbGroupId', model: 'PLBGroupMaster', select:"PLBGroupName"},
            { path: 'newValue.privilagePlanId', model: 'privilagePlan', select:"privilagePlanName" },
            {path:"newValue.incentiveGroupId",model:"IncentiveGroupMaster",select:"incentiveGroupName"},
            {path:"newValue.fareRuleGroupId",model:"fareRuleGroup" ,select:"fareRuleGroupName modifyAt"},
            {path:"newValue.diSetupGroupId",model:"diSetupGroupModel",select:"diSetupGroupName modifyAt"},
            {path:"newValue.pgChargesGroupId",model:"paymentGatewayGroupModel", select:"paymentGatewayGroupName modifyAt"},
            {path:"newValue.airlinePromoCodeGroupId",model:"airlinePromoCodeGroupModel",select:"airlinePromcodeGroupName modifyAt"},
            {path:"newValue.ssrCommercialGroupId",model:"ssrCommercialGroup",select:"ssrCommercialName modifyAt"},  
 ]
    

 )
 
 const result = getEventLogs.map(item => {
    const updatedValues = {};

    if (item.oldValue?.privilagePlanId?.privilagePlanName !== item.newValue?.privilagePlanId?.privilagePlanName) {
        updatedValues.privilagePlanId = {
            oldValue: item.oldValue?.privilagePlanId?.privilagePlanName,
            newValue: item.newValue?.privilagePlanId?.privilagePlanName
        };
    }

    if (item.oldValue?.commercialPlanId?.commercialPlanName !== item.newValue?.commercialPlanId?.commercialPlanName) {
        updatedValues.commercialPlanId = {
            oldValue: item.oldValue?.commercialPlanId?.commercialPlanName,
            newValue: item.newValue?.commercialPlanId?.commercialPlanName
        };
    }

    if (item.oldValue?.plbGroupId?.PLBGroupName!==item.newValue?.plbGroupId?.PLBGroupName) {
        updatedValues.commercialPlanId = {
            oldValue: item.oldValue?.plbGroupId?.PLBGroupName,
            newValue: item.newValue?.plbGroupId?.PLBGroupName
        };
    }  if (item.oldValue?.incentiveGroupId?.incentiveGroupName!==item.newValue?.incentiveGroupId?.incentiveGroupName) {
        updatedValues.incentiveGroupId = {
            oldValue: item.oldValue?.incentiveGroupId?.incentiveGroupName,
            newValue: item.newValue?.incentiveGroupId?.incentiveGroupName
        };
    }  if (item.oldValue?.fairRuleGroupId?.fareRuleGroupName!==item.newValue?.fairRuleGroupId?.fareRuleGroupName) {
        updatedValues.fairRuleGroupId = {
            oldValue: item.oldValue?.fairRuleGroupId?.fareRuleGroupName,
            newValue: item.newValue?.fairRuleGroupId?.fareRuleGroupName
        };
    }  
    if (item.oldValue?.diSetupGroupId?.diSetupGroupName!==item.newValue?.diSetupGroupId?.diSetupGroupName) {
        updatedValues.diSetupGroupId = {
            oldValue: item.oldValue?.diSetupGroupId?.diSetupGroupName,
            newValue: item.newValue?.diSetupGroupId?.diSetupGroupName
        };
    }

    if (item.oldValue?.pgChargesGroupId?.paymentGatewayGroupName!==item.newValue?.pgChargesGroupId?.paymentGatewayGroupName) {
        updatedValues.pgChargesGroupId = {
            oldValue: item.oldValue?.pgChargesGroupId?.paymentGatewayGroupName,
            newValue: item.newValue?.pgChargesGroupId?.paymentGatewayGroupName
        };
    } if (item.oldValue?.airlinePromoCodeGroupId?.airlinePromcodeGroupName!==item.newValue?.airlinePromoCodeGroupId?.airlinePromcodeGroupName) {
        updatedValues.airlinePromoCodeGroupId = {
            oldValue: item.oldValue?.airlinePromoCodeGroupId?.airlinePromcodeGroupName,
            newValue: item.newValue?.airlinePromoCodeGroupId?.airlinePromcodeGroupName
        };
    }
    // Repeat this pattern for other properties

    return {
        _id: item._id, // Include other necessary fields here
        eventName:item.eventName,
        doerId:item.doerId,
        doerName:item.doerName,
        companyId:item.companyId,
        description:item.description,
        createdAt:item.createdAt,
        updatedAt:item.updatedAt,
        updatedValues
    };
}).filter(item => Object.keys(item.updatedValues).length > 0);

        if (!result) {
            return {
                response: "Data Not Found",
            };
        }
        return {
            response: "Fetch Data Successfully",
            data: result,
        };

    }catch(error){
        console.log(error)
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
        throw error;
    }
}




const getairCommercialfilterlog=async(req,res)=>{
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
            { path: 'oldValue.commercialAirPlanId', model: 'CommercialAirPlan' ,select:"commercialPlanName modifiedDate status"},
            { path: 'oldValue.carrier', model: 'AirlineCode',select:""},
            { path: 'oldValue.supplier', model: 'SupplierCode',select:"supplierCode status"},
            { path: 'oldValue.source', model: 'SupplierCode',select:"supplierCode status"},

            { path: 'oldValue.fareFamily', model: 'FareFamilyMaster',select:"fareFamilyCode fareFamilyName status"},
           

            { path: 'newValue.commercialAirPlanId', model: 'CommercialAirPlan' ,select:"commercialPlanName modifiedDate status"},
            { path: 'newValue.carrier', model: 'AirlineCode',select:""},
            { path: 'newValue.supplier', model: 'SupplierCode',select:"supplierCode status"},
            { path: 'newValue.fareFamily', model: 'FareFamilyMaster',select:"fareFamilyCode fareFamilyName status"},
            { path: 'oldValue.source', model: 'SupplierCode',select:"supplierCode status"},

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
        throw error;
    }
}
module.exports = { addEventLog, retriveEventLog, getEventLog,getEventlogbyid,getAgencyLog ,getAgencyLogConfig,getairCommercialfilterlog}
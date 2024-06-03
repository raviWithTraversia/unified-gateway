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
            {path:"oldValue.pgChargesGroupId",model:"paymentGatewayGroupModel", select:"paymentGatewayGroupName"},
            {path:"oldValue.airlinePromoCodeGroupId",model:"airlinePromoCodeGroupModel",select:"airlinePromcodeGroupName"},
            {path:"oldValue.ssrCommercialGroupId",model:"ssrCommercialGroup",select:"ssrCommercialName "},
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
    if (item.oldValue?.name !== item.newValue?.name) {
        updatedValues.AgencyName = {
            oldValue: item.oldValue?.name,
            newValue: item.newValue?.name
        };
    }


    if (item.oldValue?.privilagePlanId?._id !== item.newValue?.privilagePlanId?._id) {
        updatedValues.privilagePlanId = {
            oldValue: item.oldValue?.privilagePlanId?.privilagePlanName,
            newValue: item.newValue?.privilagePlanId?.privilagePlanName
        };
    }

    if (item.oldValue?.commercialPlanId?._id !== item.newValue?.commercialPlanId?._id) {
        updatedValues.commercialPlanId = {
            oldValue: item.oldValue?.commercialPlanId?.commercialPlanName,
            newValue: item.newValue?.commercialPlanId?.commercialPlanName
        };
    }

    if (item.oldValue?.plbGroupId?._id!==item.newValue?.plbGroupId?._id) {
        updatedValues.plbGroupId = {
            oldValue: item.oldValue?.plbGroupId?.PLBGroupName,
            newValue: item.newValue?.plbGroupId?.PLBGroupName
        };
    }  if (item.oldValue?.incentiveGroupId?.incentiveGroupName!==item.newValue?.incentiveGroupId?.incentiveGroupName) {
        updatedValues.incentiveGroupId = {
            oldValue: item.oldValue?.incentiveGroupId?.incentiveGroupName,
            newValue: item.newValue?.incentiveGroupId?.incentiveGroupName
        };
    }  
    
    if (item.oldValue?.diSetupGroupId?._id!==item.newValue?.diSetupGroupId?._id) {
        updatedValues.diSetupGroupId = {
            oldValue: item.oldValue?.diSetupGroupId?.diSetupGroupName,
            newValue: item.newValue?.diSetupGroupId?.diSetupGroupName
        };
    }
   
    if (item.oldValue?.airlinePromoCodeGroupId?._id!==item.newValue?.airlinePromoCodeGroupId?._id) {
        updatedValues.airlinePromoCodeGroupId = {
            oldValue: item.oldValue?.airlinePromoCodeGroupId?.airlinePromcodeGroupName,
            newValue: item.newValue?.airlinePromoCodeGroupId?.airlinePromcodeGroupName
        };
    }

    if (item.oldValue?.fairRuleGroupId?._id!==item.newValue?.fairRuleGroupId?._id) {
        updatedValues.fairRuleGroupId = {
            oldValue: item.oldValue?.fairRuleGroupId?.fareRuleGroupName,
            newValue: item.newValue?.fairRuleGroupId?.fareRuleGroupName
        };
    }  

    
    if (item.oldValue?.ssrCommercialGroupId?._id!==item.newValue?.ssrCommercialGroupId?._id) {
        updatedValues.ssrCommercialGroupId = {
            oldValue: item.oldValue?.ssrCommercialGroupId?.ssrCommercialName,
            newValue: item.newValue?.ssrCommercialGroupId?.ssrCommercialName
        };
    }
    if (item.oldValue?.pgChargesGroupId?._id!==item.newValue?.pgChargesGroupId?._id) {
        updatedValues.pgChargesGroupId = {
            oldValue: item.oldValue?.pgChargesGroupId?.paymentGatewayGroupName,
            newValue: item.newValue?.pgChargesGroupId?.paymentGatewayGroupName
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
            data:result,
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
          
          const result = getEventLogs.map(item => {
            const updatedValues = {};
            if (item.oldValue?.name !== item.newValue?.name) {
                updatedValues.AgencyName = {
                    oldValue: item.oldValue?.name,
                    newValue: item.newValue?.name
                };
            }

            if (item.oldValue?.tds !== item.newValue?.tds) {
                updatedValues.tds = {
                    oldValue: item.oldValue?.tds,
                    newValue: item.newValue?.tds
                };
            } if (Number(item.oldValue?.maxcreditLimit) !== Number(item.newValue?.maxcreditLimit)) {
                updatedValues.maxcreditLimit = {
                    oldValue: Number(item.oldValue?.maxcreditLimit),
                    newValue: Number(item.newValue?.maxcreditLimit)
                };
            }
             if (item.oldValue?.accountCode !== item.newValue?.accountCode) {
                updatedValues.accountCode = {
                    oldValue: item.oldValue?.accountCode,
                    newValue: item.newValue?.accountCode
                };
            }
        
            if (Number(item.oldValue?.discountPercentage) !== Number(item.newValue?.discountPercentage)) {
                updatedValues.discountPercentage = {
                    oldValue: Number(item.oldValue?.discountPercentage),
                    newValue: Number(item.newValue?.discountPercentage)
                };
            } if (item.oldValue?.portalLedgerAllowed !== item.newValue?.portalLedgerAllowed) {
                updatedValues.portalLedgerAllowed = {
                    oldValue: item.oldValue?.portalLedgerAllowed,
                    newValue: item.newValue?.portalLedgerAllowed
                };
            } if (item.oldValue?.holdPNRAllowed !== item.newValue?.holdPNRAllowed) {
                updatedValues.holdPNRAllowed = {
                    oldValue: item.oldValue?.holdPNRAllowed,
                    newValue: item.newValue?.holdPNRAllowed
                };
            }
            if (item.oldValue?.bookingPrefix !== item.newValue?.bookingPrefix) {
                updatedValues.bookingPrefix = {
                    oldValue: item.oldValue?.bookingPrefix,
                    newValue: item.newValue?.bookingPrefix
                };
            }
            if (item.oldValue?.InvoiceingPrefix !== item.newValue?.InvoiceingPrefix) {
                updatedValues.InvoiceingPrefix = {
                    oldValue: item.oldValue?.InvoiceingPrefix,
                    newValue: item.newValue?.InvoiceingPrefix
                };
            }
            if (item.oldValue?.initiallyLoad !== item.newValue?.initiallyLoad) {
                updatedValues.initiallyLoad = {
                    oldValue: item.oldValue?.initiallyLoad,
                    newValue: item.newValue?.initiallyLoad
                };
            } if (item.oldValue?.fareTypes !== item.newValue?.fareTypes) {
                updatedValues.fareTypes = {
                    oldValue: item.oldValue?.fareTypes,
                    newValue: item.newValue?.fareTypes
                };
            }
            if (item.oldValue?.privilegePlansIds?.privilagePlanName !== item.newValue?.privilegePlansIds?.privilagePlanName) {
                updatedValues.privilegePlansIds = {
                    oldValue: item.oldValue?.privilegePlansIds?.privilagePlanName,
                    newValue: item.newValue?.privilegePlansIds?.privilagePlanName
                };
            }
        
            if (item.oldValue?.commercialPlanIds?.commercialPlanName !== item.newValue?.commercialPlanIds?.commercialPlanName) {
                updatedValues.commercialPlanIds = {
                    oldValue: item.oldValue?.commercialPlanIds?.commercialPlanName,
                    newValue: item.newValue?.commercialPlanIds?.commercialPlanName
                };
            }
        
            if (item.oldValue?.plbGroupIds?.PLBGroupName!==item.newValue?.plbGroupIds?.PLBGroupName) {
                updatedValues.plbGroupIds = {
                    oldValue: item.oldValue?.plbGroupIds?.PLBGroupName,
                    newValue: item.newValue?.plbGroupIds?.PLBGroupName
                };
            }  if (item.oldValue?.incentiveGroupIds?.incentiveGroupName!==item.newValue?.incentiveGroupIds?.incentiveGroupName) {
                updatedValues.incentiveGroupId = {
                    oldValue: item.oldValue?.incentiveGroupId?.incentiveGroupName,
                    newValue: item.newValue?.incentiveGroupId?.incentiveGroupName
                };
            }  
            
            if (item.oldValue?.diSetupIds?.diSetupGroupName!==item.newValue?.diSetupIds?.diSetupGroupName) {
                updatedValues.diSetupIds = {
                    oldValue: item.oldValue?.diSetupIds?.diSetupGroupName,
                    newValue: item.newValue?.diSetupIds?.diSetupGroupName
                };
            }
           
            if (item.oldValue?.airlinePromocodeIds?.airlinePromcodeGroupName!==item.newValue?.airlinePromocodeIds?.airlinePromcodeGroupName) {
                updatedValues.airlinePromocodeIds = {
                    oldValue: item.oldValue?.airlinePromocodeIds?.airlinePromcodeGroupName,
                    newValue: item.newValue?.airlinePromocodeIds?.airlinePromcodeGroupName
                };
            }
        
            if (item.oldValue?.fairRuleGroupId?.fareRuleGroupName!==item.newValue?.fairRuleGroupId?.fareRuleGroupName) {
                updatedValues.fairRuleGroupId = {
                    oldValue: item.oldValue?.fairRuleGroupId?.fareRuleGroupName,
                    newValue: item.newValue?.fairRuleGroupId?.fareRuleGroupName
                };
            }  
        
            
            if (item.oldValue?.ssrCommercialGroupId?.ssrCommercialName!==item.newValue?.ssrCommercialGroupId?.ssrCommercialName) {
                updatedValues.ssrCommercialGroupId = {
                    oldValue: item.oldValue?.ssrCommercialGroupId?.ssrCommercialName,
                    newValue: item.newValue?.ssrCommercialGroupId?.ssrCommercialName
                };
            }
            if (item.oldValue?.paymentGatewayIds?.paymentGatewayGroupName!==item.newValue?.paymentGatewayIds?.paymentGatewayGroupName) {
                updatedValues.pgChargesGroupId = {
                    oldValue: item.oldValue?.paymentGatewayIds?.paymentGatewayGroupName,
                    newValue: item.newValue?.paymentGatewayIds?.paymentGatewayGroupName
                };
            } 

            if (item.oldValue?.salesInchargeIds?._id!==item.newValue?.salesInchargeIds?._id) {
                updatedValues.salesInchargeIds = {
                    oldValue: [item.oldValue?.salesInchargeIds?.email,item.oldValue?.salesInchargeIds?.fname,item.oldValue?.salesInchargeIds?.lastname,],
                    newValue: [item.newValue?.salesInchargeIds?.email,item.newValue?.salesInchargeIds?.fname,item.newValue?.salesInchargeIds?.lastname,],
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
          
          const result = getEventLogs.map(item => {
            const updatedValues = {};
            if (item.oldValue?.name !== item.newValue?.name) {
                updatedValues.AgencyName = {
                    oldValue: item.oldValue?.name,
                    newValue: item.newValue?.name
                };
            }
        
        
            if (item.oldValue?.commercialAirPlanId?._id !== item.newValue?.commercialAirPlanId?._id) {
                updatedValues.commercialAirPlanId = {
                    oldValue: item.oldValue?.commercialAirPlanId?.commercialPlanName,
                    newValue: item.newValue?.commercialAirPlanId?.commercialPlanName
                };
            }
        
            if (item.oldValue?.carrier?._id !== item.newValue?.carrier?._id) {
                updatedValues.carrier = {
                    oldValue: item.oldValue?.carrier?.commercialPlanName,
                    newValue: item.newValue?.carrier?.commercialPlanName
                };
            }
        
            if (item.oldValue?.supplier?._id!==item.newValue?.supplier?._id) {
                updatedValues.plbGroupIds = {
                    oldValue: item.oldValue?.supplier?.supplierCode,
                    newValue: item.newValue?.supplier?.supplierCode
                };
            }  if (item.oldValue?.source?._id!==item.newValue?.source?._id) {
                updatedValues.source = {
                    oldValue: item.oldValue?.source?.supplierCode,
                    newValue: item.newValue?.source?.supplierCode
                };
            }  
            
            if (item.oldValue?.fareFamily?._id!==item.newValue?.fareFamily?._id) {
                updatedValues.fareFamily = {
                    oldValue: [item.oldValue?.fareFamily?.fareFamilyCode,  item.oldValue?.fareFamily?.fareFamilyName],
                    newValue: [item.newValue?.fareFamily?.fareFamilyCode ,item.oldValue?.fareFamily?.fareFamilyName]
                };
            }
           
         
        
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
        throw error;
    }
}
module.exports = { addEventLog, retriveEventLog, getEventLog,getEventlogbyid,getAgencyLog ,getAgencyLogConfig,getairCommercialfilterlog}
const { date } = require('joi');
const CommercialAirPlan = require('../../models/CommercialAirPlan');
const agencyGroup = require("../../models/AgencyGroup");
const EventLogs=require('../logs/EventApiLogsCommon')
const user=require("../../models/User")
// Add Air commercial Plan
const addCommercialAirPlan = async(req , res) => {
    try {
       
        const { commercialPlanName, companyId, modifiedBy } = req.body;
        if (!commercialPlanName || !companyId || !modifiedBy) {
            return {
                response : 'All field are required'
            }
        }

        // check privilage name already exist behalf of company id
        const checkCommercialNameExist = await CommercialAirPlan.find({ commercialPlanName : commercialPlanName , companyId : companyId});
       
        if (checkCommercialNameExist.length > 0) {
            return {
                response: 'Commercial air plan name already exist'
            }
        }
        
        const airCommercialData = new CommercialAirPlan({
            commercialPlanName : commercialPlanName,
            companyId : companyId,
            modifiedBy : modifiedBy,
            modifiedDate : new Date(),   
        });

        const result = await airCommercialData.save();
const userData=await user.findById(req.user._id)
const LogsData={
            eventName:"CommercialAirPlan",
            doerId:req.user._id,
        doerName:userData.fname,
 companyId:companyId,
 documentId:result._id,
             description:"Add CommercialAirPlan",
          }
         EventLogs(LogsData)


        return {
            response : 'Commercial air plan created successfully'
        }

    } catch (error) {
        console.log(error)
        throw error;
    }
}


// get commercial air plan list by company Id
const getCommercialAirPlanListByCompanyId = async(req ,res) => {
    try {
        const CompanyId = req.params.companyId;
        const result = await CommercialAirPlan.find({companyId : CompanyId});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Commercial air plan not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

// commercial air plan update by commercialAirPlanId
const commercialPlanUpdate = async(req , res) => {
    try {
        const _id = req.params.commercialAirPlanId;
        const {commercialPlanName , status , companyId} = req.body;
        if(!commercialPlanName || !companyId) {
            return {
                response : 'Commercial plan name is required'
            }
        }else{

        // check commercial air plan name already exist behalf of company id
        const checkCommercialAirPlan = await CommercialAirPlan.findOne({ _id : _id});
        if (commercialPlanName != checkCommercialAirPlan.commercialPlanName) {

            const checkCommercial = await CommercialAirPlan.find({ companyId : companyId });           
            const oldNameExists = checkCommercial.some(checkCommercial => checkCommercial.commercialPlanName.toLowerCase() === commercialPlanName.toLowerCase());
            if(oldNameExists) {
                return {
                    response: 'Commercial air plan name already exist'
                }
            }
        }

        const userData=await user.findById(req.user._id)
            const result = await CommercialAirPlan.findByIdAndUpdate( _id ,
                {
                    commercialPlanName, 
                    status
                },
                { new: true }
                );
     const LogsData={
      eventName:"CommercialAirPlan",
      doerId:req.user._id,
        doerName:userData.fname,
 companyId:result.companyId,
 documentId:result._id,
 oldValue:checkCommercialAirPlan,
 newValue:result,
                    description:"Edit CommercialAirPlan",
                  }
                 EventLogs(LogsData)
            return {
                response : 'Commercial air plan updated successfully'
            }
        }

    } catch (error) {
        throw error;
    }
}


// Define IsDefault commercial Air Plan
const isDefaultCommercialAirPlan = async(req , res) => {
    try {
        const {companyId} = req.body;
        const _id = req.params.commercialAirPlanId;
        
         await CommercialAirPlan.updateMany({ companyId }, { IsDefault: false });
         await agencyGroup.findOneAndUpdate(
            { companyId: companyId, isDefault: true },
            { commercialPlanId: _id },
            { new: true }
          );
         
        const result = await CommercialAirPlan.findByIdAndUpdate( _id , {IsDefault : true }, { new: true });
        return {
            response : 'Commercial air plan define as IsDefault updated successfully'
        }
        
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addCommercialAirPlan,
    getCommercialAirPlanListByCompanyId,
    commercialPlanUpdate,
    isDefaultCommercialAirPlan
}
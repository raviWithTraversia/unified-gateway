const Carrier = require('../../models/AirlineCode');
const FareFamilyMaster = require('../../models/FareFamilyMaster');
const AirCommercial = require('../../models/AirCommercial');
const AirCommercialRowMaster = require('../../models/AirCommertialRowMaster');

const addAirCommercial = async(req , res) => {
    try {
        
        const {
            commercialAirPlanId,
            travelType,
            carrier,
            cabinClass,
            commercialCategory,
            commercialType,
            supplier,
            source,
            RBD,
            fareFamily,
            issueFromDate,
            issueToDate,
            travelFromDate,
            travelToDate,
            tourCodes,
            modifiedBy,
            lastModifiedDate,
        } = req.body;
        if(!commercialAirPlanId) {
            return {
                response : 'Commercial air plan Id field are required'
            }
        }
        if(!travelType) {
            return {
                response : 'Travel Type field are required'
            }
        }
        if(!carrier) {
            return {
                response : 'Carrier field are required'
            }
        }
        if(!cabinClass) {
            return {
                response : 'Cabin Class field are required'
            }
        }
        if(!commercialCategory) {
            return {
                response : 'Commercial category  field are required'
            }
        }
        if(!supplier) {
            return {
                response : 'Supplier field are required'
            }
        }
        if(!source) {
            return {
                response : 'Source field are required'
            }
        }
        if(!commercialType){
            return {
                response : 'Commercial Type field are required'
            } 
        }
        if(!fareFamily) {
            return {
                response : 'Fare Family field are required'
            }
        }
        if(!issueFromDate) {
            return {
                response : 'issue From Date field are required'
            }
        }
        if(!issueToDate) {
            return {
                response : 'issue To Date field are required'
            }
        }
        if(!travelFromDate) {
            return {
                response : 'Travel from date field are required'
            }
        }
        if(!travelToDate) {
            return {
                response : 'Travel to Date field are required'
            }
        }
        const saveAirCommercial = new AirCommercial({
            commercialAirPlanId,
            travelType,
            carrier,
            cabinClass,
            commercialCategory,
            commercialType,
            supplier,
            source,
            RBD,
            fareFamily,
            issueFromDate,
            issueToDate,
            travelFromDate,
            travelToDate,
            tourCodes,
            modifiedBy,
            lastModifiedDate,
        });
        
        const result = await saveAirCommercial.save();

        return {
            response : 'Air Commercial created successfully'
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    addAirCommercial
}
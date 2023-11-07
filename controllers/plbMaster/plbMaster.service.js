const PLBMaster = require('../../models/PLBMaster');

const addPLBMaster = async(req, res) => {
    try {
        const {
            companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
        } = req.body;

        if(!companyId) {
            return {
                response : 'Company Id is required'
            }
        }

        const PLBData = new PLBMaster({
            companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
        })
        await PLBData.save();

        return {
            response: 'PLB Master save successfully'
        }

    } catch (error) {
        throw error;
    }
}

const getPLBMaterByPLBType = async(req , res) => {
    try {
        const PLBType = req.params.PLBType;
        const result = await PLBMaster.find({ PLBType: PLBType });
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'PLB Master not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

const PLBMasterUpdate = async(req, res) => {
    try {
        const _id = req.params.id;
        const {
            companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
        } = req.body;

        if(!companyId) {
            return {
                response : 'Company Id is required'
            }
        } 

        const PLBMasterUpdate = await PLBMaster.findByIdAndUpdate(
            _id, 
            {
                companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
            }, { new: true }
            )
        return {
            response : 'PLB Master updated successfully'
        }

    } catch (error) {
        throw error
    }
}


const removePLBMaster = async(req , res) => {
    try {

        const result = await PLBMaster.deleteOne({ _id: req.params.id });
        return {
            response : 'PLB Master deleted Successfully!'
        }

    } catch (error) {
        throw error;
    }
}

const CopyPLBMaster = async(req, res) => {
    try {
        const _id = req.body.id;
        const DataPLB = PLBMaster.findById(_id);
        if(DataPLB) {
            
            const PLBData = new PLBMaster({
                companyId : DataPLB.companyId,
                origin : DataPLB.origin,
                destination : DataPLB.destination, 
                supplierCode : DataPLB.supplierCode, 
                airlineCode : DataPLB.airlineCode, 
                cabinClass : DataPLB.cabinClass, 
                rbd : DataPLB.rbd, 
                PLBApplyOnBasefare : DataPLB.PLBApplyOnBasefare,  
                PLBApplyOnYQ : DataPLB.PLBApplyOnYQ, 
                PLBApplyOnYR : DataPLB.PLBApplyOnYR, 
                PLBApplyOnTotalAmount : DataPLB.PLBApplyOnTotalAmount, 
                PLBApplyOnAllTAxes : DataPLB.PLBApplyOnAllTAxes,
                minPrice :DataPLB.minPrice, 
                maxPrice :DataPLB.maxPrice, 
                travelDateFrom :DataPLB.travelDateFrom,
                travelDateTo :DataPLB.travelDateTo, 
                PLBValue :DataPLB.PLBValue, 
                PLBValueType :DataPLB.PLBValueType,
                PLBType :DataPLB.PLBType, 
                createdBy :DataPLB.createdBy, 
                modifiedAt :DataPLB.modifiedAt,
                modifiedBy :DataPLB.modifiedBy, 
                status :DataPLB.status,
                datefIssueFrom :DataPLB.datefIssueFrom,
                datefIssueTo :DataPLB.datefIssueTo, 
                fareFamily :DataPLB.fareFamily,
                deductTDS :DataPLB.deductTDS,
                isdeleted :DataPLB.isdeleted
            })
            await PLBData.save();
    
            return {
                response: 'PLB Master copy successfully'
            }
        }else{
            return {
                response : 'PLB Master id not exist'
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    addPLBMaster,
    getPLBMaterByPLBType,
    PLBMasterUpdate,
    removePLBMaster,
    CopyPLBMaster
}
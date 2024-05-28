const PLBMaster = require('../../models/PLBMaster');
const commonFunction = require('../commonFunctions/common.function');
const User = require('../../models/User');
const PLBMasterHistory =require('../../models/PLBMasterHistory');
const PLBGroupHasPLBMaster = require('../../models/PLBGroupHasPLBMaster');
const agencyGroup = require("../../models/AgencyGroup");
const EventLogs=require('../logs/EventApiLogsCommon')
const addPLBMaster = async(req, res) => {
    try {
        const {
            companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted ,
        } = req.body;
        if(!companyId) {
            return {
                response : 'Company Id is required'
            }
        }
        const checkPLBExist = await PLBMaster.findOne({companyId : companyId});
        if(checkPLBExist) {
            isDefault = false;
        }else{
            isDefault = true;
        }

        const PLBData = new PLBMaster({
            companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted,isDefault , PLBValue
        })
        const result =  await PLBData.save();

         // Log add 
         const doerId = req.user._id;
         const userData = await User.findById(doerId);
   
         const LogsData={
            eventName:"PLBMaster",
            doerId:req.user._id,
            doerName:userData.fname,
    companyId:companyId,
    documentId:result._id,
            description:"Add PLB Master",
          }
        EventLogs(LogsData)
        //  History log PLB Master
         logHistoryPLB(req , result);

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
        const companyId = req.params.companyId;
        const result = await PLBMaster.find({ PLBType: PLBType , companyId: companyId}).populate('supplierCode airlineCode cabinClass fareFamily');
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
            companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted,
        } = req.body;

        if(!companyId) {
            return {
                response : 'Company Id is required'
            }
        } 
const OldPlbmaseterValue=await PLBMaster.findById(_id)

        const PLBMasterUpdate = await PLBMaster.findByIdAndUpdate(
            _id, 
            {
                companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
            }, { new: true }
            )

             // Log add 
         const doerId = req.user._id;
         const userData = await User.findById(doerId);
 
         const LogsData={
            eventName:"PLBMaster",
            doerId:req.user._id,
            doerName:userData.fname,
    companyId:companyId,
    documentId:PLBMasterUpdate._id,
    oldValue:OldPlbmaseterValue,
    newValue:PLBMasterUpdate,
            description:"Edit PLB Master",
          }
        EventLogs(LogsData)
        // History update and create
        PLBMasterUpdateHistory(req , _id);

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

        const checkIncentiveGroupHasPermissionExist = await PLBGroupHasPLBMaster.findOne({ PLBMasterId: req.params.id });

        if (checkIncentiveGroupHasPermissionExist) {

            await PLBGroupHasPLBMaster.deleteMany({ PLBMasterId: req.params.id });
        }

              // Log add 
              const doerId = req.user._id;
              const userData = await User.findById(doerId);
      
              const LogsData={
                eventName:"PLBMaster",
                doerId:req.user._id,
                doerName:userData.fname,
        companyId:result.companyId,
        documentId:result._id,
                description:"Delete PLB Master",
              }
            EventLogs(LogsData)
        return {
            response : 'PLB Master deleted Successfully!'
        }

    } catch (error) {
        throw error;
    }
}

const CopyPLBMaster = async(req, res) => {
    try {
        const _id = req.params.id;
        const DataPLB = await PLBMaster.findById(_id);

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
    
             // Log add 
             const doerId = req.user._id;
             const userData = await User.findById(doerId);
      
              const LogsData={
                eventName:"PLBMaster",
                doerId:req.user._id,
                doerName:userData.fname,
        companyId:result.companyId,
        documentId:result._id,
                description:"Copy PLB Master",
              }
            EventLogs(LogsData)

             

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

// PLB Master log hostiry
const logHistoryPLB = async(req , result ,res) => {
    const {
        companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
    } = req.body;
    const newRemark = {};
    if(origin) {
        newRemark['origin'] = origin;
    }
    if(destination) {
        newRemark['destination'] = destination;
    }
    if(supplierCode) {
        newRemark['supplierCode'] = supplierCode;
    }
    if(airlineCode) {
        newRemark['airlineCode'] = airlineCode;
    }
    if(cabinClass) {
        newRemark['cabinClass'] = cabinClass;
    }
    if(rbd) {
        newRemark['rbd'] = rbd;
    }
    if(PLBApplyOnBasefare) {
        newRemark['PLBApplyOnBasefare'] = PLBApplyOnBasefare;
    }
    if(PLBApplyOnYQ) {
        newRemark['PLBApplyOnYQ'] = PLBApplyOnYQ;
    }
    if(PLBApplyOnYR) {
        newRemark['PLBApplyOnYR'] = PLBApplyOnYR;
    }
    if(PLBApplyOnTotalAmount) {
        newRemark['PLBApplyOnTotalAmount'] = PLBApplyOnTotalAmount;
    }
    if(PLBApplyOnAllTAxes) {
        newRemark['PLBApplyOnAllTAxes'] = PLBApplyOnAllTAxes;
    }
    if(minPrice) {
        newRemark['minPrice'] = minPrice;
    }
    if(maxPrice) {
        newRemark['maxPrice'] = maxPrice;
    }
    if(travelDateFrom) {
        newRemark['travelDateFrom'] = travelDateFrom;
    }
    if(travelDateTo) {
        newRemark['travelDateTo'] = travelDateTo;
    }
    if(PLBValue) {
        newRemark['PLBValue'] = PLBValue;
    }
    if(PLBValueType) {
        newRemark['PLBValueType'] = PLBValueType;
    }
    if(PLBType) {
        newRemark['PLBType'] = PLBType;
    }
    if(createdBy) {
        newRemark['createdBy'] = createdBy;
    }
    if(modifiedAt) {
        newRemark['modifiedAt'] = modifiedAt;
    }
    if(modifiedBy) {
        newRemark['modifiedBy'] = modifiedBy;
    }
    if(status) {
        newRemark['status'] = status;
    }
    if(datefIssueFrom) {
        newRemark['datefIssueFrom'] = datefIssueFrom;
    }
    if(datefIssueTo) {
        newRemark['datefIssueTo'] = datefIssueTo;
    }
    if(fareFamily) {
        newRemark['fareFamily'] = fareFamily;
    }
    if(deductTDS) {
        newRemark['deductTDS'] = deductTDS;
    }
    if(isdeleted) {
        newRemark['isdeleted'] = isdeleted;
    }
    
    const PLBHistory = new PLBMasterHistory({
        PLBMasterId : result._id,
        companyId,
        oldChanges : JSON.stringify(newRemark),
        newChanges : JSON.stringify(newRemark),
    });

    await PLBHistory.save();
}


// update PLBMaster Data History
const PLBMasterUpdateHistory = async(req , PLBMasterId ,res) => {

    // GET PLB Master History Data
    const oldRemark = {};
    const newRemark = {};
    const GetMasterHistory = await PLBMasterHistory.findOne({PLBMasterId : PLBMasterId}).sort({ _id: -1 }).limit(10);
    const history = JSON.parse(GetMasterHistory.newChanges);
    
    const {
        companyId,origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare,  PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes,minPrice , maxPrice, travelDateFrom,travelDateTo, PLBValue, PLBValueType,PLBType, createdBy, modifiedAt,modifiedBy, status,datefIssueFrom,datefIssueTo, fareFamily,deductTDS,isdeleted
    } = req.body;

    if(GetMasterHistory) {
        if(origin != history.origin) {
            newRemark['origin'] = origin;
            oldRemark['origin'] = history.origin;
        }
        if(destination != history.destination) {
            newRemark['destination'] = destination;
            oldRemark['destination'] = history.destination;
        }
        if(supplierCode != history.supplierCode) {
            newRemark['supplierCode'] = supplierCode;
            oldRemark['supplierCode'] = history.supplierCode;
        }
        if(airlineCode != history.airlineCode) {
            newRemark['airlineCode'] = airlineCode;
            oldRemark['airlineCode'] = history.airlineCode;
        }
        if(cabinClass != history.cabinClass) {
            newRemark['cabinClass'] = cabinClass;
            oldRemark['cabinClass'] = history.cabinClass;
        }
        if(rbd != history.rbd) {
            newRemark['rbd'] = rbd;
            oldRemark['rbd'] = history.rbd;
        }
        if(PLBApplyOnBasefare != history.PLBApplyOnBasefare) {
            newRemark['PLBApplyOnBasefare'] = PLBApplyOnBasefare;
            oldRemark['PLBApplyOnBasefare'] = history.PLBApplyOnBasefare;
        }
        if(PLBApplyOnYQ != history.PLBApplyOnYQ) {
            newRemark['PLBApplyOnYQ'] = PLBApplyOnYQ;
            oldRemark['PLBApplyOnYQ'] = history.PLBApplyOnYQ;
        }
        if(PLBApplyOnYR != history.PLBApplyOnYR) {
            newRemark['PLBApplyOnYR'] = PLBApplyOnYR;
            oldRemark['PLBApplyOnYR'] = history.PLBApplyOnYR;
        }
        if(PLBApplyOnTotalAmount != history.PLBApplyOnTotalAmount) {
            newRemark['PLBApplyOnTotalAmount'] = PLBApplyOnTotalAmount;
            oldRemark['PLBApplyOnTotalAmount'] = history.PLBApplyOnTotalAmount;
        }
        if(PLBApplyOnAllTAxes != history.PLBApplyOnAllTAxes) {
            newRemark['PLBApplyOnAllTAxes'] = PLBApplyOnAllTAxes;
            oldRemark['PLBApplyOnAllTAxes'] = history.PLBApplyOnAllTAxes;
        }
        if(minPrice != history.minPrice) {
            newRemark['minPrice'] = minPrice;
            oldRemark['minPrice'] = history.minPrice;
        }
        if(maxPrice != history.maxPrice) {
            newRemark['maxPrice'] = maxPrice;
            oldRemark['maxPrice'] = history.maxPrice;
        }
        if(travelDateFrom != history.travelDateFrom) {
            newRemark['travelDateFrom'] = travelDateFrom;
            oldRemark['travelDateFrom'] = history.travelDateFrom;
        }
        if(travelDateTo != history.travelDateTo) {
            newRemark['travelDateTo'] = travelDateTo;
            oldRemark['travelDateTo'] = history.travelDateTo;
        }
        if(PLBValue != history.PLBValue) {
            newRemark['PLBValue'] = PLBValue;
            oldRemark['PLBValue'] = history.PLBValue;
        }
        if(PLBValueType != history.PLBValueType) {
            newRemark['PLBValueType'] = PLBValueType;
            oldRemark['PLBValueType'] = history.PLBValueType;
        }
        if(PLBType != history.PLBType) {
            newRemark['PLBType'] = PLBType;
            oldRemark['PLBType'] = history.PLBType;
        }
        if(createdBy != history.createdBy) {
            newRemark['createdBy'] = createdBy;
            oldRemark['createdBy'] = history.createdBy;
        }
        if(modifiedAt != history.modifiedAt) {
            newRemark['modifiedAt'] = modifiedAt;
            oldRemark['modifiedAt'] = history.modifiedAt;
        }
        if(modifiedBy != history.modifiedBy) {
            newRemark['modifiedBy'] = modifiedBy;
            oldRemark['modifiedBy'] = history.modifiedBy;
        }
        if(status != history.status) {
            newRemark['status'] = status;
            oldRemark['status'] = history.status;
        }
        if(datefIssueFrom != history.datefIssueFrom) {
            newRemark['datefIssueFrom'] = datefIssueFrom;
            oldRemark['datefIssueFrom'] = history.datefIssueFrom;
        }
        if(datefIssueTo != history.datefIssueTo) {
            newRemark['datefIssueTo'] = datefIssueTo;
            oldRemark['datefIssueTo'] = history.datefIssueTo;
        }
        if(fareFamily != history.fareFamily) {
            newRemark['fareFamily'] = fareFamily;
            oldRemark['fareFamily'] = history.fareFamily;
        }
        if(deductTDS != history.deductTDS) {
            newRemark['deductTDS'] = deductTDS;
            oldRemark['deductTDS'] = history.deductTDS;
        }
        if(isdeleted != history.isdeleted) {
            newRemark['isdeleted'] = isdeleted;
            oldRemark['isdeleted'] = history.isdeleted;
        }
        if(newRemark) {
            const PLBHistory = new PLBMasterHistory({
                PLBMasterId,
                companyId,
                oldChanges : JSON.stringify(oldRemark),
                newChanges : JSON.stringify(newRemark),
            });
        
        await PLBHistory.save();
    }
    }
}


// PLB Master assign isDefault

const PLBMasterIsDefault = async(req , res) => {
    try {
        const _id = req.params.id;
        const {companyId} = req.body;
        if(!companyId) {
            return {
                response : 'Company Id is required'
            }
        }
        await PLBMaster.updateMany({ companyId }, { isDefault: false });
        await agencyGroup.findOneAndUpdate(
            { companyId: companyId, isDefault: true },
            { plbGroupId: _id },
            { new: true }
          );
        const result = await PLBMaster.findByIdAndUpdate( _id , {isDefault : true }, { new: true });
        return {
            response : 'PLB master define as default'
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
    CopyPLBMaster,
    PLBMasterIsDefault
}
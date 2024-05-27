const IncentiveMaster = require('../../models/IncentiveMaster');
const commonFunction = require('../commonFunctions/common.function');
const user = require('../../models/User');
EventLogs=require('../logs/EventApiLogsCommon')
const IncentiveGroupHasIncentiveMaster = require('../../models/IncentiveGroupHasIncentiveMaster');
const agencyGroup = require("../../models/AgencyGroup");
const addIncentiveMaster = async (req, res) => {
    try {
        const {
            companyId, origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare, PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes, minPrice, maxPrice, travelDateFrom, travelDateTo, PLBValue, PLBValueType, PLBType, createdBy, modifiedAt, modifiedBy, status, datefIssueFrom, datefIssueTo, fareFamily, deductTDS, isdeleted, flightNo, dealcode, farebasis
        } = req.body;

        if (!companyId) {
            return {
                response: 'Company Id is required'
            }
        }
        const checkIncentiveMasterExistByComId = await IncentiveMaster.findOne({ companyId: companyId });
        if (checkIncentiveMasterExistByComId) {
            isDefault = false;
        } else {
            isDefault = true
        }

        const IncentiveMasterData = new IncentiveMaster({
            companyId, origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare, PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes, minPrice, maxPrice, travelDateFrom, travelDateTo, PLBValue, PLBValueType, PLBType, createdBy, modifiedAt, modifiedBy, status, datefIssueFrom, datefIssueTo, fareFamily, deductTDS, isdeleted, flightNo, dealcode, farebasis, isDefault
        })
        await IncentiveMasterData.save();

        // Log add 
        const doerId = req.user._id;

        const userData=await user.findById(req.user._id)
const LogsData={
            eventName:"IncentiveMaster",
            doerId:req.user._id,
        doerName:userData.fname,
 companyId:companyId,
 documentId:IncentiveMasterData._id,
       description:'add Incentive Master'
        
          }
         EventLogs(LogsData)
       

        return {
            response: 'Incentive Master save successfully'
        }

    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getIncentiveMaster = async (req, res) => {
    try {
        const PLBType = req.params.PLBType;
        const companyId = req.params.companyId;
        const result = await IncentiveMaster.find({ PLBType: PLBType, companyId: companyId }).populate('supplierCode airlineCode cabinClass fareFamily');
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Incentive Master not available',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

const incentiveMasterUpdate = async (req, res) => {
    try {
        const _id = req.params.id;
        const {
            companyId, origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare, PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes, minPrice, maxPrice, travelDateFrom, travelDateTo, PLBValue, PLBValueType, PLBType, createdBy, modifiedAt, modifiedBy, status, datefIssueFrom, datefIssueTo, fareFamily, deductTDS, isdeleted, flightNo, dealcode, farebasis
        } = req.body;

        if (!companyId) {
            return {
                response: 'Company Id is required'
            }
        }
const oldIncentiveValue=await IncentiveMaster.findById(_id)
        const IncentiveMasterUpdate = await IncentiveMaster.findByIdAndUpdate(
            _id,
            {
                companyId, origin, destination, supplierCode, airlineCode, cabinClass, rbd, PLBApplyOnBasefare, PLBApplyOnYQ, PLBApplyOnYR, PLBApplyOnTotalAmount, PLBApplyOnAllTAxes, minPrice, maxPrice, travelDateFrom, travelDateTo, PLBValue, PLBValueType, PLBType, createdBy, modifiedAt, modifiedBy, status, datefIssueFrom, datefIssueTo, fareFamily, deductTDS, isdeleted, flightNo, dealcode, farebasis
            }, { new: true }
        )

        // Log add 
        const doerId = req.user._id;
        const userData=await user.findById(req.user._id)
const LogsData={
            eventName:"IncentiveMaster",
            doerId:req.user._id,
        doerName:userData.fname,
 companyId:companyId,
 documentId:IncentiveMasterUpdate._id,
 oldValue:oldIncentiveValue,
 newValue:IncentiveMasterUpdate,
  description:'Edit Incentive Master'
        
          }
         EventLogs(LogsData)

        return {
            response: 'Incentive Master updated successfully'
        }

    } catch (error) {
        throw error
    }
}


const removeIncentiveMaster = async (req, res) => {
    try {

        const result = await IncentiveMaster.deleteOne({ _id: req.params.id });
        const checkIncentiveGroupHasPermissionExist = await IncentiveGroupHasIncentiveMaster.findOne({ incentiveMasterId: req.params.id });

        if (checkIncentiveGroupHasPermissionExist) {

            await IncentiveGroupHasIncentiveMaster.deleteMany({ incentiveMasterId: req.params.id });
        }

        // Log add 
        const doerId = req.user._id;
        const userData=await user.findById(req.user._id)
        const LogsData={
                    eventName:"IncentiveMaster",
                    doerId:req.user._id,
                doerName:userData.fname,
         companyId:result.companyId,
         documentId:result._id,
               description:'Delete Incentive Master'
                
                  }
                 EventLogs(LogsData)
        return {
            response: 'Incentive Master deleted Successfully!'
        }

    } catch (error) {
        throw error;
    }
}

const CopyIncentiveMaster = async (req, res) => {
    try {
        const _id = req.params.id;
        const IncMaster = await IncentiveMaster.findById(_id);
        if (IncMaster) {

            const IncDataSave = new IncentiveMaster({
                companyId: IncMaster.companyId,
                origin: IncMaster.origin,
                destination: IncMaster.destination,
                supplierCode: IncMaster.supplierCode,
                airlineCode: IncMaster.airlineCode,
                cabinClass: IncMaster.cabinClass,
                rbd: IncMaster.rbd,
                PLBApplyOnBasefare: IncMaster.PLBApplyOnBasefare,
                PLBApplyOnYQ: IncMaster.PLBApplyOnYQ,
                PLBApplyOnYR: IncMaster.PLBApplyOnYR,
                PLBApplyOnTotalAmount: IncMaster.PLBApplyOnTotalAmount,
                PLBApplyOnAllTAxes: IncMaster.PLBApplyOnAllTAxes,
                minPrice: IncMaster.minPrice,
                maxPrice: IncMaster.maxPrice,
                travelDateFrom: IncMaster.travelDateFrom,
                travelDateTo: IncMaster.travelDateTo,
                PLBValue: IncMaster.PLBValue,
                PLBValueType: IncMaster.PLBValueType,
                PLBType: IncMaster.PLBType,
                createdBy: IncMaster.createdBy,
                modifiedAt: IncMaster.modifiedAt,
                modifiedBy: IncMaster.modifiedBy,
                status: IncMaster.status,
                datefIssueFrom: IncMaster.datefIssueFrom,
                datefIssueTo: IncMaster.datefIssueTo,
                fareFamily: IncMaster.fareFamily,
                deductTDS: IncMaster.deductTDS,
                isdeleted: IncMaster.isdeleted,
                flightNo: IncMaster.flightNo,
                dealcode: IncMaster.dealcode,
                farebasis: IncMaster.farebasis

            })
            await IncDataSave.save();

            // Log add 
            const doerId = req.user._id;
            const userData=await user.findById(req.user._id)
            const LogsData={
                        eventName:"IncentiveMaster",
                        doerId:req.user._id,
                    doerName:userData.fname,
             companyId:IncMaster.companyId,
             documentId:IncMaster._id,
                   description:'Copy Incentive Master'
                    
                      }
                     EventLogs(LogsData)

            return {
                response: 'Incentive Master copy successfully'
            }
        } else {
            return {
                response: 'Incentive Master id not exist'
            }
        }

    } catch (error) {
        throw error;
    }
}

const defineIncetiveMasterDefault = async (req, res) => {
    try {
        const _id = req.params.id;
        const { companyId } = req.body;
        if (!companyId) {
            return {
                response: 'Company Id is required'
            }
        }
        await IncentiveMaster.updateMany({ companyId }, { isDefault: false });
        await agencyGroup.findOneAndUpdate(
            { companyId: companyId, isDefault: true },
            { incentiveGroupId: _id },
            { new: true }
          );
        const result = await IncentiveMaster.findByIdAndUpdate(_id, { isDefault: true }, { new: true });
        return {
            response: 'Incentive master define as default'
        }
    } catch (error) {
        throw error;
    }
}


module.exports = {
    addIncentiveMaster,
    getIncentiveMaster,
    incentiveMasterUpdate,
    removeIncentiveMaster,
    CopyIncentiveMaster,
    defineIncetiveMasterDefault
}
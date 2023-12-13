const fareRulesModel = require('../../models/FareRules');
const FUNC = require('../commonFunctions/common.function');

const addfareRule = async (req,res) => {
    try{
    let {
        companyId ,
        origin, 
        destination,
        providerId,
        airlineCodeId,
        fareFamilyId,
        cabinclass,travelType
        ,validDateFrom,
        validDateTo,
        status
    } = req.body;
    let addRules = new fareRulesModel({
        companyId ,
        origin, 
        destination,
        providerId,
        airlineCodeId,
        fareFamilyId,
        cabinclass,
        travelType,
        validDateFrom,
        validDateTo,
        status : status || false
    });
    addRules = await addRules.save();
    if(addRules){
        return {
            response : 'Fare rule add sucessfully',
            data : addRules
        }
    }
    else{
        return {
            response : 'Fare rule not added'
        }
    }
    }catch(error){
      console.log(error);
      throw error
    }
};
const getFareRule = async (req,res) => {
    try{
        
    }catch(error){
        console.log(error);
        throw error
    }
};
const deleteFareRule = async (req, res) => {
    try{

    }catch(error){
        console.log(error);
        throw error
    }
};

module.exports = {
    addfareRule,
    getFareRule,
    deleteFareRule
}
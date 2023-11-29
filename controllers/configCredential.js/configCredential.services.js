const credentialConfig = require('../../models/ConfigCredential');
const FUNC = require('../commonFunctions/common.function');

const addCredntials = async (req,res) => {
   try{
    const { userId, password, url, forWhat,companyId,type:{token ,secretKey,urlActive,entityId,tempId} } = req.body;
    let isValidCompanyId = FUNC.checkIsValidId(companyId);
    if (isValidCompanyId === "Invalid Mongo Object Id") {
        return {
          response: "companyId is not valid",
        };
      }
      let insertConfigData =  new credentialConfig({
        userId : userId || null,
        password : password || null,
        url : url || null,
        forWhat,
        companyId : companyId || companyId,
        type : {
            token : token || null,
            secretKey : secretKey || null,
            urlActive : urlActive || null,
            entityId : entityId || null,
            tempId : tempId || null
        }
      });
      insertConfigData = await insertConfigData.save();
     if(insertConfigData){
        return {
            data : insertConfigData,
            response : 'Config Data Insert Sucessfully'
        }
     }
     else{
        return {
            response : 'Config data not Inserted'
        }
     }
   }catch(error){
      console.log(error);
      throw error
   }
};

const updateCredential = async (req,res) => {
    try{
       let configId = req.query._id;
       let isValidConfigId = FUNC.checkIsValidId(configId);
       if (isValidConfigId === "Invalid Mongo Object Id") {
           return {
             response: "configId is not valid",
           };
         }
       let configData = req.body;
       const updatedconfigData = await credentialConfig.findByIdAndUpdate(
        configId,
        { $set: configData },
        { new: true }
      );
       if(updatedconfigData){
        return {
          response : 'Config credential details updated sucessfully',
          data : updatedUserData
        }
      }else{
        return {
          response : 'Config credential details not  updated'
        }
      } 
    }catch(error){
      console.log(error);
      throw error
    }
};

const getCredentialForCompany = async (req,res) => {
    try{
    const companyId = req.query.companyId;
    let isValidCompanyId = FUNC.checkIsValidId(companyId);
    if (isValidCompanyId === "Invalid Mongo Object Id") {
        return {
          response: "companyId is not valid",
        };
      }
    let credentialData = await credentialConfig.find({companyId : companyId});
    if(credentialData){
      return {
        response : 'Config Credential Data Found',
        data : credentialData
      }
    }else{
      return {
        response : 'Config Credential Data Not Found'
      }
    }
    }catch(error){
      console.log(error);
      throw error
    }
};

const deleteCredential = async (req,res) => {
    try{
         let id = req.query.id;
         let deleteCred = await credentialConfig.deleteOne({_id : id});
         let isValidId = FUNC.checkIsValidId(id);
         if (isValidId === "Invalid Mongo Object Id") {
             return {
               response: "Query id is not valid",
             };
           }
         if(deleteCred){
          return {
            response : 'Credential deleted Sucessfully'
          }
         }
         else{
          return {
            response : 'Credential not deleted'
          }
         }
    }catch(error){
      console.log(error);
      throw error
    }
};

module.exports = {
    addCredntials,
    updateCredential,
    getCredentialForCompany,
    deleteCredential
}


const credentialConfig = require('../../models/ConfigCredential');
const FUNC = require('../../controllers/commonFunctions');
const addCredntials = async (req,res) => {
   try{
    const { userId, password, url, companyId,type:{token ,secretKey,urlActive,entityId,tempId} } = req.body;
    let isValidCompanyId = FUNC.checkIsValidId(companyId);
    if (isValidCompanyId === "Invalid Mongo Object Id") {
        return {
          response: "smptConfigId is not valid",
        };
      }
      let insertConfigData = await credentialConfig.insertOne({
        userId : userId || null,
        password : password || null,
        url : url || null,
        companyId : companyId || companyId,
        type : {
            token : token || null,
            secretKey : secretKey || null,
            urlActive : urlActive || null,
            entityId : entityId || null,
            tempId : tempId || null
        }
      });
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
          response : 'Config credential'
        }
      } 
    }catch(error){
      console.log(error);
      throw error
    }
};

const getCredentialForCompany = async (req,res) => {
    try{
    const companyId = req.query.companyId

    }catch(error){
     
    }
};

const deleteCredential = async (req,res) => {
    try{

    }catch(error){
     
    }
};

module.exports = {
    addCredntials,
    updateCredential,
    getCredentialForCompany,
    deleteCredential
}


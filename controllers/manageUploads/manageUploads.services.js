const manageUploadSchema = require('../../models/ManageUplods');
const FUNC = require('../commonFunctions/common.function');

const addImageUpload = async(req,res) => {
    try{
        let {type ,title, description,image,userId} = req.body;
        const fieldNames = [
            "type",
             "userId"
          ];
          const missingFields = fieldNames.filter(
            (fieldName) =>
            bankDetailsData[fieldName] === null || bankDetailsData[fieldName] === undefined
          );
          if (missingFields.length > 0) {
            const missingFieldsString = missingFields.join(", ");
            return {
              response: null,
              isSometingMissing: true,
              data: `Missing or null fields: ${missingFieldsString}`,
            };
          }
          const checkValidUserId =  FUNC.checkIsValidId(userId);
          if(!checkValidUserId == 'Invalid Mongo Object Id'){
            return {
               response : 'Invalid Mongo Object Id'
            }
         }
           let uploadData = new manageUploadSchema({
            type ,
            title, 
            description,
            image,
            userId
           })
           uploadData = await uploadData.save();
           if(uploadData){
             return {
                response : 'Data Upload Sucessfully'
             }
           }else{
            return {
                response : 'Data Not Upload Sucessfully'
             }
           }
    }catch(error){
       console.log(error);
       throw console.error();
    }
};

const getUploadImage = async (req,res) => {
    try{
    let userId = req.query.Id;
    let uploadImageData = await manageUploadSchema.find({userId : userId});
    if(uploadImageData){
        return {
            response : 'Image fetch Sucessfully'
        }   
    }else{
        return {
            response : 'Image not found'
        }
    }
    }catch(error){
       console.log(error);
       throw error
    }
};

const updateUploadImage = async (req,res) => {
    try{
         
        const imageDetailsId = req.query.id; 
        const updateData = req.body; 
  
      const updateImageDetails = await bankDetail.findByIdAndUpdate(
        imageDetailsId,
        { $set: updateData },
        { new: true }
      );
      if(updateImageDetails){
        return {
          response : 'Image details updated sucessfully',
          data : updatedBankDetails
        }
      }else{
        return {
          response : 'Failed to update Image details',
          data : updatedBankDetails
        }
      }
         
      }
      catch(error){
         console.log(error);
         throw error
      }
};

const deleteUploadImage = async (req,res) => {
    try{
    const { uploadImageDetailsId } = req.query; 
    //console.log(bankDetailsId , "<<<<<<<<<<==================>>>>>>>>>>>>>>>>")
    const deletedBankDetails = await bankDetail.findByIdAndRemove(uploadImageDetailsId);
    if(deletedBankDetails){
      return {
        response : 'Image details deleted successfully',
         data: deletedBankDetails
      }
    }
    else{
      return {
        response : 'Image details not found'
      }
    }
  }catch(error){
     console.log(error);
     throw error
  }
};

module.exports = {
    addImageUpload,
    getUploadImage,
    deleteUploadImage,
    updateUploadImage
}
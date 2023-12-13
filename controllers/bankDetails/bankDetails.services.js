const bankDetail = require('../../models/BankDetails');

const addBankDetails = async (bankDetailsData, file) => {
    try{
    const {
      companyId,
      accountName,
      accountNumber,
      ifscCode,
      bankAddress,
      bankName,
      bankCode,
      createdBy,
      modifyBy
    } = bankDetailsData;
    const fieldNames = [
      "companyId",
      "accountName",
      "accountNumber",
      "ifscCode",
      "bankAddress",
      "bankName",
      "bankCode"
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
    };
 
    const newBankDetails = new bankDetail({
      companyId,
      accountName,
      accountNumber,
      ifscCode,
      bankAddress,
      bankName,
      bankCode,
      createdBy,
      modifyBy,
      QrcodeImage: file
      ? {
          data: file.buffer,
          contentType: file.mimetype,
        }
      : undefined,
    });
    let checkIsAcountAlreadyExist = await bankDetail.findOne({accountNumber});
    if(checkIsAcountAlreadyExist){
      return {
        response : "This account number alrady exist"
      }
    }
    let  savedBankDetails = await newBankDetails.save();
    if(savedBankDetails){
        return {
            response : "Bank Details Added sucessfully",
            data : savedBankDetails
        }
    }
    else{
        return {
            response : "Some Datails is missing or bank detils not saved"
        }
    }
   
  }catch(error){
    console.log(error);
    throw error
  }
};

const getCompanyBankDetalis = async (req,res) => {
    try{
      const {companyId} = req.query; 

        let bankDetails = await bankDetail.find({ companyId : companyId });
        if(!bankDetails || bankDetails.length === 0){
            return {
                response : 'No any Bank details added for this company'
            }
        }
        else{
           return {
            response : 'Bank Details Fetch Sucessfully',
            data : bankDetails
           }
        }
    }catch(error){
      console.log(error);
      throw error
    }
}

const updateBankDetails = async (bankDetailsData, file) => {
    try{
      const {
        companyId,
        accountName,
        accountNumber,
        ifscCode,
        bankAddress,
        bankName,
        bankCode,
        createdBy,
        modifyBy,
        bankDetailsId
      } = bankDetailsData;

      const fieldNames = ["companyId", "accountName", "accountNumber", "ifscCode", "bankAddress", "bankName", "bankCode", "createdBy","modifyBy", "bankDetailsId"];
      const updatedFields = {};
  
      for (const field of fieldNames) {
        if (bankDetailsData[field] !== undefined && bankDetailsData[field] !== null) {
          updatedFields[field] = bankDetailsData[field];
        }
      };
  
      if (Object.keys(updatedFields).length === 0) {
        return {
          response: "No fields provided for update",
        };
      }
  
      const existingUploadData = await bankDetail.findById(bankDetailsId);
      if (!existingUploadData) {
        return {
          response: "Upload data not found",
        };
      }
  
      if (file) {
        existingUploadData.QrcodeImage.data = file.buffer;
        existingUploadData.QrcodeImage.contentType = file.mimetype;
      }
  
      Object.assign(existingUploadData, updatedFields);
      await existingUploadData.save();
   
      return {
        response : 'Bank details updated sucessfully',
        data : existingUploadData
      }
  
       
    }
    catch(error){
       console.log(error);
       throw error
    }
}

const deleteBankDetails = async (req,res) => {
  try{
    const { bankDetailsId } = req.query; 
    //console.log(bankDetailsId , "<<<<<<<<<<==================>>>>>>>>>>>>>>>>")
    const deletedBankDetails = await bankDetail.findByIdAndRemove(bankDetailsId);
    if(deletedBankDetails){
      return {
        response : 'Bank details deleted successfully',
         data: deletedBankDetails
      }
    }
    else{
      return {
        response : 'Bank details not found'
      }
    }
  }catch(error){
     console.log(error);
     throw error
  }
}
module.exports = {
    addBankDetails ,
    getCompanyBankDetalis,
    updateBankDetails,
    deleteBankDetails
}
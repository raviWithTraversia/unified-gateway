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
      QrcodeImage: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    });
  
    const savedBankDetails = await newBankDetails.save();
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
        const comapnyId = req.params.comapnyId;

        let bankDetails = await bankDetail.find({ companyId : comapnyId });
        if(!bankDetails){
            return {
                response : 'No any Bank details added for this company'
            }
        }
        else{
           return {
            responce : 'Bank Details Fetch Sucessfully',
            data : bankDetails
           }
        }
    }catch(error){
      console.log(error);
      throw error
    }
}

const updateBankDetails = async (req,res) => {
    try{


    }
    catch{

    }
}

module.exports = {
    addBankDetails ,
    getCompanyBankDetalis
}
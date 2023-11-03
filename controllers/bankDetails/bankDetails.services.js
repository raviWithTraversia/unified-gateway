const bankDetail = require('../../models/BankDetails');

const addBankDetails = async (req,res) => {
    try{
        const { 
            companyId,
            accountName,
            accountNumber,
            ifscCode,
            bankAddress,
            bankName,
            bankCode,
            uploadQRCode
        } = req.body;

        const requiredFields = [
            'companyId',
            'accountName',
            'accountNumber',
            'ifscCode',
            'bankAddress',
            'bankName',
            'bankCode',
            'uploadQRCode',
          ];
      
          for (const field of requiredFields) {
            if (!(field in req.body)) {
                return {
                    response :  `Missing field: ${field}`
                }
            }
          }

          let addAccountDatail = new bankDetail({
            companyId,
            accountName,
            accountNumber,
            ifscCode,
            bankAddress,
            bankName,
            bankCode,
            uploadQRCode
          });
          await addAccountDatail.save();
          return {
            responce : "Bank Details save sucessfully"
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
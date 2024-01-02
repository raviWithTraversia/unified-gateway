const bankDetail = require("../../models/BankDetails");

const addBankDetails = async (req, res) => {
  try {
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
    } = req.body;
    
    const fieldNames = [
      "companyId",
      "accountName",
      "accountNumber",
      "ifscCode",
      "bankAddress",
      "bankName",
      "bankCode",
      "createdBy",
      "modifyBy"
    ];
    
    const missingFields = fieldNames.filter(
      fieldName => req.body[fieldName] === null || req.body[fieldName] === undefined
    );
    
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSomethingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`
      };
    }
    
    let checkIfAccountNoExist = await bankDetail.find({accountNumber :accountNumber });
    if(checkIfAccountNoExist.length > 0){
      return{
        response : 'This Account Number alerady Exist'
      }
    };
  //  console.log(req.files, "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmbbbbbbbbbbbbbbbbbbbbbbbbb");
    let savedBankDetails;
    if(req.files?.QrcodeImage){
      const newBankDetails = new bankDetail({
        companyId,
        accountName,
        accountNumber,
        ifscCode,
        bankAddress,
        bankName,
        bankCode,
        QrcodeImagePath: req?.files?.QrcodeImage[0]?.path || null,
        createdBy,
        modifyBy ,
      });
      savedBankDetails = await newBankDetails.save();
    }else{
      const newBankDetails = new bankDetail({
        companyId,
        accountName,
        accountNumber,
        ifscCode,
        bankAddress,
        bankName,
        bankCode,
        QrcodeImagePath: null,
        createdBy,
        modifyBy ,
      });
      savedBankDetails = await newBankDetails.save();

    }
   
   
   

    if (savedBankDetails) {
      return {
        response: "Bank Details Added sucessfully",
        data: savedBankDetails,
      };
    } else {
      return {
        response: "Some Datails is missing or bank detils not saved",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCompanyBankDetalis = async (req, res) => {
  try {
    const { companyId } = req.query;

    let bankDetails = await bankDetail.find({ companyId: companyId });
    if (!bankDetails || bankDetails.length === 0) {
      return {
        response: "No any Bank details added for this company",
      };
    } else {
      return {
        response: "Bank Details Fetch Sucessfully",
        data: bankDetails,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateBankDetails = async (req,res) => {
  try {
    
    let {id} = req.query;
    let dataForUpdate = {
      ...req.body
    }
    console.log(req.files)
    let updateBankDetails;
    if(req.files?.QrcodeImage){
       updateBankDetails = await bankDetail.findByIdAndUpdate(
        id,
        {
          $set: dataForUpdate,
          modifyAt: new Date(),
          QrcodeImagePath :  req?.files?.QrcodeImage[0]?.path || null

        },
        { new: true }
      );
      }else{
        updateBankDetails = await bankDetail.findByIdAndUpdate(
          id,
          {
            $set: dataForUpdate,
            modifyAt: new Date()
          },
          { new: true }
        );
      }
    if (!updateBankDetails) {
      return {
        response: "Bank details not updated ",
      };
    }
    return {
      response: "Bank details updated sucessfully",
      data: updateBankDetails,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteBankDetails = async (req, res) => {
  try {
    const  id  = req.params.id;
    const deletedBankDetails = await bankDetail.findByIdAndDelete(
      id
    );
    console.log()
    if (deletedBankDetails) {
      return {
        response: "Bank details deleted successfully",
        data: deletedBankDetails,
      };
    } else {
      return {
        response: "Bank details not found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  addBankDetails,
  getCompanyBankDetalis,
  updateBankDetails,
  deleteBankDetails,
};

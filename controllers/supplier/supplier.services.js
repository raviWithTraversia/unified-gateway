const supplier = require('../../models/Supplier');
const SupplierCode = require('../../models/supplierCode');
const FUNC = require('../commonFunctions/common.function');

const addSupplier = async (req,res) => {
    try{
      let {
        cadeId,
        companyId,
        supplierCodeId,
        supplierUserId,
        supplierPassword,
        supplierSudo,
        accountNumber,
        accountPassword,
        accountVersion,
        credentialsType,
        status,
        supplierOfficeId,
        domesticExcludeAirline,
        domesticIncludeAirline,
        searchAllow,
        bookAllow,
        importAllow,
        productClass,
        fareType,
        GKPnrAllow,
        internationalncludeAirline,
        internationalExcludeAirline,
        billingAccountCode,
        supplierWsapSesssion,
      } = req.body;
    let checkIsValidCompanyId = FUNC.checkIsValidId(companyId);
    let checkValidSupplierCodeId = FUNC.checkIsValidId(supplierCodeId);
    if(checkIsValidCompanyId == 'Valid Mongo Object Id' && checkValidSupplierCodeId == 'Valid Mongo Object Id' ){
      let newSupplier = new supplier({
        cadeId,
        companyId,
        supplierCodeId,
        supplierUserId,
        supplierPassword,
        supplierSudo,
        accountNumber,
        accountPassword,
        accountVersion,
        credentialsType,
        status,
        supplierOfficeId,
        domesticExcludeAirline,
        domesticIncludeAirline,
        searchAllow,
        bookAllow,
        importAllow,
        productClass,
        fareType,
        GKPnrAllow,
        internationalncludeAirline,
        internationalExcludeAirline,
        billingAccountCode,
        supplierWsapSesssion
      });
      newSupplier = await newSupplier.save();
      if(newSupplier){
        return{
            response : 'new Supplier added',
            data : newSupplier
        }
      }
      else{
        return{
            response : 'Supplier not added',
            data : null
        }
      }
    }else{
       return {
        response : 'Invalid Mongo Object Id',
        data : null
       }
    }

    }catch(error){
        console.log(error);
        throw error;
    }
};

const updateSupplier = async (req,res) =>{
    try{
     let supplierId = req.query.id;
     let supplierdata = req.body;
     const updatedSupplierData = await supplier.findByIdAndUpdate(
        supplierId,
        { $set: supplierdata },
        { new: true }
      );
      if(updatedSupplierData){
         return {
            response : 'Supplier Data Updated Sucessfully'
         }
      }else{
          
          return {
            response : 'Supplier data not updated'
          }
      }
       
    }catch(error){
        console.log(error);
        throw error;
    }
};

const getSupplier = async (req,res) => {
    try{
       let id = req.query.id;
       let checkValidIds = FUNC.checkIsValidId(id);
       if(checkValidIds == 'Invalid Mongo Object Id'){
         return {
            response : 'Invalid Mongo Object Id'
         }
       }
       let supplierData =  await supplier.find({companyId :id }).populate({
        path: 'supplierCodeId',
        select: 'supplierCode'
      }).exec();

       if(supplierData){
         return {
            response : 'Supplier Data Fetch Sucessfully',
            data : supplierData
         }
       }else{
        return {
            response : 'Supplier Data Not Found'
        }
       }

    }catch(error){
      console.log(error);
      throw error;
    }
};

module.exports = {
    addSupplier,
    updateSupplier,
    getSupplier
}

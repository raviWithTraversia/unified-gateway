const supplierCodes = require('../../models/supplierCode');

const addSupplierCode = async (req,res) => {
    try{
    let {supplierCode , status} = req.body;
    let addSupplierCodeData = new supplierCodes ({
        supplierCode,
        status
    });
    addSupplierCodeData = await addSupplierCodeData.save();
    if(addSupplierCodeData){
       return {
         response : 'Add Supplier Code Sucessfully',
         data : addSupplierCodeData
       }
    }else{
       return {
         response : 'Supplier Code not added'
       } 
    }
    }catch(error){
        console.log(error);
        throw error
    }
}

const getSupplierCode = async (req,res) => {
  try{
    let supplierCodeData = await supplierCodes.find();
    if(supplierCodeData){
        return {
            response : 'Data Fetch Sucessfully',
            data : supplierCodeData
        }
    }else{
        return{
            response : null
        }
    }

  }catch(error){
     console.log(error);
     throw error
  }
};

module.exports = {
    addSupplierCode,
    getSupplierCode
}
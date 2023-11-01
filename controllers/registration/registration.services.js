const registration = require('../../models/Registration');
const FUNC = require('../../controllers/commonFunctions/common.function')

const addRegistration = async(req,res) => {
 try {
let { 
      companyId , 
      companyName, 
      panNumber, 
      panName, 
      firstName , 
      lastName , 
      saleInChargeId , 
      email, 
      mobile, 
      gstNumber, 
      gstName, 
      gstAddress, 
      street, 
      pincode, 
      country, 
      state, 
      city, 
      remark, 
      roleId,
      statusId,
      type,
      isIATA
         } = req.body;

const fieldNames = [
        'companyId',
        'companyName',
        'panNumber',
        'panName',
        'firstName',
        'lastName',
        'saleInChargeId',
        'email',
        'mobile',
        'gstNumber',
        'gstName',
        'gstAddress',
        'street',
        'pincode',
        'country',
        'state',
        'city',
        'statusId',
        'roleId',
        'type',
        'isIATA'
      ];
 const missingFields = fieldNames.filter((fieldName) => req.body[fieldName] === null || req.body[fieldName] === undefined);
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(', ');
    return {
        response : null,
        isSometingMissing : true,
        data : `Missing or null fields: ${missingFieldsString}` 
    }
   
  }

  let isValidStatusId = FUNC.checkIsValidId(statusId);
  let isValidsaleInChargeId = FUNC.checkIsValidId(saleInChargeId);
  let iscountry = FUNC.checkIsValidId(country);
  let isState = FUNC.checkIsValidId(state);
  let isroleId = FUNC.checkIsValidId(roleId)

  if(isValidStatusId === "Invalid Mongo Object Id"){
    return {
     response : "Status Id is not valid"
    }
  }
  if(isValidsaleInChargeId === "Invalid Mongo Object Id"){
     return {
        response : "Sale incharge Id is not valid"
     }
  }

  if(iscountry === "Invalid Mongo Object Id"){
    return {
     response : "Country Id is not valid"
    }
  }

  if(isState === "Invalid Mongo Object Id"){
    return {
        response : "State Id is not valid"
    }
  }

  if(isroleId === "Inavlid Mongo Object Id"){
    return {
        response : "Role Id is not valid"
    }
  }
  const existingRegistrationWithEmail = await registration.findOne({ email });
  if(existingRegistrationWithEmail){
    return {
        response : 'Email already exists'
    }
  }
  const existingRegistrationWithMobile = await registration.findOne({ mobile });
  if(existingRegistrationWithMobile){
    return {
        response : 'Mobile number already exists'
    }
  }

    
const newRegistration = new registration({
        companyId , 
        companyName, 
        panNumber, 
        panName, 
        firstName , 
        lastName , 
        saleInChargeId , 
        email, 
        mobile, 
        gstNumber, 
        gstName, 
        gstAddress, 
        street, 
        pincode, 
        country, 
        state, 
        city, 
        remark, 
        statusId,
        roleId,
        type,
        isIATA
});
await newRegistration.save();
return {
    response : `New registration created successfully`,
    data : newRegistration
}

 }catch(error){
    console.log(error);
    throw error;
 }
}

const getAllRegistration = async(req,res) => {
    try{
     let getAllRegistartion = await registration.find();
     return {
        response : "All registrationData fetch",
        data : getAllRegistartion
     }
    }catch(error){
     console.log(error);
     throw error;
    }

}

const getAllRegistrationByCompany = async(req,res) => {
   try{
    const comapnyId = req.params.companyId;
    if(!comapnyId){
        return {
            response : null,
            message : "Company Id not true"
        }
    }
    const registrationData = await registration.find({companyId : comapnyId});
    if(!registrationData){
        return {
            response : null,
            message : "Registration Data not found by this companyId"
        }
    }
    else{
        return {
            response : "Registration data found sucessfully",
            data : registrationData
        }
    }


   }catch(error){
    console.log(error);
    throw error;
   }
}

module.exports = {
    addRegistration,
    getAllRegistration,
    getAllRegistrationByCompany
}
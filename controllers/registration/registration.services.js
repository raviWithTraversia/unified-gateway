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
      street, 
      pincode, 
      country, 
      state, 
      city, 
      remark, 
      isIATA,
      roleId ,
      gstNumber,
      gstName,
      gstAddress
         } = req.body;

// const fieldNames = [
//         'companyId',
//         'companyName',
//         'panNumber',
//         'panName',
//         'firstName',
//         'lastName',
//         'saleInChargeId',
//         'email',
//         'mobile',
//         'street',
//         'pincode',
//         'country',
//         'state',
//         'city',
//         'roleId',
//         'isIATA'
//       ];
//  const missingFields = fieldNames.filter((fieldName) => req.body[fieldName] === null || req.body[fieldName] === undefined);
//   if (missingFields.length > 0) {
//     const missingFieldsString = missingFields.join(', ');
//     return {
//         response : null,
//         isSometingMissing : true,
//         data : `Missing or null fields: ${missingFieldsString}` 
//     }
   
//   }

  let isValidsaleInChargeId = FUNC.checkIsValidId(saleInChargeId);
  let iscountry = FUNC.checkIsValidId(country);
  let isState = FUNC.checkIsValidId(state);
  let isroleId = FUNC.checkIsValidId(roleId)

 
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
        street, 
        pincode, 
        country, 
        state, 
        city, 
        remark, 
        roleId,
        isIATA,
        gstAddress,
        gstName,
        gstNumber
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

const updateRegistration = async (req,res) => {
  try{
    const {registrationId, statusId, remark} = req.body;
    let checkIsValidregistrationId = FUNC.checkIsValidId(registrationId);
    let checkIsValidstatusId = FUNC.checkIsValidId(statusId);
    if(!checkIsValidregistrationId || !checkIsValidstatusId){
      return {
        response : 'Please pass valid registrationId or statusId'
      }
    }
    const updateRegistration = await registration.findOneAndUpdate(
      {_id : registrationId},
      {
        $set: {
          statusId: statusId,
          remark : remark
        }
      }
  );
  if(!updateRegistration){
    return {
      response : 'Registration data is not updated'
    }
  }
  else{
    return {
      response : 'Registration data updated sucessfully'
    }
  }
    
  }catch(error){
    console.log(error);
    throw error
  }
}

module.exports = {
    addRegistration,
    getAllRegistration,
    getAllRegistrationByCompany,
    updateRegistration
}
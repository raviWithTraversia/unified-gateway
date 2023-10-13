const registration = require('../../models/registration');

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
      statusId, 
      timestamp } = req.body;

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
        'timestamp',
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
        timestamp
});
await registration.save();
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
    const registrationData = await registration.find({comapnyId});
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
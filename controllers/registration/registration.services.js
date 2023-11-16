const registration = require('../../models/Registration');
const FUNC = require('../../controllers/commonFunctions/common.function');
const status = require('../../models/Registration');
const Company = require("../../models/Company");
const Smtp = require("../../models/smtp");

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
      roleId ,
      gstNumber,
      gstName,
      gstAddress,
      isIATA
         } = req.body;

const fieldNames = [
        'companyId',
        'companyName',
        'panNumber',
        'panName',
        'firstName',
        'lastName',
        'email',
        'mobile',
        'street',
        'pincode',
        'country',
        'state',
        'city',
        'roleId'
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

  let iscountry = FUNC.checkIsValidId(country);
  let isState = FUNC.checkIsValidId(state);
  let isroleId = FUNC.checkIsValidId(roleId);

 if(saleInChargeId == "" || saleInChargeId == '' || !saleInChargeId){
  saleInChargeId = null;
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
  if(saleInChargeId !== null){
    let issaleInChargeId = FUNC.checkIsValidId(saleInChargeId);
    if(issaleInChargeId === "Invalid Mongo Object Id"){
      return {
          response : "State Id is not valid"
      }
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
        saleInChargeId, 
        email, 
        mobile,  
        street, 
        pincode, 
        country, 
        state, 
        city, 
        remark, 
        roleId,
        gstAddress,
        gstName,
        gstNumber,
        ...isIATA
});
let newRegistrationRes  = await newRegistration.save();
console.log(newRegistrationRes);
let comapnyIds =  companyId;
let mailConfig = await Smtp.findOne({ companyId : comapnyIds });
let mailText  = newRegistrationRes;
let mailSubject = `New registration created successfully`
if(newRegistrationRes){
 let mailRes =  await FUNC.commonEmailFunction(email,mailConfig,mailText,mailSubject);
// console.log(mailRes, "==============================");
return {
    response : `${mailSubject}`,
    data : newRegistration
}
}else{
  return {
    response : `Registration Failed!`,
}
}
 }catch(error){
    console.log(error);
    throw error;
 }
}

const getAllRegistration = async(req,res) => {
    try{
    // let getAllRegistartion = await registration.find();
    let getAllRegistartion =   await registration.aggregate([
      {
        $lookup: {
          from: "status",
          localField: "statusId",
          foreignField: "_id",
          as: "statusName"
        }
      },
      {
      $project: {
      _id: 1,
      companyId: 1,
      companyName: 1,
      panNumber: 1,
      panName: 1,
      firstName: 1,
      lastName: 1,
      saleInChargeId: 1,
      email: 1,
      mobile: 1,
      gstNumber: 1,
      gstName: 1,
      gstAddress: 1,
      street: 1,
      pincode: 1,
      country: 1,
      state: 1,
      city: 1,
      remark: 1,
      statusId: 1,
      isIATA: 1,
      createdAt: 1,
      updatedAt: 1,
          statusName: { name: { $arrayElemAt: ["$statusName.name", 0] } } // Projection for the '_id' field
        }
      }
    ]);
  
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
    };
   // const registrationData = await registration.find({companyId : comapnyId});

   let aggregrationRes = await registration.aggregate([
    { 
      $match: { companyId: comapnyId } 
    },
    {
      $lookup: {
        from: "status",
        localField: "statusId",
        foreignField: "_id",
        as: "statusName"
      }
    },
    {
      $project: {
        _id: 1,
        companyId: 1,
        companyName: 1,
        panNumber: 1,
        panName: 1,
        firstName: 1,
        lastName: 1,
        saleInChargeId: 1,
        email: 1,
        mobile: 1,
        gstNumber: 1,
        gstName: 1,
        gstAddress: 1,
        street: 1,
        pincode: 1,
        country: 1,
        state: 1,
        city: 1,
        remark: 1,
        statusId: 1,
        isIATA: 1,
        createdAt: 1,
        updatedAt: 1,
        statusName: { name: { $arrayElemAt: ["$statusName.name", 0] } }
      }
    }
  ]);
  


    if(!aggregrationRes){
        return {
            response : null,
            message : "Registration Data not found by this companyId"
        }
    }
    else{
        return {
            response : "Registration data found sucessfully",
            data : aggregrationRes
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
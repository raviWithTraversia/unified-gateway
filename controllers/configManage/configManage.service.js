const airGstMandate = require('../../models/configManage/AirGSTMandate');

const addGSTMandate = async(req,res) => {
 try {
let { 
      companyId, 
      airLine, 
      fareFamily, 
      promoCode
         } = req.body;

const fieldNames = [
        'companyId',
        'airLine',
        'fareFamily',
        'promoCode'
        
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
    
const newAirGSTMandate = new airGstMandate({
        companyId , 
        airLine, 
        fareFamily, 
        promoCode

});
let newAirGSTMandateRes  = await newAirGSTMandate.save();
console.log(newAirGSTMandateRes);

 }catch(error){
    console.log(error);
    throw error;
 }
}

// const getAllRegistration = async(req,res) => {
//     try{
//     // let getAllRegistartion = await registration.find();
//     let getAllRegistartion =   await registration.aggregate([
//       {
//         $lookup: {
//           from: "status",
//           localField: "statusId",
//           foreignField: "_id",
//           as: "statusName"
//         }
//       },
//       {
//       $project: {
//       _id: 1,
//       companyId: 1,
//       companyName: 1,
//       panNumber: 1,
//       panName: 1,
//       firstName: 1,
//       lastName: 1,
//       saleInChargeId: 1,
//       email: 1,
//       mobile: 1,
//       gstNumber: 1,
//       gstName: 1,
//       gstAddress: 1,
//       street: 1,
//       pincode: 1,
//       country: 1,
//       state: 1,
//       city: 1,
//       remark: 1,
//       statusId: 1,
//       isIATA: 1,
//       createdAt: 1,
//       updatedAt: 1,
//           statusName: { name: { $arrayElemAt: ["$statusName.name", 0] } } // Projection for the '_id' field
//         }
//       }
//     ]);
  
//      return {
//         response : "All registrationData fetch",
//         data : getAllRegistartion
//      }
//     }catch(error){
//      console.log(error);
//      throw error;
//     }

// }

// const getAllRegistrationByCompany = async(req,res) => {
//    try{
//     const comapnyId = req.params.companyId;
//     if(!comapnyId){
//         return {
//             response : null,
//             message : "Company Id not true"
//         }
//     };
//    // const registrationData = await registration.find({companyId : comapnyId});

//    let aggregrationRes = await registration.aggregate([
//     { 
//       $match: { companyId: comapnyId } 
//     },
//     {
//       $lookup: {
//         from: "status",
//         localField: "statusId",
//         foreignField: "_id",
//         as: "statusName"
//       }
//     },
//     {
//       $project: {
//         _id: 1,
//         companyId: 1,
//         companyName: 1,
//         panNumber: 1,
//         panName: 1,
//         firstName: 1,
//         lastName: 1,
//         saleInChargeId: 1,
//         email: 1,
//         mobile: 1,
//         gstNumber: 1,
//         gstName: 1,
//         gstAddress: 1,
//         street: 1,
//         pincode: 1,
//         country: 1,
//         state: 1,
//         city: 1,
//         remark: 1,
//         statusId: 1,
//         isIATA: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         statusName: { name: { $arrayElemAt: ["$statusName.name", 0] } }
//       }
//     }
//   ]);
  


//     if(!aggregrationRes){
//         return {
//             response : null,
//             message : "Registration Data not found by this companyId"
//         }
//     }
//     else{
//         return {
//             response : "Registration data found sucessfully",
//             data : aggregrationRes
//         }
//     }
//    }catch(error){
//     console.log(error);
//     throw error;
//    }
// }

// const updateRegistration = async (req,res) => {
//   try{
//     const {registrationId, statusId, remark} = req.body;
//     let checkIsValidregistrationId = FUNC.checkIsValidId(registrationId);
//     let checkIsValidstatusId = FUNC.checkIsValidId(statusId);
//     if(!checkIsValidregistrationId || !checkIsValidstatusId){
//       return {
//         response : 'Please pass valid registrationId or statusId'
//       }
//     }
//     const updateRegistration = await registration.findOneAndUpdate(
//       {_id : registrationId},
//       {
//         $set: {
//           statusId: statusId,
//           remark : remark
//         }
//       }
//   );
//   if(!updateRegistration){
//     return {
//       response : 'Registration data is not updated'
//     }
//   }
//   else{
//     return {
//       response : 'Registration data updated sucessfully'
//     }
//   }
    
//   }catch(error){
//     console.log(error);
//     throw error
//   }
// }

module.exports = {
    addGSTMandate,
    // getAllRegistration,
    // getAllRegistrationByCompany,
    // updateRegistration
}
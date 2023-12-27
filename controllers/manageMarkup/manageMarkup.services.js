const manageMarkupModel = require('../../models/ManageMarkup');
const userModel = require('../../models/User');

const addMarkup = async (req,res) => {
try{  
     let {
        markupData,
        airlineCodeId,
        markUpOn,
        markUpFor,
        companyId
} = req.body;
//let userId = '658165afff75194ba3f9f574';
console.log(userId)

let checkIsRole =  await userModel.findById(userId).populate('roleId').exec();

if(checkIsRole.roleId.name == "Agency" || checkIsRole.roleId.name == "Distributer" ){
    let markupChargeInsert =  await manageMarkupModel.create({
        markupData,
        airlineCodeId,
        markUpOn,
        markUpFor,
        companyId,
        modifyBy : userId,
        createdBy : userId
  });
  markupChargeInsert = await markupChargeInsert.save();
if (markupChargeInsert) {
  return {
    data: markupChargeInsert,
    response: "MarkUp Charges Insert Sucessfully",
  };
} else {
  return {
    response: "MarkUp Charges Charges Not Added",
  };
}
}
else{
return {
    response : `User Dont have permision to add MarkUp Charges `
}
}
}catch(error){
    console.log(error);
    throw error
}

};
const updateMarkup = async (req,res) => {
    try {

      //  let updateDetails =  await manageMarkupModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
         let { markupId } = req.query;
        let dataForUpdate = { ...req.body};
        console.log(dataForUpdate)
        console.log("=========>>>>>>>1111111111111",dataForUpdate, "1111111111111111111<<<<<<<<===========")
         
        let updateDetails = await manageMarkupModel.findByIdAndUpdate(
            markupId,
            {
              $set: dataForUpdate,
            },
            { new: true }
        );
     //   console.log("=====.....>>>>>>>>22222222222222",updateDetails, "22222222222222<<<<<<<=======")
      
        if (!updateDetails) {
          return {
            response: "MarkUp data not found",
          };
        } else {
          return {
            response: "Markup Data updated successfully",
          };
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
};
const deletedMarkup = async(req,res) => {
    try{
        const { markupId } = req.query;
        const deleteMarkupDetails = await manageUploadSchema.findByIdAndRemove(
            markupId
        );
        if (deleteMarkupDetails) {
          return {
            response: "Markup details deleted successfully",
            data: deleteMarkupDetails,
          };
        } else {
          return {
            response: "Markup details not found",
          };
        }

    }catch(error){
     console.log(error);
     throw error
    }
};

const getMarkUp = async(req,res) => {
    try{
    
    

    }catch(error){

    }
}
module.exports = {
    addMarkup ,
    deletedMarkup,
    updateMarkup,
    getMarkUp
}
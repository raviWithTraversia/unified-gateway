const manageMarkupModel = require('../../models/ManageMarkup');
const userModel = require('../../models/User');

const addMarkup = async (req,res) => {
try{  
     let {
        markupData,
        airlineCodeId,
        markupOn,
        markupFor,
        companyId
} = req.body;
let userId = '658165afff75194ba3f9f574';
console.log(userId)
let checkMarkupExist = await manageMarkupModel.find({airlineCodeId : airlineCodeId ,markupOn :markupOn, markupFor :markupFor,companyId :companyId});
console.log(checkMarkupExist , "vvvvvv")
if (checkMarkupExist?.length > 0) {
  return {
    response : 'This Markup already exists!'
  }
}
let checkIsRole =  await userModel.findById(userId).populate('roleId').exec();

if(checkIsRole.roleId.name == "Agency" || checkIsRole.roleId.name == "Distributer" ){
    let markupChargeInsert =  await manageMarkupModel.create({
        markupData,
        airlineCodeId,
        markupOn,
        markupFor,
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

        let { markupId } = req.query;
        let dataForUpdate = { ...req.body};    
        let updateDetails = await manageMarkupModel.findByIdAndUpdate(
            markupId,
            {
              $set: dataForUpdate,
            },
            { new: true }
        );
      
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
        const deleteMarkupDetails = await manageMarkupModel.findByIdAndRemove(
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
      let { companyId } = req.query;
     let data =  await manageMarkupModel.find({companyId : companyId });
     let res = data.map(({ markupData, ...rest }) => {
      return { markupData, ...rest };
    });
    if(res){
      return{
        response : 'Markup Data Fetch Sucessfully',
        data : res
       }
    }else{
      return {
        response : 'Markup Data not found'
      }
    }
    
 
    }catch(error){
     console.log(error);
     throw error
    }
}
module.exports = {
    addMarkup ,
    deletedMarkup,
    updateMarkup,
    getMarkUp
}
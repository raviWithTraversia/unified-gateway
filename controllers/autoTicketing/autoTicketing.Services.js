const autoTicketingModel = require("../../models/AutoTicketing");
const supplierCodeModel = require("../../models/supplierCode");
const addAutoTicketingConfig = async (req, res) => {
  try {
    req.body.modifyBy = req?.user?._id;
    if(req.body.provider){
      let checkIsSupplierActive = await supplierCodeModel.find({_id : req.body.provider});
    // console.log("===>>>>>>>>", checkIsSupplierActive);
     if(checkIsSupplierActive[0].status == false){
      return {
        response : 'Supplier is not Active'
      }
     }
    }
    let query = {};
    if(req.body.provider){
      query.provider = req.body.provider
    }
    if(req.body.airLineList){
      query.airLineList = req.body.airLineList
    }
    if(req.body.companyId){
      query.companyId = req.body.companyId
    }
    if(req.body.travelType){
      query.travelType = req.body.travelType
    }
    let checkIsautoTicketingDataExist = await autoTicketingModel.find(query);
    if(checkIsautoTicketingDataExist.length > 0){
      return {
        response : 'This Auto Tickerting Data Is Already Exist'
      }
    }
    const autoTicketingData = await autoTicketingModel.create(req.body);
    if (autoTicketingData) {
      return {
        response: "Auto Ticketing Configuration is created",
        data: [autoTicketingData],
      };
    } else {
      return {
        response: "Auto Ticketing Configuration is not created",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getAutoTicketingConfig = async (req, res) => {
  try {
    let companyId = req.query.companyId;
    let autoTicketingData = await autoTicketingModel.find({ companyId: companyId }).populate('provider');
   // console.log("===>>>>>>>>>>",autoTicketingData)
    if (autoTicketingData.length > 0) {
      return {
        response: "Auto Ticketing Configuration Data sucessfully Fetch",
        data: autoTicketingData,
      };
    } else {
      return {
        response: "Auto Ticketing Configuration Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const editAutoTicketingConfig = async (req, res) => {
  try {
    let id = req.query.id;

    const updateData = req.body;

    const updatedAutoTicketing = await autoTicketingModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedAutoTicketing) {
      return {
        response: "Auto Ticketing is not updated",
      };
    } else {
      return {
        response: "Auto Ticketing is updated sucessfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const deleteAutoTicketingConfig = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteDi = await autoTicketingModel.findByIdAndDelete(id);
    if (deleteDi) {
      return {
        response: "Auto Ticketing Configuration data deleted sucessfully",
      };
    } else {
      return {
        response: "Auto Ticketing Configuration data not deleted",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = {
  addAutoTicketingConfig,
  getAutoTicketingConfig,
  editAutoTicketingConfig,
  deleteAutoTicketingConfig,
};

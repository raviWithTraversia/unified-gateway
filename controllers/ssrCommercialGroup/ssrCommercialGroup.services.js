const ssrCommercialGroupModels = require("../../models/SsrCommercialGroup");
const ssrCommercial = require("../../models/SsrCommercial");
const agencyGroup = require("../../models/AgencyGroup");
const user=require('../../models/User')
const EventLogs=require('../logs/EventApiLogsCommon')
const addSsrCommercialGroup = async (req, res) => {
  try {
    let { ssrCommercialIds, ssrCommercialName, companyId, isDefault } =
      req.body;
    let ssrCommercialGroupNameExist = await ssrCommercialGroupModels.findOne({
      companyId,
      ssrCommercialName,
    });
    if (ssrCommercialGroupNameExist) {
      return {
        response:
          "Ssr Commercial Group With The Same Name Already Exists For This Company",
        data: [],
      };
    }
    if (isDefault === true) {
      let checkIsAnydefaultTrue = await ssrCommercialGroupModels.updateMany(
        { companyId },
        { isDefault: false }
      );
    }
    const newSsrCommercialGroup = new ssrCommercialGroupModels({
      ssrCommercialIds,
      ssrCommercialName,
      companyId,
      modifyAt: new Date(),
      modifyBy: req.user._id,
      isDefault,
    });
    const saveFareRuleGroup = await newSsrCommercialGroup.save();
    if (saveFareRuleGroup) {
      const userData=await user.findById(req.user._id)
      const LogsData={
                  eventName:"Manage SSR Groups",
                  doerId:req.user._id,
              doerName:userData.fname,
       companyId:companyId,
       documentId:saveFareRuleGroup._id,
                   description:"Add Manage SSR Groups",
                }
               EventLogs(LogsData)
      return {
        response: "Ssr Commercial Group Added Sucessfully",
        data: [],
      };
    } else {
      return {
        response: "Ssr Commercial Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const editSsrCommercialGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body,
    };

    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue = await ssrCommercialGroupModels.updateMany(
        { companyId: updateData.companyId },
        { isDefault: false }
      );
    }
    let updateSsrCommercialData = await ssrCommercialGroupModels.findByIdAndUpdate(
        id,
        {
          $set: updateData,
          modifyAt: new Date(),
          modifyBy: req.user._id,
        },
        { new: true }
      );

    const userData=await user.findById(req.user._id)

    if (updateSsrCommercialData) {      
      await agencyGroup.findOneAndUpdate(
        { companyId: updateData.companyId, isDefault: true },
        { ssrCommercialGroupId: id },
        { new: true }
      );

      const LogsData={
        eventName:"Manage SSR Groups",
        doerId:req.user._id,
    doerName:userData.fname,
companyId:updateSsrCommercialData.companyId,
documentId:updateSsrCommercialData._id,
         description:"Edit Manage SSR Groups",
      }
     EventLogs(LogsData)
      
        return {
          response: "Ssr Commercial Group Updated Sucessfully",
          data: updateSsrCommercialData,
        };
      
      
    } else {
      return {
        response: "Ssr Commercial Group Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSsrCommercialGroup = async (req, res) => {
  try {
    let {companyId , bookingType} = req.query;
    let getSsrCommercial;
    if(!bookingType){
      try {
        getSsrCommercial = await ssrCommercialGroupModels.find({
          companyId: companyId,
        });
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",getSsrCommercial, "<<<<<<<<<<<")
  
        for (let i = 0; i < getSsrCommercial.length; i++) {
          let converteSsrCommercialIds = getSsrCommercial[i].ssrCommercialIds.map(
            (id) => id.toString()
          );
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",converteSsrCommercialIds)
  
          let documents = await ssrCommercial
          .find({
            _id: { $in: converteSsrCommercialIds }, 
           // bookingType: { $in: bookingType }      
          })
          .exec();
          // console.log("==>>>",documents)
          getSsrCommercial[i].ssrCommercialIds = documents;
          //console.log("[[[[[[[[[[[[[[[[[[[",documents)
        }
         console.log("[[[[[[[[[[[[[[[[[[[",getSsrCommercial, "]]]]]]]]]]]]]]]]]]")
        if (getSsrCommercial) {
          return {
            response: "Ssr Commercial Group Fetch Sucessfully",
            data: getSsrCommercial,
          };
        } else {
          return {
            response: "Ssr Commercial Group Not Found",
          };
        }
      } catch (error) {
        throw error;
      }
    }else{
      try {
        getSsrCommercial = await ssrCommercialGroupModels.find({
          companyId: companyId,
        });
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",getSsrCommercial, "<<<<<<<<<<<")
  
        for (let i = 0; i < getSsrCommercial.length; i++) {
          let converteSsrCommercialIds = getSsrCommercial[i].ssrCommercialIds.map(
            (id) => id.toString()
          );
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",converteSsrCommercialIds)
  
          let documents = await ssrCommercial
          .find({
            _id: { $in: converteSsrCommercialIds }, 
            bookingType: { $in: bookingType }      
          })
          .exec();
          // console.log("==>>>",documents)
          getSsrCommercial[i].ssrCommercialIds = documents;
          //console.log("[[[[[[[[[[[[[[[[[[[",documents)
        }
         console.log("[[[[[[[[[[[[[[[[[[[",getSsrCommercial, "]]]]]]]]]]]]]]]]]]")
        if (getSsrCommercial) {
          return {
            response: "Ssr Commercial Group Fetch Sucessfully",
            data: getSsrCommercial,
          };
        } else {
          return {
            response: "Ssr Commercial Group Not Found",
          };
        }
      } catch (error) {
        throw error;
      }
    }  
  } catch (error) {
    console.log(error);
    throw error
  }
};

const deleteSsrCommercialGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await ssrCommercialGroupModels.findByIdAndDelete(id);
    const userData=await user.findById(req.user._id)

    if (deleteData) {
      const LogsData={
                  eventName:"Manage SSR Groups",
                  doerId:req.user._id,
              doerName:userData.fname,
       companyId:deleteData.companyId,
       documentId:deleteData._id,
                   description:"Delete Manage SSR Groups",
                }
               EventLogs(LogsData)
      return {
        response: "Ssr Commercial deleted sucessfully",
      };
    } else {
      return {
        response: "Ssr Commercial data not found for this id",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addSsrCommercialGroup,
  editSsrCommercialGroup,
  getSsrCommercialGroup,
  deleteSsrCommercialGroup,
};

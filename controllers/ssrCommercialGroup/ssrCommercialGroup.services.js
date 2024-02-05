const ssrCommercialGroupModels = require("../../models/SsrCommercialGroup");
const ssrCommercial = require("../../models/SsrCommercial");

const addSsrCommercialGroup = async (req, res) => {
  try {
    let {
      ssrCommercialIds,
      ssrCommercialName,
      companyId,
      isDefault
    } = req.body;
    let ssrCommercialGroupNameExist = await ssrCommercialGroupModels.findOne({companyId,ssrCommercialName});
    if(ssrCommercialGroupNameExist){
      return {
        response :'Ssr Commercial Group With The Same Name Already Exists For This Company',
        data : []
      }
    };
    if(isDefault === true){
      let checkIsAnydefaultTrue = await ssrCommercialGroupModels.updateMany({companyId} ,{isDefault : false});
    }
    const newSsrCommercialGroup = new ssrCommercialGroupModels({
        ssrCommercialIds,
        ssrCommercialName,
        companyId,
        modifyAt: new Date(),
        modifyBy: req.user._id,
        isDefault
    });
    const saveFareRuleGroup = await newSsrCommercialGroup.save();
    if (saveFareRuleGroup) {
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
      ...req.body
    };

    if(updateData?.isDefault === true){
      let checkIsAnydefaultTrue = await ssrCommercialGroupModels.updateMany({companyId: updateData.companyId} ,{isDefault : false});
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
    if (updateSsrCommercialData) {
      return {
        response: "Ssr Commercial Group Updated Sucessfully",
        data: updateFareRuleData,
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
    let companyId = req.query.companyId;
    let getSsrCommercial;
    let documents
    try {
      getSsrCommercial = await ssrCommercialGroupModels.find({ companyId: companyId });
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",getSsrCommercial, "<<<<<<<<<<<")
     
      for (let i = 0; i < getSsrCommercial.length; i++) {      
          let converteSsrCommercialIds = getSsrCommercial[i].ssrCommercialIds.map(id => id.toString());
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",converteSsrCommercialIds)
      
           documents = await ssrCommercial.find({ _id: { $in: converteSsrCommercialIds } })
              .exec();      
          getSsrCommercial[i].fareRuleIds = documents;
         console.log("[[[[[[[[[[[[[[[[[[[",documents)
      }
      console.log("[[[[[[[[[[[[[[[[[[[",documents, "]]]]]]]]]]]]]]]]]]")
    if (documents) {
      return {
        response: "Ssr Commercial Group Fetch Sucessfully",
        data: documents
      };
    } else {
      return {
        response: "Ssr Commercial Group Not Found",
      };
    }
  } catch(error){
    throw error
  }
}catch(error){

}
}

const deleteSsrCommercialGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await ssrCommercialGroupModels.findByIdAndDelete(id);
    if(deleteData){
      return{
        response : 'Ssr Commercial deleted sucessfully'
      }
    }else{
      return{
        response : 'Ssr Commercial data not found for this id'
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
};

module.exports = {
    addSsrCommercialGroup,
    editSsrCommercialGroup,
    getSsrCommercialGroup,
    deleteSsrCommercialGroup,
}

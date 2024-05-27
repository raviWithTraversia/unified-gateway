const diSetup = require('../../models/DiSetup');
const user=require('../../models/User')
const EventLogs=require('../logs/EventApiLogsCommon')
const addDiSetup = async (req,res) => {
    try{
            const newDiSetup = await diSetup.create(req.body);
            const userData=await user.findById(req.user._id)
           if(newDiSetup){
            const LogsData={
              eventName:"Deposit Incentive",
              doerId:req.user._id,
          doerName:userData.fname,
   companyId:newDiSetup.companyId,
   documentId:newDiSetup._id,
               description:"Add Deposit Incentive",
            }
           EventLogs(LogsData)
            return {
                response : "New Di Setup is created",
                data : newDiSetup
            }
           }
           else{
            return{
               response : "Di setup is not created"
                
            }
           }
    }catch(error){
      console.log(error);
      throw error
    }
};
const getDiSetup = async (req,res) => {
    try{
        let companyId = req.query.id;
        let incentiveData = await diSetup.find({companyId : companyId});
        if(incentiveData){
            return {
               response : 'Di Data sucessfully Fetch',
               data : incentiveData
            }
        }else{
            return {
                response : 'Data Not Found'
            }
        }

    }catch(error){
        console.log(error);
        throw error
    }
};
const deleteDiSetup = async (req,res) => {
    try{
      let id = req.params.id;
      let deleteDi = await diSetup.findByIdAndDelete(id) ;
      const userData=await user.findById(req.user._id)

      if(deleteDi){
        const LogsData={
          eventName:"Deposit Incentive",
          doerId:req.user._id,
      doerName:userData.fname,
companyId:deleteDi.companyId,
documentId:deleteDi._id,
           description:"Delete Deposit Incentive",
        }
       EventLogs(LogsData)
        return {
            response : 'Di data deleted sucessfully'
        }
      }
      else{
        return {
            response : 'Di data not deleted'
        }
      }

    }catch(error){
      console.log(error);
      throw error
    }
};
const editDiSetup = async (req,res) => {
    try{
        let { id } = req.query;
        let updateData = {
          ...req.body
        };
        const diData=await diSetup.findById(id)
        let updateDiData = await diSetup.findByIdAndUpdate(
            id,
            {
              $set: updateData,
              modifyAt: new Date(),
              modifyBy: req.user._id,
            },
            { new: true }
          );
      const userData=await user.findById(req.user._id)

          if (updateDiData) {

            const LogsData={
              eventName:"Deposit Incentive",
              doerId:req.user._id,
          doerName:userData.fname,
    companyId:updateDiData.companyId,
    documentId:updateDiData._id,
    oldValue:diData,
    newValue:updateDiData,
               description:"Edit Deposit Incentive",
            }
           EventLogs(LogsData)
            return {
              response: "Di data Updated Sucessfully",
              data: updateDiData,
            };
          } else {
            return {
              response: "Di Data Not Updated",
            };
          }
    }catch(error){
       console.log(error);
       throw error
    }
}

module.exports = {
    addDiSetup,
    getDiSetup ,
    deleteDiSetup,
    editDiSetup
}
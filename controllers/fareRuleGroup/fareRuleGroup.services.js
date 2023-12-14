const fareRuleGroupModels = require('../../models/FareRuleGroup');

const addFareRuleGroup = async (req,res) => {
    try{
        const { fareRuleIds, fareRuleGroupName, fareRuleGroupDescription } = req.body;

          const newFareRuleGroup = new fareRuleGroupModels({
            fareRuleIds,
            fareRuleGroupName,
            fareRuleGroupDescription,
            modifyAt: new Date(),
            modifyBy: req.user._id, 
          });
          const saveFareRuleGroup = await newFareRuleGroup.save();
          if(saveFareRuleGroup){
            return {
                response : 'FareRule Group Added Sucessfully',
                data : saveFareRuleGroup
            }
          }else{
            return {
                response : 'FareRule Group Not Added'
            }
          }
      

    }catch(error){
      console.log(error);
      throw console.error();
    }
};

const editFareRuleGroup = async (req,res) => {
    try{
    let {id } = req.query;
    let updateData = req.body;
    let updateFareRuleData = await fareRuleGroupModels.findByIdAndUpdate(
        id,
        {
            $set: updateData,
            modifyAt: new Date(),
            modifyBy: req.user._id, 
          },
          { new: true }
    );
    if(updateFareRuleData){
      return {
        response : 'Fare rule Updated Sucessfully',
        data : updateFareRuleData
      }
    }else{
       return {
        response : 'Fare rule Data Not Updated'
       }
    }

    }catch(error){
      console.log(error)
      throw error
    }
};

const getFareRuleGroup = async (req,res) => {
    try{
    let getFareRule = await fareRuleGroupModels.find().populate('fareRuleIds');
    if(getFareRule){
        return {
            response : 'Fare Rule Fetch Sucessfully',
            data : getFareRule
        }
    }else{
        return{
            response : 'Fare Rule Not Found'
        }
    }
    
    }catch(error){
       console.log(error);
       throw error
    }
};

const deleteFareRuleGroup = async (req,res) =>{
    try{

    }catch(error){

    }
};

module.exports = {
    addFareRuleGroup,
    editFareRuleGroup,
    getFareRuleGroup,
    deleteFareRuleGroup
}
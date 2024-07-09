const FareFamilyMaster = require('../../models/FareFamilyMaster');
const Company=require('../../models/Company')
const getFareFamilyMaster = async(req , res) => {
    try {
        const companyId = req.params.companyId;
        const result = await FareFamilyMaster.find({companyId : companyId});
        if (result.length > 0) {
            return {
                response: 'Fare Family available',
                data: result
            }
        } else {
            return {
                response: 'Fare Family not available',
                data: []
            }
        }
        
    } catch (error) {
        throw error;
    }
}
const addFareFamilyMaster=async(req,res)=>{

    try{
        const {companyId,fareFamilyCode,fareFamilyName,status}=req.body
    let requiredFields=['companyId','fareFamilyCode','fareFamilyName','status']
        
      const missingFields = requiredFields.filter(
        (fieldName) =>
          req.body[fieldName] === null || req.body[fieldName] === undefined
      );
      if (missingFields.length > 0) {
        const missingFieldsString = missingFields.join(", ");
        return {
          response: null,
          isSometingMissing: true,
          data: `Missing or null fields: ${missingFieldsString}`,
        };
      };
      const isCheckedInTmc=await Company.findById(companyId)
      if(isCheckedInTmc.type=='TMC'){
        const newFarefamilyMaster=new FareFamilyMaster({
            companyId,fareFamilyCode,fareFamilyName,status
        })

        await newFarefamilyMaster.save();
        return {
            response : 'New Fare family Added Sucessfully',
            data : newFarefamilyMaster
        }
    

      }
      else{
        return{
            response:"comany Id not TMC"
        }
      }

    }catch(error){
    throw error
}

}

const editFareFamilyMaster=async(req,res)=>{

    try{
   const {_id}=req.params

   if(!_id){
    return{
        response:"req params id not define"
    }
   }
        const {companyId,fareFamilyCode,fareFamilyName,status}=req.body

      const isCheckedInTmc=await Company.findById(companyId)
      const oldFarefamily=await FareFamilyMaster.findById(_id)
      if(isCheckedInTmc.type=='TMC'){
        const editFarefamilyMaster=await FareFamilyMaster.findByIdAndUpdate({_id:_id,companyId:companyId},{
            fareFamilyCode:fareFamilyCode?fareFamilyCode:oldFarefamily.fareFamilyCode,
            fareFamilyName: fareFamilyName? fareFamilyName:oldFarefamily.fareFamilyName,
            status:status?status:oldFarefamily.status
        },{new:true})

        if(!editFarefamilyMaster){
            return {
                response:"fare family not found"
            }

        }
        return {
            response : 'edit Fare family Sucessfully',
            data : editFarefamilyMaster
        }
    

      }
      else{
        return{
            response:"comany Id not TMC"
        }
      }

    }catch(error){
    throw error
}

}
module.exports = {
    getFareFamilyMaster,
    addFareFamilyMaster,
    editFareFamilyMaster
}
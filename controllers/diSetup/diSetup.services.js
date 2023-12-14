const diSetup = require('../../models/DiSetup');

const addDiSetup = async (req,res) => {
    try{
            const newDiSetup = await diSetup.create(req.body);
           if(newDiSetup){
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
      if(deleteDi){
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
}

module.exports = {
    addDiSetup,
    getDiSetup ,
    deleteDiSetup
}
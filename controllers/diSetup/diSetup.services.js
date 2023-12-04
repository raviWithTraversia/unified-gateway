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
            response : "Di setup is not created"
           }
    }catch(error){
      console.log(error);
      throw error
    }
};

module.exports = {
    addDiSetup  
}
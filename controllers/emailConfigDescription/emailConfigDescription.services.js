const emailConfigDis = require('../../models/EmailConfigDiscription');

const findAllEmailConfig = async (req,res) => {
   try{
    const emailConfigs = await emailConfigDis.find();
    if(!emailConfigs.length){
        return {
            response : 'No email config discription data found'
        }
    }else{
        return {
            response : 'All email Config discription data retrive Sucessfully',
            data : emailConfigs
        }
    }

   }catch(error) {
      console.log(error);
      throw error
   }
};

const addEmailConfig = async (req,res) => {
   try{
    const { descriptionName } = req.body;
    const isEmailConfigDescription = await emailConfigDis.findOne({descriptionName : descriptionName});
    if(isEmailConfigDescription){
        return {
            response : 'This email config discription already exist'
        }
    }
    const newEmailConfigDescription = new emailConfigDis({ descriptionName });
    await newEmailConfigDescription.save();
    return {
        response : 'Email config discription is sucessfully created',
        data : newEmailConfigDescription
    }

   }catch(error) {
     console.log(error)
     throw error
   }
};


module.exports = {
    findAllEmailConfig,
    addEmailConfig
}
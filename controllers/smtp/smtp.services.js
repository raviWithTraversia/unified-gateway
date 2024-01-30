const SmtpConfig = require("../../models/Smtp");


const smtpConfig = async (req, res) => {
    try {
        const smtpConfigs = await SmtpConfig.find();
        if(!smtpConfigs){
            return {
                response : "No smtp configuration available"
            }
        }
       // let smtpConfigsResult = res.json(smtpConfigs);
        return {
            response : smtpConfigs 
        }

    }catch(error){
       console.log(error);
       throw error 
    }
};

const addSmtpConfig = async (req,res) => {
    try {
        const smtpConfig = new SmtpConfig(req.body);
        await smtpConfig.save();
    return {
        response : "New smtp is sucessfully created"
    }
    }catch(error){
        console.log(error);
        throw error;
    }

}

const removeSmtpConfig = async (req , res) => {
    const { companyId } = req.params;
    try{
     await SmtpConfig.deleteOne({companyId});
     return {
        response : "Smtp configured mail deleted sucessfully"
     }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

// const updateSmtpConfig = async (req,res) => {
//     const { companyId } = req.params;
//     try{
//         await SmtpConfig.findOneAndUpdate({companyId})

//     }catch(error){

//     }
// }


module.exports = {
    smtpConfig,
    addSmtpConfig,
    removeSmtpConfig
}
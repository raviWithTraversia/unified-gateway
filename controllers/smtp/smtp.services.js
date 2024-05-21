const SmtpConfig = require("../../models/Smtp");
const { response } = require("../../routes/agencyConfigurationRoute");
const commonEmailFunction=require('../commonFunctions/common.function')

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

};

const removeSmtpConfig = async (req , res) => {
    const { id } = req.query;
    try{
    let deleteSmtp = await SmtpConfig.deleteOne({_id : id});
    if(deleteSmtp){
        return {
            response : "Smtp configured mail deleted sucessfully"
         }
    }else{
        return {
            response : "Smtp configured not deleted"
        }
    }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// const updateSmtpConfig = async (req,res) => {
//     const { companyId } = req.params;
//     try{
//         await SmtpConfig.findOneAndUpdate({companyId})

//     }catch(error){

//     }
// }

const updateSmtpConfig = async (req, res) => {
    try {
        let id = req.query.id; 
        const updates = req.body;

        
        let updateSmtpData = await SmtpConfig.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
        if (updateSmtpData) {
            return {
                response: 'Smtp Data Updated Successfully',
                data: updateSmtpData
            }
        } else {
            return {
                response: 'Smtp Data Not Updated'
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const sendMail = async (req, res) => {
    try {
        const { companyId} = req.query;
const bodyData=req.body
        
        const mailConfig = await SmtpConfig.find({ companyId: companyId }).populate("companyId" ,"companyName");
        
        if (mailConfig) {
            const data = await commonEmailFunction.sendNotificationByEmail(mailConfig,bodyData);
            
            return {
                response: 'SMTP Email sent successfully',
                data: data
            };
        } else {
            return {
                response: "Your Smtp data not found"
            };
        }
    } catch (error) {
        throw error;
    }
};



module.exports = {
    smtpConfig,
    addSmtpConfig,
    removeSmtpConfig,
    updateSmtpConfig,
    sendMail
}
const emailConfig = require('../../models/EmailConfig');
const emailConfigDes = require('../../models/EmailConfigDiscription');
const smtp = require('../../models/smtp');
const user = require('../../models/User');

const addEmailConfig = async (req,res) => {
   try{
      const {
         companyId,
         EmailConfigDescriptionId,
         mailDescription,
         emailCc,
         emailBcc,
         smptConfigId,
         status,
       } = req.body;
       let checkIscompanyIdExist = await user.findOne({company_ID : companyId});
       if(!checkIscompanyIdExist){
         checkIscompanyIdExist = null;
         return{
            response : 'Company id not exist',
            data : checkIscompanyIdExist
         }
       };
       let checkIsSmtpIdExist = await smtp.findById({smptConfigId});
       if(!checkIsSmtpIdExist){
         checkIsSmtpIdExist = null;
         return{
            response : 'Smtp id not exist',
            data : checkIsSmtpIdExist
         }
       }
       let checkIsEmailConfigDescriptionIdExist = await emailConfig.findOne({company_ID :companyId ,EmailConfigDescriptionId : EmailConfigDescriptionId, mailDescription : mailDescription}) ;
       if(checkIsEmailConfigDescriptionIdExist){
       return {
         response : 'Email config is already exist'
       }
      }else{
         let createEmailConfig = new emailConfig({
            companyId,
            EmailConfigDescriptionId,
            mailDescription,
            emailCc,
            emailBcc,
            smptConfigId,
            status,
          });
          await emailConfig.save();
          return {
            response : 'New Email Config is created sucessfully',
            data : createEmailConfig
          }
        
      }

   }catch(error) {
      console.log(error);
      throw error
   }
};

const getEmailConfig = async (req,res) => {
   try{

   }catch(error) {

   }
};

module.exports = {
    getEmailConfig,
    addEmailConfig
}
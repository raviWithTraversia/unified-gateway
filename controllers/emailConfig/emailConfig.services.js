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
         const newEmailConfigDescription = new emailConfigDes({emailConfigDescription: mailDescription });
         EmailConfigDescriptionId = newEmailConfigDescription._id;
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
      const { companyId } = req.body;
      let allEmailConfigData = await emailConfig.find({ companyId });
      if(!allEmailConfigData ||!allEmailConfigData.length ){
      return {
         response : 'No any email config exist for this comapnyId',
         data : null
      }
   }else{
      return {
         response : 'Email config id fetch sucessfully',
         data : allEmailConfigData
      }
   }

   }catch(error) {
      console.log(error);
      throw error
   }
};

module.exports = {
    getEmailConfig,
    addEmailConfig
}
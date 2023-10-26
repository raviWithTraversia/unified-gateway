const mongoose = require('mongoose');

const WebsiteManagerSchema = new mongoose.Schema({
    domainName : {
        type : String,
        required : true,
        default :null
    },
    name : {
        type : String,
        required : false,
        default : null
    },
    companyId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        default : null
    },
    pageTitle : String,
    headerHelpline : String,
    footerHelpline : String,
    companyDtlsinFooter : String,
    homePageContents : String,
    productPageContents : String,
    termsOfServiceContents : String,
    privacyPolicyContents : String,
    aboutUsContents : String,
    contactUsContents : String,
    faqContents : String,
    RTGSContents : String,
    feedbackContents : String,
    newsContents : String,
    paymentSecurityContents : String,
    disclaimerContents : String,
    logoutContents : String,
    chatScript : String,
    employeeReg : String,
    partnerReg : String,
    corpSuccessReg : String,
    employeeSuccessReg : String,
    agentSuccessReg : String,
    webUserSuccessReg : String,
    emailHeaderHtml : String,
    emailFooterHtml : String,
    address1 : String,
    address2 : String,
    city : String,
    country : String,
    postalCode : String,
    emergencyContactNumber : String,
    emailId : String,
    twitterURL : String,
    facebookURL : String,
    instaURL : String,
    websiteURL : String
});

module.exports = mongoose.model('WebsiteManager' , WebsiteManagerSchema);
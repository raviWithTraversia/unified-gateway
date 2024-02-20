const WebsietManager = require('../../models/WebsiteManager');
const commonFunction = require('../commonFunctions/common.function')
const Company = require('../../models/Company');
const User = require('../../models/User');

const addwebsiteManager = async (req, res) => {
    try {
        const  { 
            domainName ,
            name ,
            companyId ,
            pageTitle ,
            headerHelpline,
            footerHelpline,
            companyDtlsinFooter,
            homePageContents,
            productPageContents,
            termsOfServiceContents,
            privacyPolicyContents,
            aboutUsContents,
            contactUsContents,
            faqContents,
            RTGSContents,
            feedbackContents,
            newsContents,
            paymentSecurityContents,
            disclaimerContents,
            logoutContents,
            chatScript,
            employeeReg,
            partnerReg,
            corpSuccessReg,
            employeeSuccessReg,
            agentSuccessReg,
            webUserSuccessReg,
            emailHeaderHtml,
            emailFooterHtml,
            address1,
            address2,
            city,
            country,
            postalCode,
            emergencyContactNumber,
            emailId,
            twitterURL,
            facebookURL,
            instaURL,
            websiteURL,  
        } = req.body;
        if(!domainName) {
            return {
                response : 'Domain name field are required'
            }
        }
        if(!name) {
            return {
                response : 'Name field are required'
            }
        }
        if(!companyId) {
            return {
                response : 'company Id field are required'
            }
        }

        // Check company id exist or not
        const checkCompanyIdExist = await Company.find({ _id: companyId });

        if (checkCompanyIdExist.length === 0) {
            return {
                response: 'Compnay id does not exist'
            }
        }

        // Check company id exist or not
        const checkWebsiteManager = await WebsietManager.find({ companyId: companyId });

        if (checkWebsiteManager.length > 0) {
            return {
                response: 'Compnay id already exist'
            }
        }

        // const newdomainName = commonFunction.removeWWWAndProtocol(domainName);
        const storeWebsite = new WebsietManager({
            domainName,
            name ,
            companyId ,
            pageTitle ,
            headerHelpline,
            footerHelpline,
            companyDtlsinFooter,
            homePageContents,
            productPageContents,
            termsOfServiceContents,
            privacyPolicyContents,
            aboutUsContents,
            contactUsContents,
            faqContents,
            RTGSContents,
            feedbackContents,
            newsContents,
            paymentSecurityContents,
            disclaimerContents,
            logoutContents,
            chatScript,
            employeeReg,
            partnerReg,
            corpSuccessReg,
            employeeSuccessReg,
            agentSuccessReg,
            webUserSuccessReg,
            emailHeaderHtml,
            emailFooterHtml,
            address1,
            address2,
            city,
            country,
            postalCode,
            emergencyContactNumber,
            emailId,
            twitterURL,
            facebookURL,
            instaURL,
            websiteURL,  
        });
     
        await storeWebsite.save();

        return {
            response: 'website Manager added successfully'
        }

    } catch (error) {
        throw error;
    }

}

const getwebsiteManager = async (req, res) => {
    try {
       
        const domainName = req.params.domainName;
        const result = await WebsietManager.find({ domainName : domainName});
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Website Manager Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

module.exports = { addwebsiteManager , getwebsiteManager}
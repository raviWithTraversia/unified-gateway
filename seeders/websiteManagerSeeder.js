const websiteManager = require("../models/WebsiteManager");
const Company = require("../models/Company");

const WebsiteManagerSeeder = async () => {
    try {
        // Check if any companies already exist
        const existingStatus = await websiteManager.find();
        if (existingStatus.length === 0) {
            const getCompany = await Company.findOne({ type: "TMC" });
            await websiteManager.create([{
                "companyId": getCompany._id,
                "domainName": "kafilaui.traversia.net",
                "name": "Kafila",
                "pageTitle": "Kafila",
                "headerHelpline": "9999999999",
                "footerHelpline": "3254365426",
                "companyDtlsinFooter": "",
                "homePageContents": "",
                "productPageContents": "",
                "termsOfServiceContents": "",
                "privacyPolicyContents": "",
                "aboutUsContents": "",
                "contactUsContents": "",
                "faqContents": "",
                "RTGSContents": "",
                "feedbackContents": "",
                "newsContents": "",
                "paymentSecurityContents": "",
                "disclaimerContents": "",
                "logoutContents": "",
                "chatScript": "",
                "employeeReg": "",
                "partnerReg": "",
                "corpSuccessReg": "",
                "employeeSuccessReg": "",
                "agentSuccessReg": "",
                "webUserSuccessReg": "",
                "emailHeaderHtml": "",
                "emailFooterHtml": "",
                "address1": "",
                "address2": "",
                "city": "",
                "country": "",
                "postalCode": "",
                "emergencyContactNumber": "",
                "emailId": "",
                "twitterURL": "",
                "facebookURL": "",
                "instaURL": "",
                "websiteURL": "https://kafilaui.traversia.net",
            }]);
            console.log('WebsiteManager seeded successfully.');
        } else {
            //console.log('Status table already exists. Skipping seeding.');
        }
    } catch (err) {
        console.error('Error seeding WebsiteManager:', err);
    }
};

module.exports = {
    WebsiteManagerSeeder
}
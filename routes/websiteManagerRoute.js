const express = require("express");
const website_manager_route = express();
const bodyParser = require("body-parser");
website_manager_route.use(bodyParser.json());
website_manager_route.use(bodyParser.urlencoded({extended:true}));
const auth = require("../middleware/auth");
const websiteManager = require("../controllers/websiteManager/websiteManager.controller");

/**
 * @swagger
 * paths:
 *  /api/website/add-website-manager:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      summary: Add Website Manager
 *      tags:  
 *          - Website Manager 
 *      description: Add a website manager
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                domainName:
 *                  type: string
 *                  example: "traversia.net"
 *                name:
 *                  type: string
 *                  example: "Traversia"
 *                companyId:
 *                  type: string
 *                  example: "6538c030475692887584081e"
 *                pageTitle:
 *                  type: string
 *                  example: "Page Title"
 *                headerHelpline:
 *                  type: string
 *                  example: "Header Helpline"
 *                footerHelpline:
 *                  type: string
 *                  example: "Footer Helpline"
 *                companyDtlsinFooter:
 *                  type: string
 *                  example: "Company Details in Footer"
 *                homePageContents:
 *                  type: string
 *                  example: "Home Page Contents"
 *                productPageContents:
 *                  type: string
 *                  example: "Product Page Contents"
 *                termsOfServiceContents:
 *                  type: string
 *                  example: "Terms of Service Contents"
 *                privacyPolicyContents:
 *                  type: string
 *                  example: "Privacy Policy Contents"
 *                aboutUsContents:
 *                  type: string
 *                  example: "About Us Contents"
 *                contactUsContents:
 *                  type: string
 *                  example: "Contact Us Contents"
 *                faqContents:
 *                  type: string
 *                  example: "FAQ Contents"
 *                RTGSContents:
 *                  type: string
 *                  example: "RTGS Contents"
 *                feedbackContents:
 *                  type: string
 *                  example: "Feedback Contents"
 *                newsContents:
 *                  type: string
 *                  example: "News Contents"
 *                paymentSecurityContents:
 *                  type: string
 *                  example: "Payment Security Contents"
 *                disclaimerContents:
 *                  type: string
 *                  example: "Disclaimer Contents"
 *                logoutContents:
 *                  type: string
 *                  example: "Logout Contents"
 *                chatScript:
 *                  type: string
 *                  example: "Chat Script"
 *                employeeReg:
 *                  type: string
 *                  example: "Employee Registration"
 *                partnerReg:
 *                  type: string
 *                  example: "Partner Registration"
 *                corpSuccessReg:
 *                  type: string
 *                  example: "Corporate Success Registration"
 *                employeeSuccessReg:
 *                  type: string
 *                  example: "Employee Success Registration"
 *                agentSuccessReg:
 *                  type: string
 *                  example: "Agent Success Registration"
 *                webUserSuccessReg:
 *                  type: string
 *                  example: "Web User Success Registration"
 *                emailHeaderHtml:
 *                  type: string
 *                  example: "<html>...</html>"
 *                emailFooterHtml:
 *                  type: string
 *                  example: "<html>...</html>"
 *                address1:
 *                  type: string
 *                  example: "123 Main St"
 *                address2:
 *                  type: string
 *                  example: "Apt 4B"
 *                city:
 *                  type: string
 *                  example: "Example City"
 *                country:
 *                  type: string
 *                  example: "Example Country"
 *                postalCode:
 *                  type: string
 *                  example: "12345"
 *                emergencyContactNumber:
 *                  type: string
 *                  example: "+1234567890"
 *                emailId:
 *                  type: string
 *                  example: "info@traversia.net"
 *                twitterURL:
 *                  type: string
 *                  example: "https://twitter.com/traversia"
 *                facebookURL:
 *                  type: string
 *                  example: "https://facebook.com/traversia"
 *                instaURL:
 *                  type: string
 *                  example: "https://instagram.com/traversia"
 *                websiteURL:
 *                  type: string
 *                  example: "https://www.traversia.net"
 *      responses:
 *        "200":
 *          description: Website Manager added successfully
 *        "401":
 *          description: User unauthorized
 *        "500":
 *          description: Server error
 */
website_manager_route.post(
    '/website/add-website-manager' ,
     websiteManager.websiteManagerAdd
    );

/**
 * @swagger
 * /api/website/retrive-website-manager/{domainName}:
 *   get:
 *     summary: Get website manager by domain name
 *     tags:
 *       - Website Manager
 *     parameters:
 *       - in: path
 *         name: domainName
 *         required: true
 *         description: The domain name of the website for which the manager is requested.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: Website manager is not available
 *       '500':
 *         description: Internal server error
 */


website_manager_route.get(
    '/website/retrive-website-manager/:domainName' ,
     websiteManager.retriveWebsiteManager
);

module.exports = website_manager_route;
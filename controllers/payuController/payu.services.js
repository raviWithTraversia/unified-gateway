const pgCharges = require("../../models/pgCharges");
const Role = require ('../../models/Role');
const User = require('../../models/User');
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid'); 

const payu = async (req, res) => {
    try {
        const {
            companyId,
            userId,
            firstName,
            lastName,
            email,
            mobile,
            amount,
            productinfo

        } = req.body;

        if(!companyId || !userId || !firstName || !lastName || !email || !mobile || !amount || !productinfo) {
            return {
                response : 'All field are required'
            }
        }
        
        // check companyId exist or not
        // const checkExistCompany = await Company.findById(companyId);
        // if(!checkExistCompany) {
        //     return {
        //         response : 'companyId does not exist'
        //     }
        // }   
        const transtionId = uuidv4();      
        const payDetails = {
            txnId: transtionId,
            plan_name: "Test",
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobile: mobile,
            amount: amount,
            productinfo: productinfo,
            service_provide: 'test',
            call_back_url: `https://kafila.traversia.net`,
            payu_merchant_key: 'gtKFFx',
            payu_merchant_salt_version_1 : '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW',
            // payu_merchant_salt_version_2 : process.env.PAYU_MERCHANT_SALT_VERSION_2,
            payu_url: 'https://test.payu.in/_payment',
            payu_fail_url: `https://kafila.traversia.net/success/url`,
            payu_cancel_url: `https://kafila.traversia.net/success/url`,
            payu_url: 'https://test.payu.in/_payment',
        };
        console.log(payDetails)
        // Construct the string to be hashed
        const hashString = `${payDetails.payu_merchant_key}|${payDetails.txnId}|${payDetails.amount}|${payDetails.productinfo}|${payDetails.firstName}|${payDetails.email}|||||||||||${payDetails.payu_merchant_salt_version_1}`;
        // Add your PayU secret key
        const secretKey = 'gtKFFx';

        // Create the SHA512 hash using the secret key
        const hash = crypto.createHash('sha512');
        hash.update(hashString + secretKey);
        const payu_sha_token = hash.digest('hex');

        //console.log(payu_sha_token);
       
        if (payu_sha_token) {
            return {
                response : "payU sha token generate successfully",
                data: {payDetails:payDetails, haskKey:payu_sha_token }
            }
        } else {
            return {
                response: 'Data does not exist',
                data: null
            }
        }
       
    } catch (error) {
        throw error;
    }
};

module.exports = {
    payu
};
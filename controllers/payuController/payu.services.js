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
            email,
            mobile,
            amount,
            productinfo

        } = req.body;

        if(!companyId || !userId || !firstName || !email || !mobile || !amount || !productinfo) {
            return {
                response : 'All field are required'
            }
        }
        
        // const key = 'gtKFFx';
        // const txnid = '4c14e4f2-91c6-4e4e-b942-de29e5210f5f';
        // const amount = 500;
        // const productinfo = 'iPhone';
        // const firstname = 'Test';
        // const email = 'test@example.com';
        // const salt = '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';
        
        const key = 'gtKFFx';
        const txnid =  uuidv4();
        const amountres = amount;
        const productinfores = productinfo;
        const firstnameres = firstName;
        const emailres = email;
        const salt = '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';


        // Concatenate the transaction details
        const hashString = `${key}|${txnid}|${amountres}|${productinfores}|${firstnameres}|${emailres}|||||||||||${salt}`;

        // Calculate the SHA-512 hash
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
        payDetails = hash; // Add the hash to payment details
        // check companyId exist or not
        // const checkExistCompany = await Company.findById(companyId);
        // if(!checkExistCompany) {
        //     return {
        //         response : 'companyId does not exist'
        //     }
        // }   
        //const transtionId = uuidv4();      
        // const payDetails = {
        //     txnId: transtionId,
        //     plan_name: "Test",
        //     firstName: firstName,
        //     lastName: lastName,
        //     email: email,
        //     mobile: mobile,
        //     amount: amount,
        //     productinfo: productinfo,
        //     service_provide: 'test',
        //     call_back_url: `https://kafila.traversia.net`,
        //     payu_merchant_key: 'gtKFFx',
        //     payu_merchant_salt_version_1 : '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW',
        //     // payu_merchant_salt_version_2 : process.env.PAYU_MERCHANT_SALT_VERSION_2,
        //     payu_url: 'https://test.payu.in/_payment',
        //     payu_fail_url: `https://kafila.traversia.net/success/url`,
        //     payu_cancel_url: `https://kafila.traversia.net/success/url`,
        //     payu_url: 'https://test.payu.in/_payment',
        // };
        //console.log(payDetails)
        // Construct the string to be hashed
        //const hashString = `${payDetails.payu_merchant_key}|${payDetails.txnId}|${payDetails.amount}|${payDetails.productinfo}|${payDetails.firstName}|${payDetails.email}|||||||||||$payDetails.payu_merchant_salt_version_1}`;
        // Add your PayU secret key
        //const secretKey = 'gtKFFx';

        // Create the SHA512 hash using the secret key
        // const hash = crypto.createHash('sha512');
        // hash.update(hashString);
        // const payu_sha_token = hash.digest('hex');

        //console.log(payu_sha_token);
       
        if (payDetails) {
            return {
                response : "payU sha token generate successfully",
                data: payDetails 
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
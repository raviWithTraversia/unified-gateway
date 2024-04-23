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
            name,
            email,
            mobile,
            amount

        } = req.body;

        if(!companyId || !userId || !name || !email || !mobile || !amount) {
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
        const payDetails = {
            txnId:  uuidv4(),
            name : name,           
            email: email,            
            mobile: mobile,            
            amount: amount,
        };

        // Construct the string to be hashed
        const hashString = `${payDetails.txnId}|${payDetails.name}|${payDetails.email}|${payDetails.mobile}|${payDetails.amount}`;

        // Add your PayU secret key
        const secretKey = 'your_secret_key';

        // Create the SHA512 hash using the secret key
        const hash = crypto.createHash('sha512');
        hash.update(hashString + secretKey);
        const payu_sha_token = hash.digest('hex');

        //console.log(payu_sha_token);
       
        if (payu_sha_token) {
            return {
                response : "payU sha token generate successfully",
                data: payu_sha_token
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

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
            amount,
            phone,
            productinfo

        } = req.body;

        if(!companyId || !userId || !firstName || !email || !amount || !productinfo || !phone) {
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
        const phoneres = phone;
        const surl = "https://kafila.traversia.net/api/paymentGateway/success";
        const furl = "https://kafila.traversia.net/api/paymentGateway/failed";        
        const salt = '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';      
        

        // Concatenate the transaction details
        const hashString = `${key}|${txnid}|${amountres}|${productinfores}|${firstnameres}|${emailres}|||||||||||${salt}`;

        // Calculate the SHA-512 hash
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
        payDetails = {key:key,txnid:txnid,
            amount:amountres,
            productinfo:productinfores,
            firstname:firstnameres,
            email:emailres,
            salt:salt, 
            phone: phoneres,
            surl:surl,
            furl:furl, 
            hash: hash            
        }; // Add the hash to payment details
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

const payuSuccess = async (req, res) => {
    try { 
     
        const {
            status,
            txnid,
            productinfo 
        } = req.body;
        
        
    let successHtmlCode=`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Success</title>
      <style>
      .success-txt{
        color: #51a351;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f2f2f2;
      }
      
      .success-container {
        max-width: 400px;
        width: 100%;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        text-align: center;
      }
      .success-container p {
        margin-top: 10px;
      }
      
      .success-container a {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
      
      .success-container a:hover {
        background-color: #0056b3;
      }
    </style>

    </head>
    <body>
      <div class="success-container">
        <h1 class="success-txt">Payment Successful!</h1>
        <p class="success-txt">Your payment has been successfully processed.</p>
        <p>Thank you for your purchase.</p>
      </div>
    </body>
    </html>`
       
        if (status === "success") {
            return {
                response : "Success",
                data: successHtmlCode 
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

const payuFail = async (req, res) => {
    try {    
            let failedHtmlCode=`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Success</title>
        <style>
        .failed-txt{
          color: #bd362f;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f2f2f2;
        }
        
        .failed-container {
          max-width: 400px;
          width: 100%;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          text-align: center;
        }

        
        .failed-container p {
          margin-top: 10px;
        }
        
        .failed-container a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        
        .failed-container a:hover {
          background-color: #0056b3;
        }
      </style>
  
      </head>
      <body>
        <div class="failed-container">
          <h1 class="failed-txt">Payment Failed!</h1>
          <p class="failed-txt">Your payment has been failed.</p>
          <p>Please try again later.</p>
        </div>
      </body>
      </html>
      `
 
  
        if (failedHtmlCode) {
            return {
                response : "Success",
                data: failedHtmlCode 
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
    payu,payuFail,payuSuccess
};
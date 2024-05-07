const payuServices = require("./payu.services");
const { apiSucessRes, apiErrorres } = require("../../utils/commonResponce");
const {
  ServerStatusCode,
  errorResponse,
  CrudMessage,
} = require("../../utils/constants");

const payu = async (req, res) => {
    try {
        const result = await payuServices.payu(req, res);
        if (result.response == "payU sha token generate successfully") {
          apiSucessRes(
            res,
            result.response,
            result.data,
            ServerStatusCode.SUCESS_CODE
          );
        } else if (result.response == "Data does not exist") {
          apiErrorres(
            res,
            result.response,
            ServerStatusCode.RESOURCE_NOT_FOUND,
            true
          );
        } else {
          apiErrorres(
            res,
            errorResponse.SOME_UNOWN,
            ServerStatusCode.INVALID_CRED,
            true
          );
        }
      } catch (error) {
        apiErrorres(
          res,
          errorResponse.SOME_UNOWN,
          ServerStatusCode.INVALID_CRED,
          true
        );
      }
};
const payuSuccess = async (req, res) => 
  {
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
    </html>
    `
    console.log(req.body,"body success")
res.send(successHtmlCode)
  }
  const payuFail = async (req, res) => 
    {
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

      console.log(req.body,"body falied")
  res.send(failedHtmlCode)
    }
module.exports = {
  payu,payuSuccess,payuFail
};

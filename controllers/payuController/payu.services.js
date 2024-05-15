const pgCharges = require("../../models/pgCharges");
const Role = require("../../models/Role");
const User = require("../../models/User");
const crypto = require("crypto");
const UserModel = require("../../models/User");
const BookingDetails = require("../../models/booking/BookingDetails");
const ledger = require("../../models/Ledger");
const agentConfig = require("../../models/AgentConfig");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const BookingTemp = require("../../models/booking/BookingTemp");
const { v4: uuidv4 } = require("uuid");

const payu = async (req, res) => {
  try {
    const { companyId, userId, firstName, email, amount, phone, productinfo,cartId } =
      req.body;

    if (
      !companyId ||
      !userId ||
      !firstName ||
      !email ||
      !amount ||
      !productinfo ||
      !phone,
      !cartId
    ) {
      return {
        response: "All field are required",
      };
    }

    // const key = 'gtKFFx';
    // const txnid = '4c14e4f2-91c6-4e4e-b942-de29e5210f5f';
    // const amount = 500;
    // const productinfo = 'iPhone';
    // const firstname = 'Test';
    // const email = 'test@example.com';
    // const salt = '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW';

    const key = "gtKFFx";
    const txnid = uuidv4();
    const amountres = amount;
    const productinfores = productinfo;
    const firstnameres = firstName;
    const emailres = email;
    const phoneres = phone;
    const surl = "https://kafila.traversia.net/api/paymentGateway/success";
    const furl = "https://kafila.traversia.net/api/paymentGateway/failed";
    const salt = "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
    const cartIdres = cartId;

    // Concatenate the transaction details
    const hashString = `${key}|${txnid}|${amountres}|${productinfores}|${firstnameres}|${emailres}|${cartIdres}||||||||||${salt}`;

    // Calculate the SHA-512 hash
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    payDetails = {
      key: key,
      txnid: txnid,
      amount: amountres,
      productinfo: productinfores,
      firstname: firstnameres,
      email: emailres,
      salt: salt,
      phone: phoneres,
      surl: surl,
      furl: furl,
      hash: hash,
      udf1:cartIdres      
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
        response: "payU sha token generate successfully",
        data: payDetails,
      };
    } else {
      return {
        response: "Data does not exist",
        data: null,
      };
    }
  } catch (error) {
    throw error;
  }
};

const payuSuccess = async (req, res) => {
  try {
    const { status, txnid, productinfo,udf1 } = req.body;
     if(status === 'success'){
      const BookingTempData = await BookingTemp.findOne({BookingId:udf1});     
      
      if(BookingTempData){
     const convertDataBookingTempRes = JSON.parse(BookingTempData.request);  
     const PassengerPreferences = JSON.parse(convertDataBookingTempRes.PassengerPreferences);
     const ItineraryPriceCheckResponses = JSON.parse(convertDataBookingTempRes.ItineraryPriceCheckResponses); 
     const Authentication = JSON.parse(convertDataBookingTempRes.Authentication);   
     let credentialType = "D";
     let createTokenUrl;
     let flightSearchUrl;
  if (Authentication.CredentialType === "LIVE") {
    // Live Url here
   
    credentialType = "P";
    createTokenUrl = `http://fhapip.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://fhapip.ksofttechnology.com/api/FPNR`;
  } else {
    // Test Url here
    createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
    flightSearchUrl = `http://stage1.ksofttechnology.com/api/FPNR`;
  }

  let getuserDetails;
  try {
    getuserDetails = await UserModel.findOne({
      _id: Authentication.UserId,
    }).populate("company_ID");
    if (getuserDetails) {
      getuserDetails = getuserDetails;
    } else {
      getuserDetails = "User Not Found";
    }
  } catch (error) {
    // console.error('Error creating booking:', error);
    getuserDetails = "User Not Found";
  }


  
     const hitAPI = await Promise.all(
        ItineraryPriceCheckResponses.map(async (item) => {
          let requestDataFSearch = {
            FareChkRes: {
              Error: item.Error,
              IsFareUpdate: item.IsFareUpdate,
              IsAncl: item.IsAncl,
              Param: item.Param,
              SelectedFlight: [item.SelectedFlight],
              FareBreakup: item.FareDifference,
              GstData: item.GstData,
              Ancl: null,
            },
            PaxInfo: PassengerPreferences,
          };

          try {
            let fSearchApiResponse = await axios.post(
              flightSearchUrl,
              requestDataFSearch,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const logData = {
              traceId: Authentication.TraceId,
              companyId: Authentication.CompanyId,
              userId: Authentication.UserId,
              source: "Kafila",
              type: "API Log",
              BookingId: udf1,
              product: "Flight",
              logName: "Flight Search",
              request: requestDataFSearch,
              responce: fSearchApiResponse?.data,
            };
            Logs(logData);
            if (fSearchApiResponse.data.Status == "failed") {
              await BookingDetails.updateOne(
                {
                  bookingId: udf1,
                  "itinerary.IndexNumber": item.IndexNumber,
                },
                {
                  $set: {
                    bookingStatus: "FAILED",
                    bookingRemarks: error.message,
                  },
                }
              );

              // Ledget Create After booking Failed
              const getAgentConfigForUpdate = await agentConfig.findOne({
                userId: getuserDetails._id,
              });
              // Check if maxCreditLimit exists, otherwise set it to 0
              const maxCreditLimitPrice =
                getAgentConfigForUpdate?.maxcreditLimit ?? 0;
              const newBalanceCredit =
                maxCreditLimitPrice +
                item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice;
              await agentConfig.updateOne(
                { userId: getuserDetails._id },
                { maxcreditLimit: newBalanceCredit }
              );
              
              await ledger.create({
                userId: getuserDetails._id,
                companyId: getuserDetails.company_ID._id,
                ledgerId:
                  "LG" + Math.floor(100000 + Math.random() * 900000),
                transactionAmount:
                  item?.offeredPrice +
                  item?.totalMealPrice +
                  item?.totalBaggagePrice +
                  item?.totalSeatPrice,
                currencyType: "INR",
                fop: "CREDIT",
                transactionType: "DEBIT",
                runningAmount: newBalanceCredit,
                remarks: "Booking Amount Dedactive Into Your Account.",
                transactionBy: getuserDetails._id,
                cartId: item?.BookingId,
              });

              return `${fSearchApiResponse.data.ErrorMessage}-${fSearchApiResponse.data.WarningMessage}`;
            }

            const bookingResponce = {
              CartId: item.BookingId,
              bookingResponce: {
                CurrentStatus:
                  fSearchApiResponse.data.BookingInfo.CurrentStatus,
                BookingStatus:
                  fSearchApiResponse.data.BookingInfo.BookingStatus,
                BookingRemark:
                  fSearchApiResponse.data.BookingInfo.BookingRemark,
                BookingId: fSearchApiResponse.data.BookingInfo.BookingId,
                providerBookingId:
                  fSearchApiResponse.data.BookingInfo.BookingId,
                PNR: fSearchApiResponse.data.BookingInfo.APnr,
                Type: fSearchApiResponse.data.BookingInfo.GPnr,
                APnr: fSearchApiResponse.data.BookingInfo.APnr,
                GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
              },
              itinerary: item,
              PassengerPreferences: PassengerPreferences,
              userDetails: getuserDetails,
            };
            await BookingDetails.updateOne(
              {
                bookingId: udf1,
                "itinerary.IndexNumber": item.IndexNumber,
              },
              {
                $set: {
                  bookingStatus:
                    fSearchApiResponse.data.BookingInfo.CurrentStatus,
                  bookingRemarks:
                    fSearchApiResponse.data.BookingInfo.BookingRemark,
                  providerBookingId:
                    fSearchApiResponse.data.BookingInfo.BookingId,
                  PNR: fSearchApiResponse.data.BookingInfo.APnr,
                  APnr: fSearchApiResponse.data.BookingInfo.APnr,
                  GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
                },
              }
            );

            if (
              fSearchApiResponse.data.BookingInfo.CurrentStatus === "FAILED"
            ) {
              const getAgentConfigForUpdate = await agentConfig.findOne({
                userId: getuserDetails._id,
              });
              // Check if maxCreditLimit exists, otherwise set it to 0
              const maxCreditLimitPrice =
                getAgentConfigForUpdate?.maxcreditLimit ?? 0;

              const newBalanceCredit =
                maxCreditLimitPrice +
                item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice;
              await agentConfig.updateOne(
                { userId: getuserDetails._id },
                { maxcreditLimit: newBalanceCredit }
              );
              await ledger.create({
                userId: getuserDetails._id,
                companyId: getuserDetails.company_ID._id,
                ledgerId:
                  "LG" + Math.floor(100000 + Math.random() * 900000),
                transactionAmount:
                  item?.offeredPrice +
                  item?.totalMealPrice +
                  item?.totalBaggagePrice +
                  item?.totalSeatPrice,
                currencyType: "INR",
                fop: "CREDIT",
                transactionType: "DEBIT",
                runningAmount: newBalanceCredit,
                remarks: "Booking Amount Dedactive Into Your Account.",
                transactionBy: getuserDetails._id,
                cartId: item?.BookingId,
              });
            } else {
              // confirmed Booking Data ledger here 
              const getAgentConfigForUpdateagain = await agentConfig.findOne({
                userId: getuserDetails._id,
              });            
            // add balance here
            const maxCreditLimitPriceUp =
            getAgentConfigForUpdateagain?.maxcreditLimit ?? 0;

            const newBalanceCredit =
            maxCreditLimitPriceUp +
              item?.offeredPrice +
              item?.totalMealPrice +
              item?.totalBaggagePrice +
              item?.totalSeatPrice;
            await agentConfig.updateOne(
              { userId: getuserDetails._id },
              { maxcreditLimit: newBalanceCredit }
            );
            await ledger.create({
              userId: getuserDetails._id,
              companyId: getuserDetails.company_ID._id,
              ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
              transactionAmount:
                item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice,
              currencyType: "INR",
              fop: "CREDIT",
              transactionType: "DEBIT",
              runningAmount: newBalanceCredit,
              remarks: "Booking Amount Dedactive Into Your Account.",
              transactionBy: getuserDetails._id,
              cartId: item?.BookingId,
            });
              
            // dedatc Balance here
            const maxCreditLimitPricededact =
            getAgentConfigForUpdateagain?.maxcreditLimit ?? 0;

            const newBalanceCreditdeduct =
            maxCreditLimitPricededact -
              (item?.offeredPrice +
              item?.totalMealPrice +
              item?.totalBaggagePrice +
              item?.totalSeatPrice);
            await agentConfig.updateOne(
              { userId: getuserDetails._id },
              { maxcreditLimit: newBalanceCreditdeduct }
            );
            await ledger.create({
              userId: getuserDetails._id,
              companyId: getuserDetails.company_ID._id,
              ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
              transactionAmount:
                item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice,
              currencyType: "INR",
              fop: "DEBIT",
              transactionType: "CREDIT",
              runningAmount: newBalanceCreditdeduct,
              remarks: "Booking Amount Add Into Your Account.",
              transactionBy: getuserDetails._id,
              cartId: item?.BookingId,
            });
              

              // Transtion
              await transaction.updateOne(
                { bookingId: item?.BookingId },
                { statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY" }
              );
            }
            //return fSearchApiResponse.data;
            const barcodeupdate = await updateBarcode2DByBookingId(
              item?.BookingId,
              PassengerPreferences,
              item,
              fSearchApiResponse.data.BookingInfo.APnr
            );
            if (barcodeupdate) {
              return bookingResponce;
            } else {
              return bookingResponce;
            }
          } catch (error) {
            await BookingDetails.updateOne(
              {
                bookingId: item?.BookingId,
                "itinerary.IndexNumber": item.IndexNumber,
              },
              {
                $set: {
                  bookingStatus: "FAILED",
                  bookingRemarks: error.message,
                },
              }
            );

            // Ledget Create After booking Failed
            const getAgentConfigForUpdate = await agentConfig.findOne({
              userId: getuserDetails._id,
            });
            // Check if maxCreditLimit exists, otherwise set it to 0
            const maxCreditLimitPrice =
              getAgentConfigForUpdate?.maxcreditLimit ?? 0;

            const newBalanceCredit =
              maxCreditLimitPrice +
              item?.offeredPrice +
              item?.totalMealPrice +
              item?.totalBaggagePrice +
              item?.totalSeatPrice;
            await agentConfig.updateOne(
              { userId: getuserDetails._id },
              { maxcreditLimit: newBalanceCredit }
            );
            await ledger.create({
              userId: getuserDetails._id,
              companyId: getuserDetails.company_ID._id,
              ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
              transactionAmount:
                item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice,
              currencyType: "INR",
              fop: "CREDIT",
              transactionType: "DEBIT",
              runningAmount: newBalanceCredit,
              remarks: "Booking Amount Dedactive Into Your Account.",
              transactionBy: getuserDetails._id,
              cartId: item?.BookingId,
            });
            return error.message;
          }
        })
      );

    let successHtmlCode = `<!DOCTYPE html>
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
    </html>`;

    if (hitAPI.length > 0) {
      return successHtmlCode;
    } else {
      return "Data does not exist";
    }
      }
  }


  } catch (error) {
    throw error;
  }
};

const payuFail = async (req, res) => {
  try {
    const { status, txnid, productinfo,udf1 } = req.body;    
    const BookingTempData = await BookingTemp.findOne({BookingId:udf1});
    if(BookingTempData){
      const convertDataBookingTempRes = JSON.parse(BookingTempData.request);  
      const PassengerPreferences = JSON.parse(convertDataBookingTempRes.PassengerPreferences);
      const ItineraryPriceCheckResponses = JSON.parse(convertDataBookingTempRes.ItineraryPriceCheckResponses); 
      const Authentication = JSON.parse(convertDataBookingTempRes.Authentication);  
      
      let getuserDetails;
      try {
        getuserDetails = await UserModel.findOne({
          _id: Authentication.UserId,
        }).populate("company_ID");
        if (getuserDetails) {
          getuserDetails = getuserDetails;
        } else {
          getuserDetails = "User Not Found";
        }
      } catch (error) {
        // console.error('Error creating booking:', error);
        getuserDetails = "User Not Found";
      }


      const getAgentConfigForUpdateagain = await agentConfig.findOne({
        userId: getuserDetails._id,
      }); 
      
      
      const hitAPI = await Promise.all(
        ItineraryPriceCheckResponses.map(async (item) => {  
    // add balance here
    const maxCreditLimitPriceUp =
    getAgentConfigForUpdateagain?.maxcreditLimit ?? 0;

    const newBalanceCredit =
    maxCreditLimitPriceUp +
      item?.offeredPrice +
      item?.totalMealPrice +
      item?.totalBaggagePrice +
      item?.totalSeatPrice;
    await agentConfig.updateOne(
      { userId: getuserDetails._id },
      { maxcreditLimit: newBalanceCredit }
    );
    await ledger.create({
      userId: getuserDetails._id,
      companyId: getuserDetails.company_ID._id,
      ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
      transactionAmount:
        item?.offeredPrice +
        item?.totalMealPrice +
        item?.totalBaggagePrice +
        item?.totalSeatPrice,
      currencyType: "INR",
      fop: "CREDIT",
      transactionType: "DEBIT",
      runningAmount: newBalanceCredit,
      remarks: "Booking Amount Dedactive Into Your Account.",
      transactionBy: getuserDetails._id,
      cartId: item?.BookingId,
    });
  })
);
    let failedHtmlCode = `<!DOCTYPE html>
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
    `;

  if (hitAPI.length > 0 ) {
    return  failedHtmlCode;
  } else {
    return "Data does not exist"
   
  }


      
      
    }
    



 
  } catch (error) {
    throw error;
  }
};

module.exports = {
  payu,
  payuFail,
  payuSuccess,
};

const pgCharges = require("../../models/pgCharges");
const Role = require("../../models/Role");
const User = require("../../models/User");
const crypto = require("crypto");
const UserModel = require("../../models/User");
const BookingDetails = require("../../models/booking/BookingDetails");
const transaction = require("../../models/transaction");
const ledger = require("../../models/Ledger");
const Railledger=require('../../models/Irctc/ledgerRail')
const agentConfig = require("../../models/AgentConfig");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const BookingTemp = require("../../models/booking/BookingTemp");
const { Config } = require("../../configs/config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const {
  createLeadger,
  getTdsAndDsicount,
  priceRoundOffNumberValues,
  recieveDI,
} = require("../commonFunctions/common.function");
const AgentConfiguration = require("../../models/AgentConfig");

const payu = async (req, res) => {
  try {
    const {
      companyId,
      userId,
      firstName,
      email,
      amount,
      phone,
      productinfo,
      cartId,
      pgCharges,
      normalAmount,
    } = req.body;

    if (
      (!companyId ||
        !userId ||
        !firstName ||
        !email ||
        !amount ||
        !productinfo ||
        !phone,
      !cartId)
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

    const key =
      Config.MODE == "TEST"
        ? Config.PAYMENT_CREDENTIALS_PAYU.TEST.key
        : Config.PAYMENT_CREDENTIALS_PAYU.LIVE.key;
    const txnid = uuidv4();
    const amountres = amount;
    const productinfores = productinfo;
    const firstnameres = firstName;
    const emailres = email;
    const phoneres = phone;
    const surl = `${Config[Config.MODE].baseURLBackend
    }/api/paymentGateway/success`;
    const furl = `${
      Config[Config.MODE].baseURLBackend
    }/api/paymentGateway/failed`;

    const salt =
      Config.MODE == "TEST"
        ? Config.PAYMENT_CREDENTIALS_PAYU.TEST.salt
        : Config.PAYMENT_CREDENTIALS_PAYU.LIVE.salt;
    const cartIdres = cartId;

    // Concatenate the transaction details
    const hashString = `${key}|${txnid}|${amountres}|${productinfores}|${firstnameres}|${emailres}|${cartIdres}|${normalAmount}|${pgCharges}||||||||${salt}`;

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
      udf1: cartIdres,
      udf2: normalAmount,
      udf3: pgCharges,
    };

    // Add the hash to payment details
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
    // return {
    //   response: "Data does not exist",
    //   data: error,
    // };
    throw error;
  }
};
const payu2 = async (req, res) => {
  try {
    const {
      companyId,
      userId,
      firstName,
      email,
      amount,
      phone,
      productinfo,
      cartId,
      pgCharges,
      normalAmount,
    } = req.body;

    if (
      (!companyId ||
        !userId ||
        !firstName ||
        !email ||
        !amount ||
        !productinfo ||
        !phone,
      !cartId)
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

    const key ="DlSTL0cw"
    
    const txnid = uuidv4();
    const amountres = amount;
    const productinfores = productinfo;
    const firstnameres = firstName;
    const emailres = email;
    const phoneres = phone;
    const surl = `${
      Config[Config.MODE].baseURLBackend
    }/api/paymentGateway/success`;
    const furl = `${
      Config[Config.MODE].baseURLBackend
    }/api/paymentGateway/failed`;

    const salt ="HYDinl3tea"
    const cartIdres = cartId;

    // Concatenate the transaction details
    const hashString = `${key}|${txnid}|${amountres}|${productinfores}|${firstnameres}|${emailres}|${cartIdres}|${normalAmount}|${pgCharges}||||||||${salt}`;

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
      udf1: cartIdres,
      udf2: normalAmount,
      udf3: pgCharges,
    };

    // Add the hash to payment details
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
    // return {
    //   response: "Data does not exist",
    //   data: error,
    // };
    throw error;
  }
};


const payuSuccess = async (req, res) => {
  try {
    const {
      status,
      txnid,
      productinfo,
      udf1,
      udf2,
      udf3,
      amount,
      payment_source,
      bank_ref_num,
      PG_TYPE,
      cardCategory,
    } = req.body;

    
    const CheckAllereadyBooking = await BookingDetails.find({bookingId:udf1,bookingStatus:{$ne:"INCOMPLETE"}})
    if(CheckAllereadyBooking.length){
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
          <a href="${
            Config[Config.MODE].baseURL
          }/home/manageFlightBooking/cart-details-review?bookingId=${udf1}">Go to Merchant...</a>
        </div>
      </body>
      </html>`
      return successHtmlCode
    }


 else if (status === "success") {

     const BookingTempData = await BookingTemp.findOne({ BookingId: udf1 });
      


      if (BookingTempData) {
        const convertDataBookingTempRes = JSON.parse(BookingTempData.request);
        const PassengerPreferences = JSON.parse(
          convertDataBookingTempRes.PassengerPreferences
        );
        const ItineraryPriceCheckResponses = JSON.parse(
          convertDataBookingTempRes.ItineraryPriceCheckResponses
        );

        const Authentication = JSON.parse(
          convertDataBookingTempRes.Authentication
        );
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
          console.log('test url')
          createTokenUrl = `http://stage1.ksofttechnology.com/api/Freport`;
          flightSearchUrl = `http://stage1.ksofttechnology.com/api/FPNR`;
        }

        let getuserDetails;

        getuserDetails = await UserModel.findOne({
          _id: Authentication.UserId,
        }).populate("company_ID");
        if (getuserDetails) {
          getuserDetails = getuserDetails;
        } else {
          getuserDetails = "User Not Found";
        }

        let getconfigAmount; // Declare getconfigAmount outside of the if block
        const companieIds = await UserModel.findById(getuserDetails._id);

        const getAllComapnies = await UserModel.find({
          company_ID: companieIds.company_ID,
        }).populate("roleId");
        let allIds = getAllComapnies
          .filter((item) => item.roleId.name === "Agency")
          .map((item) => item._id);

        const getAgentConfigForUpdateagain = await agentConfig.findOne({
          userId: allIds[0],
        });

        if (getAgentConfigForUpdateagain) {
          getconfigAmount = getAgentConfigForUpdateagain.maxcreditLimit;
        } else {
          return "Agency Config Not Found"; // Return the error message if agent config is not found
        }
        //return getconfigAmount;

        let totalItemAmount = 0; // Initialize totalItemAmount outside the reduce function

        const totalsAmount = ItineraryPriceCheckResponses.reduce(
          (acc, curr) => {
            // Add current item prices to the accumulator
            acc.offeredPrice += curr.offeredPrice;
            acc.totalMealPrice += curr.totalMealPrice;
            acc.totalBaggagePrice += curr.totalBaggagePrice;
            acc.totalSeatPrice += curr.totalSeatPrice;

            return acc; // Return accumulator
          },
          {
            offeredPrice: 0,
            totalMealPrice: 0,
            totalBaggagePrice: 0,
            totalSeatPrice: 0,
          }
        );
        // Calculate totalItemAmount by summing up all prices
        totalItemAmount =
          totalsAmount.offeredPrice +
          totalsAmount.totalMealPrice +
          totalsAmount.totalBaggagePrice +
          totalsAmount.totalSeatPrice;

        const newBalanceCredit = getconfigAmount + totalItemAmount;

        let itemAmount = 0;
        // await agentConfig.updateOne(
        //   { userId: allIds[0] },
        //   { maxcreditLimit: newBalanceCredit }
        // );

        let gtTsAdDnt = await getTdsAndDsicount(ItineraryPriceCheckResponses);
        console.log(gtTsAdDnt, "payu123");
        await ledger.create({
          userId: allIds[0], //getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: totalItemAmount,
          deal: gtTsAdDnt?.ldgrdiscount,
          tds: gtTsAdDnt?.ldgrtds,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "CREDIT",
          runningAmount: newBalanceCredit,
          remarks: "Booking Amount Deducted from Your Account(PayU).",
          transactionBy: getuserDetails._id,
          cartId: udf1,
        });

        await ledger.create({
          userId: allIds[0], //getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: totalItemAmount,
          deal: gtTsAdDnt?.ldgrdiscount,
          tds: gtTsAdDnt?.ldgrtds,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount: newBalanceCredit - totalItemAmount,
          remarks: "Booking Amount Deducted from Your Account(PayU).",
          transactionBy: getuserDetails._id,
          cartId: udf1,
        });
        // await agentConfig.updateOne(
        //   { userId: allIds[0] },
        //   { maxcreditLimit: newBalanceCredit - totalItemAmount }
        // );

        //const hitAPI = await Promise.all(

        var totalRefundAmount=0;
        const updatePromises = ItineraryPriceCheckResponses.map(
          async (item) => {
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
                logName: "air Booking",
                request: requestDataFSearch,
                responce: fSearchApiResponse?.data,
              };
              const logData1 = {
                traceId: Authentication.TraceId,
                companyId: Authentication.CompanyId,
                userId: Authentication.UserId,
                source: "Kafila",
                type: "Portal log",
                BookingId: udf1,
                product: "Flight",
                logName: "Air Booking",
                request: requestDataFSearch,
                responce: fSearchApiResponse?.data,
              };
              const logData2 = {
                traceId: Authentication.TraceId,
                companyId: Authentication.CompanyId,
                userId: Authentication.UserId,
                source: "Kafila",
                type: "Portal log",
                BookingId: udf1,
                product: "Flight",
                logName: "EazeBuzz Response",
                request: "Request captured from portal",
                responce: req.body,
              };
              Logs(logData);
              Logs(logData1);
              Logs(logData2);
              if (
                fSearchApiResponse.data.Status == "failed" ||
                fSearchApiResponse?.data?.IsError == true ||
                fSearchApiResponse?.data?.BookingInfo?.CurrentStatus == "FAILED"
              ) {
                console.log('JDifeieiei')
                await BookingDetails.updateOne(
                  {
                    bookingId: udf1,
                    "itinerary.IndexNumber": item.IndexNumber,
                  },
                  {
                    $set: {
                      bookingStatus: "FAILED",
                      bookingRemarks:
                        fSearchApiResponse?.data?.BookingInfo?.CurrentStatus ==
                        "FAILED"
                          ? fSearchApiResponse?.data?.BookingInfo?.BookingRemark
                          : fSearchApiResponse?.data?.ErrorMessage ||
                            error.message,
                    },
                  }
                );

                await BookingDetails.updateMany(
                  {
                    bookingId: udf1,
                    "itinerary.IndexNumber": item.IndexNumber,
                  },
                  {
                    $set: {
                      bookingStatus: "FAILED",
                      bookingRemarks: fSearchApiResponse?.data?.BookingInfo?.CurrentStatus === "FAILED"
                        ? fSearchApiResponse?.data?.BookingInfo?.BookingRemark
                        : fSearchApiResponse?.data?.ErrorMessage || error.message,
                    },
                  }
                );
          
                // Fetch booking details for the failed booking
                const updatedBooking = await BookingDetails.find(
                  {
                    bookingId: udf1,
                    bookingStatus: "FAILED"
                  },
                  { bookingTotalAmount: 1 }
                );
          
                // Accumulate the refund amounts
                const refundAmount = updatedBooking.reduce((sum, element) => {
                  return sum + (element.bookingTotalAmount || 0); // Add if bookingTotalAmount exists
                }, 0);

            updatedBooking.length>1?totalRefundAmount=totalItemAmount:totalRefundAmount=refundAmount;

          
                // Add to the total refund amount
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
                    SalePurchase:
                      fSearchApiResponse.data.BookingInfo.SalePurchase.ATDetails
                        .Account,
                  },
                }
              );

              const getpassengersPrefrence = await passengerPreferenceModel.findOne({ bookingId: udf1 });

              await Promise.all(
                getpassengersPrefrence.Passengers.map(async (passenger) => {
                  const apiPassenger =
                    fSearchApiResponse.data.PaxInfo.Passengers.find(
                      (p) =>
                        p.FName === passenger.FName &&
                        p.LName === passenger.LName
                    );
                  if (apiPassenger) {
                    const ticketUpdate =
                      passenger.Optional.ticketDetails.find(
                        (p) =>
                          p.src ===
                            fSearchApiResponse.data.Param.Sector[0].Src &&
                          p.des ===
                            fSearchApiResponse.data.Param.Sector[0].Des
                      );
                    if (ticketUpdate) {
                      ticketUpdate.ticketNumber =
                        apiPassenger?.Optional?.TicketNumber;
                    }

                    // passenger.Status = "CONFIRMED";
                  }
                })
              );
              await getpassengersPrefrence.save();


              if (
                fSearchApiResponse.data.BookingInfo.CurrentStatus === "FAILED"
              ) {
                return `${fSearchApiResponse.data}-${fSearchApiResponse.data}`;
              } else {
                itemAmount +=
                  item?.offeredPrice +
                  item?.totalMealPrice +
                  item?.totalBaggagePrice +
                  item?.totalSeatPrice;

                // Transtion
                // await transaction.updateOne(
                //   { bookingId: item?.BookingId },
                //   { statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY",
                //     trnsNo:txnid,
                //     // payment_source:payment_source,
                //     paymentMode:payment_source,
                //     trnsType:PG_TYPE,
                //     trnsBankRefNo:bank_ref_num,
                //     cardType:cardCategory
                //   }
                // );
                await transaction.create({
                  userId: Authentication.UserId,
                  bookingId: item?.BookingId,
                  companyId: Authentication.CompanyId,
                  trnsNo: txnid,
                  trnsType: "DEBIT",
                  // paymentMode: "Payu",
                  paymentMode: PG_TYPE,
                  paymentGateway: "PayU",
                  trnsStatus: "success",
                  transactionBy: Authentication.UserId,
                  pgCharges: udf3,
                  transactionAmount: udf2,
                  statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY",
                  trnsNo: txnid,
                  trnsBankRefNo: bank_ref_num,
                  cardType: cardCategory,
                });
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
              return error.message;
            }
          }
        );
        //);
        const results = await Promise.all(updatePromises);
        if(totalRefundAmount>0){
          await ledger.create({
            userId: allIds[0], //getuserDetails._id,
            companyId: getuserDetails.company_ID._id,
            ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            transactionAmount: totalRefundAmount,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "CREDIT",
            runningAmount: getconfigAmount+totalRefundAmount,
            remarks: `Refund Amount for Booking`,
            transactionBy: getuserDetails._id,
            cartId: udf1,
          });

          await agentConfig.updateOne(
            { userId: allIds[0] },
            { $inc: { maxcreditLimit: totalRefundAmount } }
          );
        }


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
        <a href="${
          Config[Config.MODE].baseURL
        }/home/manageFlightBooking/cart-details-review?bookingId=${udf1}">Go to Merchant...</a>
      </div>
    </body>
    </html>`;

        if (results.length > 0) {
          if (itemAmount !== 0) {
            const runnnigBalance = newBalanceCredit - itemAmount;
            // await agentConfig.updateOne(
            //   { userId: getuserDetails._id },
            //   { maxcreditLimit: runnnigBalance }
            // );
            // // await ledger.create({
            //   userId: getuserDetails._id,
            //   companyId: getuserDetails.company_ID._id,
            //   ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            //   transactionAmount: itemAmount,
            //   currencyType: "INR",
            //   fop: "DEBIT",
            //   transactionType: "DEBIT",
            //   runningAmount: runnnigBalance,
            //   remarks: "Booking Amount Dededucted From Your Account.",
            //   transactionBy: getuserDetails._id,
            //   cartId: udf1,
            // });
          }
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

const payuWalletResponceSuccess = async (req, res) => {
  try {
    const { status, txnid, productinfo, udf1, udf2, udf3, amount, PG_TYPE } =
      req.body;
    console.log(req.body, "req");
    console.log("jksdsds");
    //productinfo = product udf3= pgcharges;
    if (status === "success") {
      const userData = await User.findOne({ company_ID: udf1 }).populate({
        path: "roleId",
        match: { name: "Agency" },
      });

      const findUser = await User.findById(userData._id);
      const configData = await agentConfig
        .findOne({ userId: userData._id })
        .populate("diSetupIds")
        .populate({
          path: "diSetupIds",
          populate: {
            path: "diSetupIds", // If diSetupIds contains another reference
            model: "diSetup",
          },
        });
      // console.log(configData, "configData");
      // const doerId = req.user._id;
      const loginUser = userData._id;
      // console.log(loginUser, "loginUser");
      let DIdata = await recieveDI(
        configData,
        findUser,
        productinfo,
        udf2,
        loginUser,
        txnid
      );
      // console.log(DIdata, "DIdata1");
      // return false;
      if (userData) {
        const getAgentConfigForUpdate = await agentConfig.findOne({
          userId: userData._id,
        });
        const maxCreditAmount = getAgentConfigForUpdate?.maxcreditLimit ?? 0;
        const newBalanceAmount = maxCreditAmount + Number(amount);

        await agentConfig.findOneAndUpdate(
          { userId: userData._id },
          { maxcreditLimit: newBalanceAmount },
          { new: true }
        );
        await ledger.create({
          userId: userData._id,
          companyId: userData.company_ID,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionId: txnid,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "CREDIT",
          transactionType: "CREDIT",
          runningAmount: newBalanceAmount,
          remarks: "Wallet Amount Credited into Your Account.",
          transactionBy: userData._id,
        });

        await ledger.create({
          userId: userData._id,
          companyId: userData.company_ID,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionId: txnid,
          transactionAmount: udf3,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount: newBalanceAmount - udf3,
          remarks: "Manual AUTO_PGcharges(PayU)",
          transactionBy: userData._id,
        });
        await agentConfig.findOneAndUpdate(
          { userId: userData._id },
          { maxcreditLimit: newBalanceAmount - udf3 },
          { new: true }
        );
        console.log("hjdsdh");
        if (DIdata !== null || DIdata !== 0) {
          let tdsAmount = DIdata * (2 / 100);
          // console.log(tdsAmount, "tdsAmount");
          if (tdsAmount != 0) {
            tdsAmount = await priceRoundOffNumberValues(tdsAmount);
            // console.log(tdsAmount, "tdsAmount2");
            // console.log("hjdsdh12");
            const findUser = await User.findById(userData._id);
            console.log(findUser, "findUser");
            const configData = await agentConfig.findOne({
              userId: userData._id,
            });
            console.log(configData, "configData");
            if (!configData) {
              return {
                response: "User not found",
              };
            }
            if (productinfo === "Rail") {
              if (configData?.maxcreditLimit < amount) {
                return { response: "Insufficient Balance" };
              }
              configData.maxRailCredit -= tdsAmount;
              runningAmount = configData.maxRailCredit;
            }
            if (productinfo === "Flight") {
              if (configData?.maxcreditLimit < amount) {
                return { response: "Insufficient Balance" };
              }
              configData.maxcreditLimit -= tdsAmount;
              runningAmount = configData.maxcreditLimit;
            }
            console.log(runningAmount, "runningAmount");
            await configData.save();
            const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
            console.log(runningAmount, "runningAmount");
            await ledger.create({
              userId: findUser._id,
              companyId: findUser.company_ID,
              ledgerId: ledgerId,
              transactionId: txnid,
              transactionAmount: tdsAmount,
              currencyType: "INR",
              fop: "DEBIT",
              transactionType: "DEBIT",
              runningAmount,
              remarks: `Manual AUTO_TDS`,
              transactionBy: userData._id,
              productinfo,
            });
          }
        }

        await transaction.create({
          userId: userData._id,
          companyId: userData.company_ID,
          trnsNo: txnid,
          trnsType: "DEBIT",
          paymentMode: PG_TYPE,
          paymentGateway: "PayU",
          trnsStatus: "success",
          transactionBy: userData._id,
          transactionAmount: udf2,
          pgCharges: udf3,
        });

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
        <a href="${Config[Config.MODE].baseURL}">Go to Merchant...</a>
      </div>
    </body>
    </html>`;
        return successHtmlCode;
      } else {
        return "Data does not exist";
      }
    }
  } catch (error) {
    throw error;
  }
};

const payuWalletRailResponceSuccess = async (req, res) => {
  try {
    const { status, txnid, productinfo, udf1, udf2, udf3, amount, PG_TYPE } =
      req.body;
    console.log("shadaab ali");
    //productinfo = product udf3= pgcharges;
    if (status === "success") {
      const userData = await User.findOne({ company_ID: udf1 }).populate({
        path: "roleId",
        match: { name: "Agency" },
      });

      const findUser = await User.findById(userData._id);
      const configData = await agentConfig
        .findOne({ userId: userData._id })
        .populate("diSetupIds")
        .populate({
          path: "diSetupIds",
          populate: {
            path: "diSetupIds", // If diSetupIds contains another reference
            model: "diSetup",
          },
        });
      // console.log(configData, "configData");
      // const doerId = req.user._id;
      const loginUser = userData._id;
      // console.log(loginUser, "loginUser");
      let DIdata = await recieveDI(
        configData,
        findUser,
        productinfo,
        udf2,
        loginUser,
        txnid
      );
      // console.log(DIdata, "DIdata1");
      // return false;
      if (userData) {
        const getAgentConfigForUpdate = await agentConfig.findOne({
          userId: userData._id,
        });
        const maxCreditAmount = getAgentConfigForUpdate?.railCashBalance ?? 0;
        const newBalanceAmount = maxCreditAmount + Number(amount);

        await agentConfig.findOneAndUpdate(
          { userId: userData._id },
          { railCashBalance: newBalanceAmount },
          { new: true }
        );
        await Railledger.create({
          userId: userData._id,
          companyId: userData.company_ID,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionId: txnid,
          transactionAmount: amount,
          currencyType: "INR",
          fop: "CREDIT",
          transactionType: "CREDIT",
          runningAmount: newBalanceAmount,
          remarks: "Wallet Amount Credited into Your Account.",
          transactionBy: userData._id,
        });

        await Railledger.create({
          userId: userData._id,
          companyId: userData.company_ID,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionId: txnid,
          transactionAmount: udf3,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount: newBalanceAmount - udf3,
          remarks: "Wallet debited for PG charges(PayU)",
          transactionBy: userData._id,
        });
        await agentConfig.findOneAndUpdate(
          { userId: userData._id },
          { railCashBalance: newBalanceAmount - udf3 },
          { new: true }
        );
        console.log("hjdsdh");
        if (DIdata !== null || DIdata !== 0) {
          let tdsAmount = DIdata * (2 / 100);
          // console.log(tdsAmount, "tdsAmount");
          if (tdsAmount != 0) {
            tdsAmount = await priceRoundOffNumberValues(tdsAmount);
            // console.log(tdsAmount, "tdsAmount2");
            // console.log("hjdsdh12");
            const findUser = await User.findById(userData._id);
            console.log(findUser, "findUser");
            const configData = await agentConfig.findOne({
              userId: userData._id,
            });
            console.log(configData, "configData");
            if (!configData) {
              return {
                response: "User not found",
              };
            }
            if (productinfo === "Rail") {
              if (configData?.railCashBalance < amount) {
                return { response: "Insufficient Balance" };
              }
              configData.railCashBalance -= tdsAmount;
              runningAmount = configData.maxRailCredit;
            }
            // if (productinfo === "Flight") {
            //   if (configData?.maxcreditLimit < amount) {
            //     return { response: "Insufficient Balance" };
            //   }
            //   configData.maxcreditLimit -= tdsAmount;
            //   runningAmount = configData.maxcreditLimit;
            // }
            // console.log(runningAmount, "runningAmount");
            await configData.save();
            const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
            console.log(runningAmount, "runningAmount");
            await Railledger.create({
              userId: findUser._id,
              companyId: findUser.company_ID,
              ledgerId: ledgerId,
              transactionId: txnid,
              transactionAmount: tdsAmount,
              currencyType: "INR",
              fop: "DEBIT",
              transactionType: "DEBIT",
              runningAmount,
              remarks: `TDS against ${tdsAmount} DI deposit.`,
              transactionBy: userData._id,
              productinfo,
            });
          }
        }

        await transaction.create({
          userId: userData._id,
          companyId: userData.company_ID,
          trnsNo: txnid,
          trnsType: "DEBIT",
          paymentMode: PG_TYPE,
          paymentGateway: "PayU",
          trnsStatus: "success",
          transactionBy: userData._id,
          transactionAmount: udf2,
          pgCharges: udf3,
        });

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
        <a href="${Config[Config.MODE].baseURL}">Go to Merchant...</a>
      </div>
    </body>
    </html>`;
        return successHtmlCode;
      } else {
        return "Data does not exist";
      }
    }
  } catch (error) {
    throw error;
  }
};

const payuFail = async (req, res) => {
  try {
    const { status, txnid, productinfo, udf1, error_Message } = req.body;
    const BookingTempData = await BookingTemp.findOne({ BookingId: udf1 });

    if (!BookingTempData) {
      return "Data does not exist";
    }

    const convertDataBookingTempRes = JSON.parse(BookingTempData.request);
    const PassengerPreferences = JSON.parse(
      convertDataBookingTempRes.PassengerPreferences
    );
    const ItineraryPriceCheckResponses = JSON.parse(
      convertDataBookingTempRes.ItineraryPriceCheckResponses
    );
    const Authentication = JSON.parse(convertDataBookingTempRes.Authentication);

    let getuserDetails;
    try {
      getuserDetails = await UserModel.findOne({
        _id: Authentication.UserId,
      }).populate("company_ID");
      if (!getuserDetails) {
        return "User Not Found";
      }
    } catch (error) {
      // console.error('Error retrieving user details:', error);
      return "Data does not exist";
    }

    try {
      await BookingDetails.updateMany(
        { bookingId: udf1 },
        {
          $set: {
            bookingStatus: "FAILED PAYMENT",
            bookingRemarks: error_Message || "Payment Failed",
          },
        }
      );

      const failedHtmlCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failed</title>
          <style>
            .failed-txt {
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
            <p class="failed-txt">Your payment has failed.</p>
            <p>Please try again later.</p>
            <a href="${
              Config[Config.MODE].baseURL
            }/home/manageBooking/cart-details-review?bookingId=${udf1}">Go to Merchant...</a>
          </div>
        </body>
        </html>
      `;
      return failedHtmlCode;
    } catch (error) {
      //console.error('Error updating booking details:', error);
      return "Data does not exist";
    }
  } catch (error) {
    // console.error('Error handling payuFail request:', error);

    return "Data does not exist";
  }
};
const payuWalletFail = async (req, res) => {
  try {
    const { status, txnid, productinfo, udf1 } = req.body;

    const failedHtmlCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Failed</title>
          <style>
            .failed-txt {
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
            <p class="failed-txt">Your payment has failed.</p>
            <p>Please try again later.</p>
            <a href="${Config[Config.MODE].baseURL}">Go to Merchant...</a>
          </div>
        </body>
        </html>
      `;
    return failedHtmlCode;
  } catch (error) {
    // console.error('Error handling payuFail request:', error);

    return "Data does not exist";
  }
};

// const payuFail = async (req, res) => {
//   try {
//     const { status, txnid, productinfo, udf1 } = req.body;
//     const BookingTempData = await BookingTemp.findOne({ BookingId: udf1 });
//     if (BookingTempData) {
//       const convertDataBookingTempRes = JSON.parse(BookingTempData.request);
//       const PassengerPreferences = JSON.parse(
//         convertDataBookingTempRes.PassengerPreferences
//       );
//       const ItineraryPriceCheckResponses = JSON.parse(
//         convertDataBookingTempRes.ItineraryPriceCheckResponses
//       );
//       const Authentication = JSON.parse(
//         convertDataBookingTempRes.Authentication
//       );

//       let getuserDetails;
//       try {
//         getuserDetails = await UserModel.findOne({
//           _id: Authentication.UserId,
//         }).populate("company_ID");
//         if (getuserDetails) {
//           getuserDetails = getuserDetails;
//         } else {
//           getuserDetails = "User Not Found";
//         }
//       } catch (error) {
//         // console.error('Error creating booking:', error);
//         getuserDetails = "User Not Found";
//       }

//       const paymentFailed = await BookingDetails.updateMany(
//         {
//           bookingId: item?.BookingId,
//         },
//         {
//           $set: {
//             bookingStatus: "FAILED",
//             bookingRemarks: "Payment Failed",
//           },
//         }
//       );

//       let failedHtmlCode = `<!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Payment Success</title>
//       <style>
//       .failed-txt{
//         color: #bd362f;
//       }
//       body {
//         font-family: Arial, sans-serif;
//         margin: 0;
//         padding: 0;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 100vh;
//         background-color: #f2f2f2;
//       }

//       .failed-container {
//         max-width: 400px;
//         width: 100%;
//         padding: 20px;
//         border: 1px solid #ccc;
//         border-radius: 5px;
//         background-color: #fff;
//         text-align: center;
//       }

//       .failed-container p {
//         margin-top: 10px;
//       }

//       .failed-container a {
//         display: inline-block;
//         margin-top: 20px;
//         padding: 10px 20px;
//         background-color: #007bff;
//         color: #fff;
//         text-decoration: none;
//         border-radius: 5px;
//       }

//       .failed-container a:hover {
//         background-color: #0056b3;
//       }
//     </style>

//     </head>
//     <body>
//       <div class="failed-container">
//         <h1 class="failed-txt">Payment Failed!</h1>
//         <p class="failed-txt">Your payment has been failed.</p>
//         <p>Please try again later.</p>
//         <a href="https://kafilaui.traversia.net/home/manageBooking/cart-details-review?bookingId=${udf1}">Go to Merchant...</a>
//       </div>
//     </body>
//     </html>
//     `;

//       if (paymentFailed) {
//         return failedHtmlCode;
//       } else {
//         return "Data does not exist";
//       }
//     }
//   } catch (error) {
//     throw error;
//   }
// };
async function updateBarcode2DByBookingId(
  bookingId,
  passengerPreferencesData,
  item,
  pnr
) {
  try {
    const generateBarcodeUrl =
      "http://flightapi.traversia.net/api/GenerateBarCode/GenerateBarCode";
    const lastSectorIndex = item.Sectors.length - 1;
    const passengerPreference = await passengerPreferenceModel.findOne({
      bookingId: bookingId,
    });

    if (!passengerPreference) {
      console.error(
        "Passenger preference not found for booking ID:",
        bookingId
      );
      return; // Exit function if document not found
    }

    for (let passenger of passengerPreference.Passengers) {
      try {
        let reqPassengerData = {
          Company: item?.Provider,
          TripType: "O",
          PNR: pnr,
          PaxId: bookingId,
          PassangerFirstName: passenger?.FName,
          PassangerLastName: passenger?.LName,
          PassangetMidName: null,
          isInfant: false,
          MyAllData: [
            {
              DepartureStation: item?.Sectors[0]?.Departure?.Code,
              ArrivalStation: item?.Sectors[lastSectorIndex]?.Arrival?.Code,
              CarrierCode: item?.Sectors[0]?.AirlineCode,
              FlightNumber: item?.Sectors[0]?.FltNum,
              JulianDate: item?.Sectors[0]?.Departure?.Date,
              SeatNo: "",
              CheckInSeq: "N",
            },
          ],
        };

        const response = await axios.post(
          generateBarcodeUrl,
          reqPassengerData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newToken = response.data;
        if (!passenger.barCode2D) {
          passenger.barCode2D = [];
        }
        // break;
        //passengerPreference.Passengers.forEach(p => {
        //if (p.FName === passenger.FName && p.LName === passenger.LName) {
        passenger.barCode2D.push({
          FCode: item?.Sectors[0]?.AirlineCode,
          FNo: item?.Sectors[0]?.FltNum,
          Src: item?.Sectors[0]?.Departure?.Code,
          Des: item?.Sectors[lastSectorIndex]?.Arrival?.Code,
          Code: newToken,
        });
        //}
        //});

        //console.log("mytoken", passenger);
        // console.log("Barcode2D updated successfully for passenger:", passenger);
      } catch (error) {
        // console.error(
        //   "Error updating Barcode2D for passenger:",
        //   passenger,
        //   error
        // );
      }
    }
    //console.log("mydata", passengerPreference);
    // Save the updated document back to the database
    await passengerPreference.save();
    //console.log("Barcode2D updated successfully for booking ID:", bookingId);
  } catch (error) {
    //console.error("Error updating Barcode2D:", error);
  }
}
module.exports = {
  payu,
  payuFail,
  payuSuccess,
  payuWalletRailResponceSuccess,
  payuWalletResponceSuccess,
  payuWalletFail,
  payu2
};

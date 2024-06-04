const pgCharges = require("../../models/pgCharges");
const Role = require("../../models/Role");
const User = require("../../models/User");
const crypto = require("crypto");
const UserModel = require("../../models/User");
const BookingDetails = require("../../models/booking/BookingDetails");
const transaction = require("../../models/transaction");
const ledger = require("../../models/Ledger");
const agentConfig = require("../../models/AgentConfig");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const BookingTemp = require("../../models/booking/BookingTemp");
const config = require("../../configs/config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

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

    const key = MODE == "TEST " ? config.PAYMENT_CREDENTIALS_PAYU.TEST.key : config.PAYMENT_CREDENTIALS_PAYU.LIVE.key;
    const txnid = uuidv4();
    const amountres = amount;
    const productinfores = productinfo;
    const firstnameres = firstName;
    const emailres = email;
    const phoneres = phone;
    const surl = "https://kafila.traversia.net/api/paymentGateway/success";
    const furl = "https://kafila.traversia.net/api/paymentGateway/failed";
    const salt = MODE == "TEST " ? config.PAYMENT_CREDENTIALS_PAYU.TEST.salt : config.PAYMENT_CREDENTIALS_PAYU.LIVE.salt;
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
      udf1: cartIdres,
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
    const { status, txnid, productinfo, udf1 } = req.body;
    if (status === "success") {
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

        const getAgentConfigForUpdateagain = await agentConfig.findOne({
          userId: getuserDetails._id,
        });

        if (getAgentConfigForUpdateagain) {
          getconfigAmount = getAgentConfigForUpdateagain.maxcreditLimit;
        } else {
          return "Agency Config Not Found"; // Return the error message if agent config is not found
        }
        //return getconfigAmount;


        let totalItemAmount = 0; // Initialize totalItemAmount outside the reduce function

        const totalsAmount = ItineraryPriceCheckResponses.reduce((acc, curr) => {
          // Add current item prices to the accumulator
          acc.offeredPrice += curr.offeredPrice;
          acc.totalMealPrice += curr.totalMealPrice;
          acc.totalBaggagePrice += curr.totalBaggagePrice;
          acc.totalSeatPrice += curr.totalSeatPrice;

          return acc; // Return accumulator
        }, { offeredPrice: 0, totalMealPrice: 0, totalBaggagePrice: 0, totalSeatPrice: 0 });
        // Calculate totalItemAmount by summing up all prices
        totalItemAmount = totalsAmount.offeredPrice + totalsAmount.totalMealPrice + totalsAmount.totalBaggagePrice + totalsAmount.totalSeatPrice;

        const newBalanceCredit =
          getconfigAmount + totalItemAmount;

        let itemAmount = 0;
        await agentConfig.updateOne(
          { userId: getuserDetails._id },
          { maxcreditLimit: newBalanceCredit }
        );
        await ledger.create({
          userId: getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: totalItemAmount,
          currencyType: "INR",
          fop: "CREDIT",
          transactionType: "DEBIT",
          runningAmount: newBalanceCredit,
          remarks: "Booking Amount Dedactive Into Your Account.",
          transactionBy: getuserDetails._id,
          cartId: udf1,
        });

        //const hitAPI = await Promise.all(
        const updatePromises = ItineraryPriceCheckResponses.map(async (item) => {
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
                  SalePurchase: fSearchApiResponse.data.BookingInfo.SalePurchase.ATDetails.Account,
                },
              }
            );

            const getpassengersPrefrence = await passengerPreferenceModel.findOne({ bookingId: udf1 });

                if (getpassengersPrefrence && getpassengersPrefrence.Passengers) {
                    await Promise.all(getpassengersPrefrence.Passengers.map(async (passenger) => {
                      const apiPassenger = fSearchApiResponse.data.PaxInfo.Passengers.find(p => p.FName === passenger.FName && p.LName === passenger.LName);
                      if (apiPassenger) {
                        passenger.Optional.TicketNumber = apiPassenger.Optional.TicketNumber;
                        //passenger.Status = "CONFIRMED";
                    }                      
                    }));

                    await getpassengersPrefrence.save();
                }      


            if (
              fSearchApiResponse.data.BookingInfo.CurrentStatus === "FAILED"
            ) {
              return `${fSearchApiResponse.data}-${fSearchApiResponse.data}`;
            } else {

              itemAmount += item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice;


              
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
            return error.message;
          }
        })
        //);
        const results = await Promise.all(updatePromises);
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
        <a href="https://kafilaui.traversia.net/home/manageBooking/cart-details-review?bookingId=${udf1}">Go to Merchant...</a>
      </div>
    </body>
    </html>`;

        if (results.length > 0) {
          if(itemAmount !== 0){
          const runnnigBalance =  newBalanceCredit - itemAmount;      
          await agentConfig.updateOne(
            { userId: getuserDetails._id },
            { maxcreditLimit: runnnigBalance }
          );
          await ledger.create({
            userId: getuserDetails._id,
            companyId: getuserDetails.company_ID._id,
            ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            transactionAmount:itemAmount,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "CREDIT",
            runningAmount: runnnigBalance,
            remarks: "Booking Amount Add Into Your Account.",
            transactionBy: getuserDetails._id,
            cartId: udf1,
          });
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

const payuFail = async (req, res) => {
  try {
    const { status, txnid, productinfo, udf1 } = req.body;
    const BookingTempData = await BookingTemp.findOne({ BookingId: udf1 });

    if (!BookingTempData) {
      return "Data does not exist"; 
    }

    const convertDataBookingTempRes = JSON.parse(BookingTempData.request);
    const PassengerPreferences = JSON.parse(convertDataBookingTempRes.PassengerPreferences);
    const ItineraryPriceCheckResponses = JSON.parse(convertDataBookingTempRes.ItineraryPriceCheckResponses);
    const Authentication = JSON.parse(convertDataBookingTempRes.Authentication);

    let getuserDetails;
    try {
      getuserDetails = await UserModel.findOne({ _id: Authentication.UserId }).populate("company_ID");
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
            bookingStatus: "FAILED",
            bookingRemarks: "Payment Failed",
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
            <a href="https://kafilaui.traversia.net/home/manageBooking/cart-details-review?bookingId=${udf1}">Go to Merchant...</a>
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
};

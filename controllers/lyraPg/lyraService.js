
const axios=require('axios')
const {Config}=require('../../configs/config')
// const userModel=require('../../models/User')
const pgCharges = require("../../models/pgCharges");
const Role = require("../../models/Role");
const User = require("../../models/User");
const crypto = require("crypto");
const UserModel = require("../../models/User");
const BookingDetails = require("../../models/booking/BookingDetails");
const transaction = require("../../models/transaction");
const ledger = require("../../models/Ledger");
const Railledger = require("../../models/Irctc/ledgerRail");
const RailBookingDetail = require("../../models/Irctc/bookingDetailsRail");
const agentConfig = require("../../models/AgentConfig");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const passengerPreferenceModel = require("../../models/booking/PassengerPreference");
const BookingTemp = require("../../models/booking/BookingTemp");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
const {
  createLeadger,
  getTdsAndDsicount,
  priceRoundOffNumberValues,
  recieveDI,
  commonProviderMethodDate
} = require("../commonFunctions/common.function");
const AgentConfiguration = require("../../models/AgentConfig");
const { saveLogInFile } = require("../../utils/save-log");
const { commonFlightBook } = require("../../services/common-flight-book");
const { error } = require("console");

const lyraRedirectLink=async(req,res)=>{
    try{
const {Authentication,bookingId,amount,pgCharges,normalAmount,paymentFor}=req.body

console.log(req.body)

const userDetail=await User.findById({_id:req.user?._id})
// Config.MODE == "TEST"
//         ? Config.PAYMENT_CREDENTIALS_PAYU.TEST.key

//         : Config.PAYMENT_CREDENTIALS_PAYU.LIVE.key

// console.log(Config.TEST)
        const authHeader = "Basic " + Buffer.from(`${Config[Authentication?.CredentialType ?? "TEST"].lyraShopId}:${Config[Authentication?.CredentialType ?? "TEST"]?.lyraPassword}`).toString("base64");
        var url=""
        if(paymentFor.toLowerCase()=="wallet"){
          url="lyra/wallet/success"


        }else{
          url="lyra/success"

        }
        // console.log(authHeader)
        let totalAmount=Number(normalAmount+pgCharges)
        const response = await axios.post(
            "https://api.in.lyra.com/pg/rest/v1/charge",
            {
                orderId: bookingId,
                orderInfo: "FLight Booking",
                currency: "INR",
                udf:[normalAmount,pgCharges],
                amount: totalAmount*100,
                customer: {
                    name: userDetail?.fname+" "+userDetail?.lastName,
                    emailId: userDetail?.email,
                    phone: userDetail?.phoneNumber
                },
                return: {
                    method: "POST",
                    url: `http://localhost:3111/api/${url}`,
                    timeout: 100
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic OTkyMTA3NjM6dGVzdHBhc3N3b3JkX0UzQmhhb09QeTNqdjJMY2RxS1ozbjVUWTBTaHdpRDFta0w3Ymw2Vm1oSmcxbA==`, // Replace with actual Base64-encoded credentials
                }
            }
        );
        if(!response){
            res.status(403).json({
                success:false,
                Message:"response not found"
            })
            return
        }

         res.status(200).json({
            success:true,
            Message:"response found",
            data:response?.data
        })

    }
    catch(err){
      console.log(err)
        res.status(500).json({error:err.message})
        return
    }
}

const fetchChargeDetails = async (vads_charge_uuid) => {
  try {

      if (!vads_charge_uuid) {
          return {
              success: false,
              message: "vads_charge_uuid is required",
          };
      }

      // API URL
      const apiUrl = `https://api.in.lyra.com/pg/rest/v1/charge/${vads_charge_uuid}`;

      // API Call
      const { data: response } = await axios.get(apiUrl, {
          headers: {
              "Accept": "application/json",
              "Authorization": `Basic OTkyMTA3NjM6dGVzdHBhc3N3b3JkX0UzQmhhb09QeTNqdjJMY2RxS1ozbjVUWTBTaHdpRDFta0w3Ymw2Vm1oSmcxbA==`, // Replace with actual credentials
          },
      });

      if (!response) {
          return {
              success: false,
              message: "Response not found",
          };
      }

      // Destructuring response
      const { orderId, status, udf = [], transactions  = [] } = response;

      return {
          success: true,
         udf1: orderId||null,
          status,
          udf2: udf[0] || null,
          udf3: udf[1] || null,
          bank_ref_num: transactions[0]?.authRefNo || null,
          PG_TYPE: transactions[0]?.cardType || null,
          cardCategory: transactions[0]?.cardVariant || null,
          txnid: transactions[0]?.uuid || null,
      };
  } catch (error) {
      console.error("Error fetching data:", error.message);
      return {
          success: false,
          message: error.message,
      };
  }
};
const lyraSuccess = async (req, res) => {
  const {
    vads_charge_uuid,
  } = req.body;

   try {


      const {udf1,udf2,udf3,status,bank_ref_num,PG_TYPE,cardCategory,txnid}=await fetchChargeDetails(vads_charge_uuid)

  
      
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
  
  
     else if (status === "PAID") {
  
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
  
          const Segments = convertDataBookingTempRes.Segments
        
          const TravelType=convertDataBookingTempRes.TravelType
  
          const TypeOfTrip=convertDataBookingTempRes.TravelType
  
          const body={SearchRequest:{Authentication,PassengerPreferences,ItineraryPriceCheckResponses,TravelType,TypeOfTrip,Segments}}
  
          // console.log(PassengerPreferences)
  
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
  
            var pgChargesAmount=0
            if(udf3>0){
              totalItemAmount+udf3
              pgChargesAmount=udf3
              
            }
  
          const newBalanceCredit = getconfigAmount + totalItemAmount;
  
          let itemAmount = 0;
          // await agentConfig.updateOne(
          //   { userId: allIds[0] },
          //   { maxcreditLimit: newBalanceCredit }
          // );
  
          let gtTsAdDnt = await getTdsAndDsicount(ItineraryPriceCheckResponses);
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
  var runningAmountShow=newBalanceCredit+Number(pgChargesAmount)
          await ledger.create({
            userId: allIds[0], //getuserDetails._id,
            companyId: getuserDetails.company_ID._id,
            ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            transactionAmount: totalItemAmount-pgChargesAmount,
            deal: gtTsAdDnt?.ldgrdiscount,
            tds: gtTsAdDnt?.ldgrtds,
            currencyType: "INR",
            fop: "DEBIT",
            transactionType: "DEBIT",
            runningAmount:runningAmountShow-totalItemAmount,
            remarks: "Booking Amount Deducted from Your Account(PayU).",
            transactionBy: getuserDetails._id,
            cartId: udf1,
          });
  
          if(udf3>0){
            await ledger.create({
              userId: allIds[0], //getuserDetails._id,
              companyId: getuserDetails.company_ID._id,
              ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
              transactionAmount:pgChargesAmount,
             currencyType: "INR",
              fop: "DEBIT",
              transactionType: "DEBIT",
              runningAmount: newBalanceCredit-totalItemAmount,
              remarks: "Manual PG_CHARGE",
              transactionBy: getuserDetails._id,
              cartId: udf1,
            });
          }
          
          // await agentConfig.updateOne(
          //   { userId: allIds[0] },
          //   { maxcreditLimit: newBalanceCredit - totalItemAmount }
          // );
  
          //const hitAPI = await Promise.all(
          var totalRefundAmount=0;
          var bookingId=""
          var errorMessage="";
          const updatePromises = ItineraryPriceCheckResponses.map(
            async (item,idx) => {
              bookingId=item.BookingId
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
                let fSearchApiResponse=null;
                if (item.Provider === "Kafila") {
                  fSearchApiResponse = await axios.post(
                    flightSearchUrl,
                    requestDataFSearch,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                } else {
                  // console.log(body?.SearchRequest?.Segments,"segmaents")
                  const reqSegment =await body?.SearchRequest?.Segments?.[idx];
                  // saveLogInFile("request-segment.json", { reqSegment });
                  fSearchApiResponse = await commonFlightBook(
                    body,
                    reqSegment,
                    item,
                    PassengerPreferences
                  );
  
                }
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
                // console.log(fSearchApiResponse,"jdieeieieiei")
                if (fSearchApiResponse.data.Status == "Failed"||
                  fSearchApiResponse.data.Status == "failed" ||
                  fSearchApiResponse?.data?.IsError == true ||
                  fSearchApiResponse?.data?.BookingInfo?.CurrentStatus == "FAILED"
                ) {
                  // console.log(fSearchApiResponse?.data,'JDifeieiei')
                errorMessage=fSearchApiResponse?.data?.ErrorMessage||fSearchApiResponse?.data?.BookingInfo?.BookingRemark||"error occured"
                  await BookingDetails.updateOne(
                    {
                      bookingId: udf1,
                      "itinerary.IndexNumber": item.IndexNumber,
                      bookingStatus:{$ne:"CONFIMED"}
  
                    },
                    {
                      $set: {
                        bookingStatus: "FAILED",
                        bookingRemarks:
                        fSearchApiResponse?.data?.ErrorMessage||fSearchApiResponse?.data?.BookingInfo?.BookingRemark||"error occured",
                      },
                    }
                  );
  
                  await BookingDetails.updateMany(
                    {
                      bookingId: udf1,
                      "itinerary.IndexNumber": item.IndexNumber,
                      bookingStatus:{$ne:"CONFIMED"}
                    },
                    {
                      $set: {
                        bookingStatus: "FAILED",
                        bookingRemarks: fSearchApiResponse?.data?.ErrorMessage||fSearchApiResponse?.data?.BookingInfo?.BookingRemark||"error occured",
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
                      providerBookingId:  fSearchApiResponse.data.BookingInfo?.BookingId?fSearchApiResponse.data.BookingInfo?.BookingId:fSearchApiResponse.data.BookingInfo.CurrentStatus==="CONFIRMED"? await commonProviderMethodDate():fSearchApiResponse.data.BookingInfo.BookingId,
                      PNR: fSearchApiResponse.data.BookingInfo.APnr,
                      APnr: fSearchApiResponse.data.BookingInfo.APnr,
                      GPnr: fSearchApiResponse.data.BookingInfo.GPnr,
                      SalePurchase:
                        fSearchApiResponse?.data?.BookingInfo?.SalePurchase?.ATDetails
                          ?.Account,
                    },
                  }
                );
  
                const getpassengersPrefrence = await passengerPreferenceModel.findOne({ bookingId: udf1 });
  
                if (
                  item.Provider === "Kafila" &&
                  getpassengersPrefrence?.Passengers
                ) {
                  // await Promise.all(
                  getpassengersPrefrence.Passengers.map((passenger) => {
                    const apiPassenger =
                      fSearchApiResponse.data.PaxInfo.Passengers.find(
                        (p) =>
                          p.FName === passenger.FName &&
                          p.LName === passenger.LName
                      );
                    if (apiPassenger) {
                      passenger.Status=fSearchApiResponse.data.BookingInfo.CurrentStatus?fSearchApiResponse.data.BookingInfo.CurrentStatus:"CONFIRMED"
                      const ticketUpdate =
                        passenger?.Optional?.ticketDetails?.find?.(
                          (p) =>
                            p?.src ===
                              fSearchApiResponse?.data?.Param?.Sector?.[0]
                                ?.Src &&
                            p?.des ===
                              fSearchApiResponse?.data?.Param?.Sector?.[0]?.Des
                        );
                      if (ticketUpdate) {
                        ticketUpdate.ticketNumber =
                          apiPassenger?.Optional?.TicketNumber;
                      }
  
                      // passenger.Status = "CONFIRMED";
                    }
                  });
                  // );
                  bookingResponce.PassengerPreferences.Passengers =
                    getpassengersPrefrence.Passengers;
                  await getpassengersPrefrence.save();
                } else if (
                  fSearchApiResponse?.data?.BookingInfo?.CurrentStatus ===
                  "CONFIRMED"
                ) {
                  getpassengersPrefrence.Passengers.map?.(async (passenger) => {
                    const segmentMap = {};
                    passenger.Optional.ticketDetails.forEach((ticket, idx) => {
                      segmentMap[`${ticket.src}-${ticket.des}`] = idx;
                    });
                    const selectedPax =
                      fSearchApiResponse.data.PaxInfo.Passengers.find(
                        (p) =>
                          p.FName === passenger.FName &&
                          p.LName === passenger.LName
                      );
                    if (!selectedPax) return passenger;
                    passenger.Status=fSearchApiResponse.data.BookingInfo.CurrentStatus?fSearchApiResponse.data.BookingInfo.CurrentStatus:"CONFIRMED"
  
                    // saveLogInFile("selected-pax.json", selectedPax);
                    passenger.Optional.EMDDetails = [
                      ...(passenger.Optional.EMDDetails || []),
                      ...(selectedPax?.Optional?.EMDDetails || []),
                    ];
                    if (selectedPax?.Optional?.ticketDetails?.length) {
                      selectedPax.Optional?.ticketDetails.forEach((ticket) => {
                        const segmentIdx =
                          segmentMap[`${ticket.src}-${ticket.des}`];
                        if (segmentIdx != null) {
                          passenger.Optional.ticketDetails[
                            segmentIdx
                          ].ticketNumber = ticket.ticketNumber;
                        } else {
                          passenger.Optional.ticketDetails.push(ticket);
                        }
                      });
                    }
                    return passenger;
                  });
                  bookingResponce.PassengerPreferences.Passengers =
                    getpassengersPrefrence.Passengers;
                  // saveLogInFile(
                  //   "pax-preferences.json",
                  //   getpassengersPrefrence._doc
                  // );
                  await getpassengersPrefrence.save();
                }
  
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
                if (error.message?.toLowerCase().includes("socket hang up")) {
                  await BookingDetails.updateOne(
                    {
                      bookingId: item?.BookingId,
                      "itinerary.IndexNumber": item.IndexNumber,
                      bookingStatus:{$ne:"CONFIRMED"},
                    },
                    {
                      $set: {
                        bookingStatus: "PENDING",
                      },
                    }
                  );
  
                  return error.message;
  
              }
              else{
  
                await BookingDetails.updateOne(
                  {
                    bookingId: item?.BookingId,
                    "itinerary.IndexNumber": item.IndexNumber,
                    bookingStatus:{$ne:"CONFIRMED"}
                  },
                  {
                    $set: {
                      bookingStatus: "FAILED",
                      bookingRemarks: errorMessage,
                    },
                  }
                );
                return error.message;
              }
  
              }
            }
          );
          //);
          const results = await Promise.all(updatePromises);
          if(results.length>0){
            await transaction.create({
              userId: Authentication.UserId,
              bookingId: bookingId,
              companyId: Authentication.CompanyId,
              trnsNo: txnid,
              trnsType: "DEBIT",
              // paymentMode: "Payu",
              paymentMode: PG_TYPE,
              paymentGateway: "PayU",
              trnsStatus: "success",
              transactionBy: Authentication.UserId,
              pgCharges: udf3,
              transactionAmount: Number(udf2)+Number(pgChargesAmount),
              statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY",
              trnsNo: txnid,
              trnsBankRefNo: bank_ref_num,
              cardType: cardCategory,
            });
          }
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

      else {
      const failedHtml=`  <!DOCTYPE html>
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
      return failedHtml;
          }
      
    } catch (error) {
      throw error;
    }
  };
  
  
  const lyraWalletResponceSuccess = async (req, res) => {
    try {

      const {vads_charge_uuid,productinfo}=req.body
      let { status, txnid,  udf1, udf2, udf3, amount, PG_TYPE } =
      await fetchChargeDetails(vads_charge_uuid);
      //productinfo = product udf3= pgcharges;

  
      var successHtmlCode;
      const findtransaction = await transaction.find({ trnsNo: txnid });
      if (findtransaction.length > 0) {
        successHtmlCode = `<!DOCTYPE html>
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
      } else if (status === "success") {
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
        var DIdata
        if(PG_TYPE == "CC-PG"||PG_TYPE=="UPI-PG"){
         DIdata=0
        }else{
  
         DIdata = await recieveDI(
          configData,
          findUser,
          productinfo,
          udf2,
          loginUser,
          txnid
        );
      }
  
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
            transactionAmount: Number(udf2) + Number(udf3),
            pgCharges: udf3,
          });
  
          successHtmlCode = `<!DOCTYPE html>
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
  
  const lyraWalletRailResponceSuccess = async (req, res) => {
    try {
      const { status, txnid, productinfo, udf1, udf2, udf3, amount, PG_TYPE } =
        req.body;
      console.log("shadaab ali");
      //productinfo = product udf3= pgcharges;
      var successHtmlCode;
      const findtransaction = await transaction.find({ trnsNo: txnid });
      if (findtransaction.length > 0) {
        successHtmlCode = `<!DOCTYPE html>
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
      }
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
        // let DIdata = await recieveDI(
        //   configData,
        //   findUser,
        //   productinfo,
        //   udf2,
        //   loginUser,
        //   txnid
        // );
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
            remarks:  "Manual Wallet Amount Credited into Your Account.",
            transactionBy: userData._id,
          });
  
          if(Number(udf3)!==0){
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
              remarks: "Manual Wallet debited for PG charges(PayU)",
              transactionBy: userData._id,
            });
            await agentConfig.findOneAndUpdate(
              { userId: userData._id },
              { railCashBalance: newBalanceAmount - udf3 },
              { new: true }
            );
            
          }
         
          console.log("hjdsdh");
          // if (DIdata !== null || DIdata !== 0) {
          //   let tdsAmount = DIdata * (2 / 100);
          //   // console.log(tdsAmount, "tdsAmount");
          //   if (tdsAmount != 0) {
          //     tdsAmount = await priceRoundOffNumberValues(tdsAmount);
          //     // console.log(tdsAmount, "tdsAmount2");
          //     // console.log("hjdsdh12");
          //     const findUser = await User.findById(userData._id);
          //     console.log(findUser, "findUser");
          //     const configData = await agentConfig.findOne({
          //       userId: userData._id,
          //     });
          //     console.log(configData, "configData");
          //     if (!configData) {
          //       return {
          //         response: "User not found",
          //       };
          //     }
          //     if (productinfo === "Rail") {
          //       if (configData?.railCashBalance < amount) {
          //         return { response: "Insufficient Balance" };
          //       }
          //       configData.railCashBalance -= tdsAmount;
          //       runningAmount = configData.maxRailCredit;
          //     }
          //     // if (productinfo === "Flight") {
          //     //   if (configData?.maxcreditLimit < amount) {
          //     //     return { response: "Insufficient Balance" };
          //     //   }
          //     //   configData.maxcreditLimit -= tdsAmount;
          //     //   runningAmount = configData.maxcreditLimit;
          //     // }
          //     // console.log(runningAmount, "runningAmount");
          //     await configData.save();
          //     // const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000); // Example random number generation
          //     // console.log(runningAmount, "runningAmount");
          //     // await Railledger.create({
          //     //   userId: findUser._id,
          //     //   companyId: findUser.company_ID,
          //     //   ledgerId: ledgerId,
          //     //   transactionId: txnid,
          //     //   transactionAmount: tdsAmount,
          //     //   currencyType: "INR",
          //     //   fop: "DEBIT",
          //     //   transactionType: "DEBIT",
          //     //   runningAmount,
          //     //   remarks: `TDS against ${tdsAmount} DI deposit.`,
          //     //   transactionBy: userData._id,
          //     //   productinfo,
          //     // });
          //   }
          // }
  
          await transaction.create({
            userId: userData._id,
            companyId: userData.company_ID,
            trnsNo: txnid,
            trnsType: "DEBIT",
            paymentMode: PG_TYPE,
            paymentGateway: "PayU",
            trnsStatus: "success",
            transactionBy: userData._id,
            transactionAmount: Number(udf2) + Number(udf3),
            pgCharges: udf3,
          });
  
          successHtmlCode = `<!DOCTYPE html>
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
  
  const payuRailSuccess = async (req, res) => {
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
  
      const CheckAllereadyBooking = await RailBookingDetail.find({
        CartId: udf1,
        bookingStatus: { $ne: "INCOMPLETE" },
      });
      if (CheckAllereadyBooking.length) {
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
        return successHtmlCode;
      } else if (status === "success") {
        const agentData = await RailBookingDetail.aggregate([
          {
            $match: {
              cartId: udf1,
            },
          },
          {
            $lookup: {
              from: "agentconfigurations",
              localField: "userId",
              foreignField: "userId",
              as: "agentData",
            },
          },
          {
            $unwind: {
              path: "$agentData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "companies",
              localField: "AgencyId",
              foreignField: "_id",
              as: "ComapnyData",
            },
          },
          {
            $unwind: {
              path: "$ComapnyData",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]);
        // console.log("jsoeo",agentData);
  
        if (agentData.length == 0) {
          throw new Error("Data not found");
        }
  
        let runningAmount = agentData[0].agentData?.railCashBalance || 0;
        const userData = agentData[0]?.agentData || null;
        const CompnayData = agentData[0]?.ComapnyData;
        const parsedAmount = Number(amount);
        const parsedPgCharges = Number(udf3);
        const initialRunningAmount = Number(runningAmount);
  
        runningAmount += parsedAmount;
        await createLedgerEntry({
          userId: userData.userId,
          companyId: CompnayData._id,
          transactionType: "CREDIT",
          transactionAmount: parsedAmount,
          updatedRunningAmount: runningAmount,
          remarks: "Credit Ticket Amount.",
          txnid,
        });
  
        const debitAmountWithoutPgCharges = parsedAmount - parsedPgCharges;
        runningAmount -= debitAmountWithoutPgCharges;
        await createLedgerEntry({
          userId: userData.userId,
          companyId: CompnayData._id,
          transactionType: "DEBIT",
          transactionAmount: debitAmountWithoutPgCharges,
          updatedRunningAmount: runningAmount,
          remarks: "Debited Ticket Amount.",
          txnid,
        });
  
        if (parsedPgCharges > 0) {
          runningAmount -= parsedPgCharges;
          await createLedgerEntry({
            userId: userData.userId,
            companyId: CompnayData._id,
            transactionType: "DEBIT",
            transactionAmount: parsedPgCharges,
            updatedRunningAmount: runningAmount,
            remarks: "Debited for PG charges (PayU).",
            txnid,
          });
        }
  
        const wsLoginUrl =
          req.headers.host == "localhost:3111" ||
          req.headers.host == "kafila.traversia.net"
            ? Config?.TEST?.IRCTC_BASE_URL + "/eticketing/wsapplogin"
            : Config?.LIVE?.IRCTC_BASE_URL + "/eticketing/wsapplogin";
        let irctcLoginFormFields = {
          wsTxnId: udf1,
          wsloginId: CompnayData?.railSubAgentId,
          wsReturnUrl:
            req.headers.host == "localhost:3111" ||
            req.headers.host == "kafila.traversia.net"
              ? Config?.TEST?.baseURLBackend + "/api/rail/bookingSave"
              : Config?.LIVE?.baseURLBackend + "/api/rail/bookingSave",
        };
  
        await transaction.create({
          userId: agentData?.userId,
          bookingId: udf3,
          companyId: CompnayData?._id,
          trnsNo: txnid,
          trnsType: "DEBIT",
          // paymentMode: "Payu",
          paymentMode: PG_TYPE,
          paymentGateway: "PayU",
          trnsStatus: "success",
          transactionBy: agentData?.userId,
          pgCharges: udf3,
          transactionAmount: parsedAmount,
          statusDetail: "APPROVED OR COMPLETED SUCCESSFULLY",
          trnsNo: txnid,
          trnsBankRefNo: bank_ref_num,
          cardType: cardCategory,
        });
  
        // const agentData=await agentConfig.findOne({userId:Authentication.userId})
  
        await RailBookingDetail.findOneAndUpdate(
          { cartId: udf1 },
          { $set: { bookingStatus: "PENDING" } },
          { new: true }
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
       <form id="redirectForm" method="POST" action="${wsLoginUrl}">
            <input type="hidden" name="wsloginId" value='${irctcLoginFormFields.wsloginId}' />
            <input type="hidden" name="wsTxnId" value='${irctcLoginFormFields.wsTxnId}' />
            <input type="hidden" name="wsReturnUrl" value='${irctcLoginFormFields.wsReturnUrl}' />
          </form>
          <script>
            document.getElementById("redirectForm").submit();
          </script>
      
      </body>
      </html>`;
  
        return successHtmlCode;
      } else {
      }
    } catch (error) {
      throw error;
    }
  };

  module.exports={
    lyraRedirectLink,lyraSuccess,lyraWalletResponceSuccess,lyraWalletRailResponceSuccess
  }
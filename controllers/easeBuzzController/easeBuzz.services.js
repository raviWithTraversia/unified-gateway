
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
const axios = require("axios");
const { Config } = require('../../configs/config');
const { v4: uuidv4 } = require("uuid");
const { createLeadger,getTdsAndDsicount } = require("../commonFunctions/common.function");

const easeBuzz = async (req, res) => {
  try {
    const { key, txnid, amount, productinfo, firstname, phone, email, surl, furl, hash,
      udf1, udf2, udf3, udf4, udf5, udf6, udf7, address1, address2, city, state, country,
      zipcode, show_payment_mode, request_flow, sub_merchant_id, payment_category,
      account_no, ifsc } = req.body;
    const data = new URLSearchParams();
    if (key) { data.append('key', key); }
    if (txnid) { data.append('txnid', txnid); }
    if (amount) { data.append('amount', amount); }
    if (productinfo) { data.append('productinfo', productinfo); }
    if (firstname) { data.append('firstname', firstname); }
    if (phone) { data.append('phone', phone); }
    if (email) { data.append('email', email); }
    if (surl) { data.append('surl', surl); }
    if (furl) { data.append('furl', furl); }
    if (hash) { data.append('hash', hash); }
    if (udf1) { data.append('udf1', udf1); }
    if (udf2) { data.append('udf2', udf2); }
    if (udf3) { data.append('udf3', udf3); }
    if (udf4) { data.append('udf4', udf4); }
    if (udf5) { data.append('udf5', udf5); }
    if (udf6) { data.append('udf6', udf6); }
    if (udf7) { data.append('udf7', udf7); }
    if (address1) { data.append('address1', address1); }
    if (address2) { data.append('address2', address2); }
    if (city) { data.append('city', city); }
    if (state) { data.append('state', state); }
    if (country) { data.append('country', country); }
    if (zipcode) { data.append('zipcode', zipcode); }
    if (show_payment_mode) { data.append('show_payment_mode', show_payment_mode); }
    if (request_flow) { data.append('request_flow', request_flow); }
    if (sub_merchant_id) { data.append('sub_merchant_id', sub_merchant_id); }
    if (payment_category) { data.append('payment_category', payment_category); }
    if (account_no) { data.append('account_no', account_no); }
    if (ifsc) { data.append('ifsc', ifsc); }

    let PgUrl = Config.EASEBUZZ_PG_URL
    if (Config.MODE === "LIVE") {
      PgUrl = "https://pay.easebuzz.in/payment/initiateLink"
    }
    const response = await axios.post(PgUrl, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'Path=/'
      }
    });
    console.log(productinfo)
    console.log(response.data)
    return {
      response: "Fetch Data Successfully",
      data: response.data,
    };

  } catch (error) {
    throw error;
  }
}

const easeBuzzResponce = async (req, res) => {
  try {
    const { status, txnid, productinfo, udf1, net_amount_debit,card_type,payment_source, bankcode,bank_ref_num,bank_name,name_on_card, error_Message,pgCharges } = req.body;
    console.log(req.body,"jkssddjsj");
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
        const companieIds = await UserModel.findById(getuserDetails._id);

        const getAllComapnies = await UserModel.find({company_ID:companieIds.company_ID}).populate("roleId");
        let allIds = getAllComapnies
          .filter(item => item.roleId.name === "Agency")
          .map(item => item._id);

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
        // console.log(net_amount_debit, totalItemAmount,"jddsjk");
        const newBalanceCredit =
          getconfigAmount + totalItemAmount;
        // console.log(newBalanceCredit,"newBalanceCreditnewBalanceCredit");
        let itemAmount = 0;
        let gtTsAdDnt = await getTdsAndDsicount(ItineraryPriceCheckResponses);
        console.log("jkss2");
        await ledger.create({
          userId: allIds[0],//getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: totalItemAmount,
          deal:gtTsAdDnt?.ldgrdiscount,
          tds:gtTsAdDnt?.ldgrtds,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "CREDIT",
          runningAmount: newBalanceCredit,
          remarks: "Bookings Amount Deducted from Your Account(Easebuzz).",
          transactionBy: getuserDetails._id,
          cartId: udf1,
        });
        await ledger.create({
          userId: allIds[0], //getuserDetails._id,
          companyId: getuserDetails.company_ID._id,
          ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
          transactionAmount: totalItemAmount,
          deal:gtTsAdDnt?.ldgrdiscount,
          tds:gtTsAdDnt?.ldgrtds,
          currencyType: "INR",
          fop: "DEBIT",
          transactionType: "DEBIT",
          runningAmount: newBalanceCredit-totalItemAmount,
          remarks: "Booking Amount Deducted from Your Account(Easebuzz).",
          transactionBy: getuserDetails._id,
          cartId: udf1,
        });
        console.log("jkss1");
        // if(pgCharges){
        //   // await agentConfig.updateOne(
        //   //   { userId: allIds[0] },
        //   //   { maxcreditLimit: newBalanceCredit-totalItemAmount }
        //   // );
        // }else{
        //   // await agentConfig.updateOne(
        //   //   { userId: allIds[0] },
        //   //   { maxcreditLimit: newBalanceCredit }
        //   // );
        //   console.log(newBalanceCredit,"jdii")
        // }
        
        console.log("jkssddjsj123");
        // const hitAPI = await Promise.all(
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
              logName: "Air Booking",
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
            if (fSearchApiResponse.data.Status == "failed" || fSearchApiResponse?.data?.IsError == true || fSearchApiResponse?.data?.BookingInfo?.CurrentStatus == "FAILED") {
              await BookingDetails.updateOne(
                {
                  bookingId: udf1,
                  "itinerary.IndexNumber": item.IndexNumber,
                },
                {
                  $set: {
                    bookingStatus: "FAILED",
                    bookingRemarks: fSearchApiResponse?.data?.BookingInfo?.CurrentStatus == "FAILED" ? fSearchApiResponse?.data?.BookingInfo?.BookingRemark : fSearchApiResponse?.data?.ErrorMessage || error.message,
                  },
                }
              );
              await ledger.create({
                userId: allIds[0], //getuserDetails._id,
                companyId: getuserDetails.company_ID._id,
                ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
                transactionAmount: totalItemAmount,
                currencyType: "INR",
                fop: "DEBIT",
                transactionType: "CREDIT",
                runningAmount: newBalanceCredit,
                remarks: `Refund Amount for Booking`,
                transactionBy: getuserDetails._id,
                cartId: udf1,
              });

              await agentConfig.updateOne(
                { userId: allIds[0] },
                { $inc: { maxcreditLimit: totalItemAmount } }
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
            console.log(fSearchApiResponse.data,'shadaab ali')
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

              itemAmount += item?.offeredPrice +
                item?.totalMealPrice +
                item?.totalBaggagePrice +
                item?.totalSeatPrice;


              // Transtion
              // await transaction.updateOne(
              //   { bookingId: item?.BookingId },
              //   { statusDetail: status, trnsNo:txnid,paymentMode:card_type,bankName:bank_name,holderName:name_on_card, }
              // );
              //console.log("jkssddjsj");
              await transaction.create({
                userId: Authentication.UserId,
                bookingId:item?.BookingId,
                companyId:getAgentConfigForUpdateagain.companyId,
                trnsNo: txnid,
                trnsType: "DEBIT",
                paymentMode: card_type,
                paymentGateway:"EaseBuzz",
                trnsStatus: "success",
                // transactionBy: getuserDetails._id,
                pgCharges:pgCharges,
                transactionAmount:totalItemAmount,
                statusDetail: status, 
                trnsNo:txnid,
                trnsBankRefNo:bank_ref_num,
                // cardType:cardCategory,
                bankName:bank_name,
                holderName:name_on_card
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
        })
        // );
        const results = await Promise.all(updatePromises);
        console.log("jkssddjsj456");
        if (results.length > 0) {
          if (itemAmount !== 0) {
            const runnnigBalance = newBalanceCredit - itemAmount;
            // await agentConfig.updateOne(
            //   { userId: getuserDetails._id },
            //   { maxcreditLimit: runnnigBalance }
            // );
            // await ledger.create({
            //   userId: getuserDetails._id,
            //   companyId: getuserDetails.company_ID._id,
            //   ledgerId: "LG" + Math.floor(100000 + Math.random() * 900000),
            //   transactionAmount: itemAmount,
            //   currencyType: "INR",
            //   fop: "DEBIT",
            //   transactionType: "CREDIT",
            //   runningAmount: runnnigBalance,
            //   remarks: "Booking Amount Add Into 2nd Your Account.",
            //   transactionBy: getuserDetails._id,
            //   cartId: udf1,
            // });
          }
          return {
            response: "Fetch Data Successfully",
            data: "Save Successfully",
          };
        } else {
          return {
            response: "Fetch Data Successfully",
            data: "Payment Failed",
          };
        }
      }
    } 
    else {
      await BookingDetails.updateMany(
        { bookingId: udf1 },
        {
          $set: {
            bookingStatus: "FAILED PAYMENT",
            bookingRemarks: error_Message || "Payment Failed",
          },
        }
      );

      return {
        response: "Fetch Data Successfully",
        data: "Payment Failed",
      };
    }
  } catch (error) {
    throw error;
  }
}

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
  easeBuzz,
  easeBuzzResponce
}

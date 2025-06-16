const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const agentConfig = require("../../models/AgentConfig");
const bookingDetails = require("../../models/booking/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const creditNotes = require("../../models/CreditNotes");
const PassengerPreference=require('../../models/booking/PassengerPreference')
const axios = require("axios");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const { Error } = require("mongoose");
const ledger = require("../../models/Ledger");
const { Config } = require("../../configs/config");
const flightCache = new NodeCache();
const {RefundedCommonFunction,getTdsAndDsicount}=require('../../controllers/commonFunctions/common.function');
const InvoicingData = require("../../models/booking/InvoicingData");
const {ObjectId}=require("mongodb");
const BookingDetails = require("../../models/booking/BookingDetails");
const moment=require('moment')





// const calculateRefundAndCharges = (totalAmount, numPassengers, cancelledPassengers) => {
//   const baseFarePerPassenger = totalAmount / numPassengers;
//   const cancellationChargePerPassenger = 500; 
//   const cancellationCharges = cancelledPassengers * cancellationChargePerPassenger;
//   const remainingAmount = baseFarePerPassenger * (numPassengers - cancelledPassengers);
//   const refundAmount = remainingAmount - cancellationCharges;

//   return {
//     cancellationCharges,
//     refundAmount
//   };
// };

const flightCreditNotes = async (req,res) => {
  try{

  const {providerBokingId,companyId} = req.body;

 if (!providerBokingId || !companyId) {
    return {
      response: "Company or User id field are required",
    };
  }

  let MODEENV = "D";
  if (Config.MODE === "LIVE") {
    MODEENV = "P";
  }
let creditNoteDetail = await creditNotes.find().sort({createdAt: -1}).limit(1);
  let invoiceRandomNumber = 100000;
  if(creditNoteDetail.length>0){
      creditNoteDetail = creditNoteDetail[0];
      let previousInvoiceNumber = creditNoteDetail?.creditNoteNo;
      previousInvoiceNumber = previousInvoiceNumber.slice(-6);
      invoiceRandomNumber = parseInt(previousInvoiceNumber) +1; 
  }else{
      invoiceRandomNumber = 100000; 
  }
  let invoiceNumber=""
const CancelBookingData = await bookingDetails.aggregate([
  {
    $match: {
      providerBookingId: providerBokingId
    }
  },
  {
    $lookup: {
      from: "cancelationbookings",
      localField: "providerBookingId",
      foreignField: "bookingId",
      as: "cancelationBookingData"
    }
  },
  {
    $unwind: {
      path: "$cancelationBookingData",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "passengerpreferences",
      localField: "_id",
      foreignField: "bid",
      as: "passengerpreference"
    }
  },
  {
    $unwind: {
      path: "$passengerpreference",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "companies",
      localField: "companyId",
      foreignField: "_id",
      as: "CompanyDetail",
      pipeline: [
        {
          $lookup: {
            from: "agentconfigurations",
            let: { companyId: "$_id" }, 
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$companyId", "$$companyId"] 
                  }
                }
              }
            ],
            as: "agentconfigurations"
          }
        },
        {
          $unwind: {
            path: "$agentconfigurations",
            preserveNullAndEmptyArrays: true
          }
        }
      ]
    }
  },
  {
    $unwind: {
      path: "$CompanyDetail",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "invoicingdatas",
      localField: "_id",
      foreignField: "bookingId",
      as: "invoicingdatas"
    }
  },
  {
    $unwind: {
      path: "$invoicingdatas",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id: "$_id",
      passengerData: {
        $push: {
          $filter: {
            input: "$passengerpreference.Passengers",
            as: "passenger",
            cond: { $eq: ["$$passenger.Status", "CANCELLED"] }
          }
        }
      },
      paxEmail: { $first: "$passengerpreference.PaxEmail" },
      paxMobile: { $first: "$passengerpreference.PaxMobile" },
      cancelData: { $first: "$cancelationBookingData" },
      bookingTotalAmount: { $first: "$bookingTotalAmount" },
      PNR: { $first: "$PNR" },
      paymentMethodType: { $first: "$paymentMethodType" },
      bookingId: { $first: "$bookingId" },
      userId: { $first: "$userId" },
      companyId: { $first: "$companyId" },
      createdAt: { $first: "$createdAt" },
      agentconfigurations: { $first: "$CompanyDetail.agentconfigurations" }, // Use the correct path
      InvoicingData: { $first: "$invoicingdatas._id" },
      AirlineCode: { $first: { $ifNull: [{ $arrayElemAt: ["$itinerary.Sectors.AirlineCode", 0] }, ""] } },
      SalePurchase: { $first: { $ifNull: ["$SalePurchase", ""] } },
      farefamily: { $first: { $ifNull: ["$itinerary.FareFamily", ""] } },
      itinerary:{$first:"$itinerary"}
    }
  },
  {
    $project: {
      paxEmail: 1,
      paxMobile: 1,
      cancelData: 1,
      bookingTotalAmount: 1,
      PNR: 1,
      paymentMethodType: 1,
      bookingId: 1,
      userId: 1,
      companyId: 1,
      createdAt: 1,
      providerBookingId: 1,
      passengesDetails: { $arrayElemAt: ["$passengerData", 0] },
      agentconfigurations: 1,
      InvoicingData: 1,
      bookingId1: {
        $concat: [
          "$AirlineCode",
          "$SalePurchase",
        
          `${MODEENV}~`,
          "$farefamily"
        ]
      },
      itinerary:1
    
      }
  }
]);

// console.log(CancelBookingData[0]?.itinerary,"jdi")
// const DealAmountAndTds=await 
const getTdsAndDsicounts=await getTdsAndDsicount([CancelBookingData[0]?.itinerary])
invoiceNumber =CancelBookingData[0]?.agentconfigurations?.CreditNotesPrefix  + invoiceRandomNumber;

console.log(invoiceNumber)

  if(!CancelBookingData||CancelBookingData.length<=0){
    return ({
      response:"Data not found"
    })
  }
console.log(CancelBookingData[0]?.InvoicingData)

  // const passengerDatawiseCancel=CancelBookingData[0].passengerData.filter((refund)=>{element.Status=="null"
  //   return element
  // } )
  // console.log(passengerDatawiseCancel,'dj')

//   const totalAmount = bookingDetails.totalAmount; // Assuming total amount is stored in the booking
//   const numPassengers = bookingDetails.passengers.length;

  // Find the existing credit note or create a new one
  
  let creditNote = await creditNotes.findOne({ bookingId: providerBokingId }).populate([
    {
        path: "userId",
        populate: {
            path: 'company_ID',
            model: 'Company'
        }
    },
    { path: "companyId" },
    { path: "invoiceId" }
]);

if (!creditNote) {
    creditNote = new creditNotes({
        creditNoteNo: invoiceNumber,
        userId: CancelBookingData[0]?.userId,
        companyId: CancelBookingData[0]?.companyId,
        invoiceId: CancelBookingData[0]?.InvoicingData,
        PNR: CancelBookingData[0]?.PNR,
        bookingDate: CancelBookingData[0]?.createdAt,
        dueDate: CancelBookingData[0]?.cancelData?.updatedAt ,
        totalAmount: CancelBookingData[0]?.bookingTotalAmount,
        bookingId: providerBokingId,
        passengers: CancelBookingData[0]?.passengesDetails,
        totalCancellationCharges: CancelBookingData[0]?.cancelData?.AirlineCancellationFee,
        totalRefundAmount: CancelBookingData[0]?.cancelData?.AirlineRefund,
        totalServiceCharges: CancelBookingData[0]?.cancelData?.ServiceFee,
        status: CancelBookingData[0]?.cancelData?.calcelationStatus,
        bookingId1:CancelBookingData[0]?.bookingId1,
        commision:getTdsAndDsicounts?.ldgrdiscount
    });

    await creditNote.save();

    await creditNote.populate([
        {
            path: "userId",
            populate: {
                path: 'company_ID',
                model: 'Company'
            }
        },
        { path: "companyId" },
        { path: "invoiceId" }
    ])
}

  
  
  // Update cancellation status for the passenger
//   const cancelledPassengers = bookingDetails.passengers.filter(p => p.cancellationStatus === 'Cancelled').length;
//   const { cancellationCharges, refundAmount } = calculateRefundAndCharges(totalAmount, numPassengers, cancelledPassengers);

//   creditNote.totalCancellationCharges = cancellationCharges;
//   creditNote.totalRefundAmount = refundAmount;

//   for (const passenger of booking.passengers) {
//     if (passenger.cancellationStatus === 'Cancelled') {
//       creditNote.passengers.push(passenger);
//     }
//   }

  // Save credit note
//   await creditNotesData.save();

  return {
    response: "Fetch Data Successfully",
    data:creditNote
    // data: creditNotesData
  };
}

catch(error){
  throw error
}
};

const cancelationBooking=async(req,res)=>{
  try{
    const {userId,status,fromDate,toDate}=req.body;
if(!fromDate||!toDate){
  return({
    response:"Invalid Dates filled"
  })
}
var searchData=[]
const dateQuery = {
  createdAt: {
    $gte: new Date(fromDate + 'T00:00:00.000Z'), 
    $lte: new Date(toDate + 'T23:59:59.999Z')
  }
};
if(userId){
  searchData.push({userId:new ObjectId(userId)})
}
searchData.push(dateQuery)
// const neStatus={ calcelationStatus: { $eq: "CANCEL" } }
// const statusQuery = {
//   calcelationStatus: status
// };

if(status&&status.toUpperCase()!="ALL"){
searchData.push({
  calcelationStatus: status
})
}
// else{
//   searchData.push(neStatus)
// }

    
   
    console.log(searchData)
    
    // Perform the aggregation
    const cancelationBooking = await CancelationBooking.aggregate([
      {
        $match: {
          $and:searchData
        }
      },
      {
        $lookup:{
          from:"bookingdetails",
          localField:"bookingId",
          foreignField:"providerBookingId",
          as:"bookingdetailsData"
        }
      },
      {$unwind:{path:"$bookingdetailsData",preserveNullAndEmptyArrays:true}},
      {
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"userData"
}

      },
{$unwind:{path:"$userData",preserveNullAndEmptyArrays:true}},

{
  $lookup:{
    from:"companies",
    localField:"userData.company_ID",
    foreignField:"_id",
    as:"companyData"
  }
},
{$unwind:{path:"$companyData",preserveNullAndEmptyArrays:true}},

{
  $match: {
    "bookingdetailsData.bookingStatus": { 
      $nin: ["CONFIRMED"] 
    }
  }
},

{
  $sort:{
    createdAt:-1
  }
},


{
  $project:{
    bookingId:"$bookingdetailsData.bookingId",
    companyName:"$companyData.companyName",
    userData:{title:"$userData.title",fname:"$userData.fname",lastname:"$userData.lastName",userId:"$userData.userId"},
    calcelationStatus:1,
    providerBookingId:1,
    fare:1,
    AirlineCancellationFee:1,
    AirlineRefund:1,
    ServiceFee:1,
    PNR:1,
    createdAt:1,
    isRefund:1,
    bookingDetails:"$bookingdetailsData"


  }
}


    ]);

    if(!cancelationBooking){
      return({
        response:"Data Not found",
        })
    }  
    
    return({
      response:"Fetch Data Successfully",
      data:cancelationBooking,
      })


  }catch(error){
    throw error
  }
}
const findCancelationRefund = async (req, res) => {
  try {
    const { fromDate, toDate ,bookingIds,companyId} = req.body;
    console.log(companyId)
var apiRequestBody={}
var Url=""
var supplier
    if (
      req.headers.host == "localhost:3111" ||
      req.headers.host == "kafila.traversia.net"
    ) {
    
      supplier=await Supplier.find({$and:[{credentialsType:"TEST"},{companyId:companyId}]})
      Url = "http://stage1.ksofttechnology.com/api/Freport";
     apiRequestBody = {
        "P_TYPE": "API",
        "R_TYPE": "FLIGHT",
        "R_NAME": "FlightCancelHistory",
        "R_DATA": {
          "ACTION": "",
          "FROM_DATE": new Date(fromDate + 'T00:00:00.000Z'),
          "TO_DATE": new Date(toDate + 'T23:59:59.999Z')
        },
        "AID": supplier[0].supplierWsapSesssion,
        "MODULE": "B2B",
        "IP": "182.73.146.154",
        "TOKEN": supplier[0].supplierOfficeId,
        "ENV": "D",
        "Version": "1.0.0.0.0.0"
      };
    } else if (req.headers.host == "agentapi.kafilaholidays.in") {

      supplier=await Supplier.find({$and:[{credentialsType:"LIVE"},{companyId:companyId}]})
      Url = "http://fhapip.ksofttechnology.com/api/Freport";

      apiRequestBody = {
        "P_TYPE": "API",
        "R_TYPE": "FLIGHT",
        "R_NAME": "FlightCancelHistory",
        "R_DATA": {
          "ACTION": "",
          "FROM_DATE": new Date(fromDate + 'T00:00:00.000Z'),
          "TO_DATE": new Date(toDate + 'T23:59:59.999Z')
        },
        "AID": supplier[0].supplierWsapSesssion,
        "MODULE": "B2B",
        "IP": "182.73.146.154",
        "TOKEN": supplier[0].supplierOfficeId,
        "ENV": "P",
        "Version": "1.0.0.0.0.0"
      };
     
    } else {
      return {
        response: "url not found",
      };
    }


  
    const refundHistoryResponse = await axios.post(Url, apiRequestBody);

    const refundHistory = refundHistoryResponse.data;
    
    if(!refundHistory){
      return ({
        response:"Kafila API Data Not Found"
      })
    }


// const bookingIdsInHistory = bookingIds.map(item => item);

// const filterData = refundHistory.filter(element => bookingIdsInHistory.includes(element.BookingId));

// const matchIds=filterData.map(item=> item.BookingId)

// console.log(matchIds,"jiejiei")


const cancelationbookignsData=await CancelationBooking.find({bookingId:bookingIds})
if(!cancelationbookignsData){
  return ({
    response:"Cancellation Data Not Found"
  })
}
let refundProcessed = await RefundedCommonFunction(cancelationbookignsData,refundHistory)
  console.log(refundProcessed.response,"djei")
if(refundProcessed.response=="Not Match BookingID"||refundProcessed.response==="Cancelation Data Not Found"){
   return({
      response:refundProcessed.response
    })
  
  }else if(refundProcessed.response=="Cancelation Proceed refund"||refundProcessed.response=="Update Status Succefully"){
    return({
      response:refundProcessed.response,
      
    })
  }
  else{
    return ({
      response:"Data not Found"
    })
  }


  } catch (error) {
    console.error("Error fetching cancellation refund history:", error);
  }

}

const calculateDealAmount=async(data,type)=>{
  const commercial = data.itinerary.PriceBreakup.flatMap((element) =>{if(element.PassengerType==type){
    return    element.CommercialBreakup 
     }else {
         return {}
     }
});



const calculateDealAmount = commercial.reduce((sum, element) => {
  if (element?.CommercialType === "Discount") {
    return sum + (element?.Amount || 0); 
  }
  return sum;
}, 0);
return calculateDealAmount
}

const calculateDealAmountFull= async(data)=>{
  const commercial = data.itinerary.PriceBreakup.flatMap((element) =>{
    if(element.PassengerType=="ADT"){
       element.CommercialBreakup.map((element1)=>
       element1.Amount=element1.Amount*element?.NoOfPassenger)
       return element.CommercialBreakup
    }
    if(element.PassengerType=="CHD"){
   element.CommercialBreakup.map((element1)=>
       element1.Amount=element1.Amount*element?.NoOfPassenger)
       return element.CommercialBreakup 
    }
    if(element.PassengerType=="INF"){
   element.CommercialBreakup.map((element1)=>
       element1.Amount=element1.Amount*element?.NoOfPassenger)
       return element.CommercialBreakup 
    }
    
    
    });

// Calculate the total deal amount for items with CommercialType === "Discount"
const calculateDealAmount = commercial.reduce((sum, element) => {
  if (element?.CommercialType === "Discount") {
    return sum + (element?.Amount || 0); // Add Amount if it exists, else add 0
  }
  return sum;
}, 0); // Initialize sum to 0

return calculateDealAmount
}
const editRefundCancelation = async (req, res) => {
  try {
    const { id } = req.query;
    const { AirlineCancellationFee, AirlineRefund, ServiceFee, remarks, bookingId, RefundableAmount,cartId ,DealAmount,provider} = req.body;

    let editRefund=false;
    const findCancelationData = await CancelationBooking.findById(id);
    if (!findCancelationData) {
      return res.status(404).json({IsSucess:false, Message: "Cancellation Data not found" });
    }
    if(findCancelationData?.isRefund){
      return res.status(404).json({IsSucess:false, Message: "Allready Provide Refund" })
    }
    
    if(findCancelationData?.AirlineRefund!==AirlineRefund){
      editRefund=true
    }
    let date =  moment(findCancelationData?.createdAt).format('YYYY-MM-DD');;
    let apiRequestBody = {};
    let Url = "";
    let supplier;

    const getSupplierData = async (credentialsType, environment) => {
      return await Supplier.find({ $and: [{ credentialsType, companyId: findCancelationData?.companyId ,status:true}] });
    };

    if (req.headers.host === "localhost:3111" || req.headers.host === "kafila.traversia.net") {
      supplier = await getSupplierData("TEST", "D");
      Url = "http://stage1.ksofttechnology.com/api/Freport";
    } else if (req.headers.host === "agentapi.kafilaholidays.in") {
      supplier = await getSupplierData("LIVE", "P");
      Url = "http://fhapip.ksofttechnology.com/api/Freport";
    } else {
      return res.status(400).json({ Message: "URL not found" });
    }

    apiRequestBody = {
      "P_TYPE": "API",
      "R_TYPE": "FLIGHT",
      "R_NAME": "FlightCancelHistory",
      "R_DATA": {
        "ACTION": "",
        "FROM_DATE": new Date(date + 'T00:00:00.000Z'),
        "TO_DATE": new Date(date + 'T23:59:59.999Z')
      },
      "AID": supplier[0]?.supplierWsapSesssion,
      "MODULE": "B2B",
      "IP": "182.73.146.154",
      "TOKEN": supplier[0]?.supplierOfficeId,
      "ENV": supplier[0]?.credentialsType === "LIVE" ? "P" : "D",
      "Version": "1.0.0.0.0.0"
    };
    let findMatchCancelData=null;

    if(provider==="kafila"){

    

    const refundHistoryResponse = await axios.post(Url, apiRequestBody);
    const refundHistory = refundHistoryResponse.data;
    if (!refundHistory) {
      return res.status(404).json({IsSucess:false, Message: "Kafila API Data Not Found" });
    }

   findMatchCancelData = refundHistory.filter(element => (editRefund||element.IsRefunded) && element.BookingId === findCancelationData.bookingId&&element.TransId==findCancelationData.traceId);
    if (!findMatchCancelData || findMatchCancelData.length === 0) {
      return res.status(404).json({IsSucess:false,Message: "Refund is Pending from API" });
    }
  }
    const agentConfigData = await agentConfig.findOne({ userId: findCancelationData.userId });
    if (!agentConfigData) {
      return res.status(404).json({IsSucess:false, Message: "Agent Data Not Found" });
    }

    

 const bookingData= await BookingDetails.findOneAndUpdate({ bookingId: cartId }, { $set: { isRefund: true } });
var calculateDealAmountMinus=0

    if (findMatchCancelData&&findMatchCancelData[0].CType === "PARTIAL") {
      for (let cpassenger of findMatchCancelData[0]?.CSector[0]?.CPax || []) {
        await PassengerPreference.findOneAndUpdate(
          {
            bookingId: cartId,
            "Passengers.FName": cpassenger.FName,
            "Passengers.LName": cpassenger.lName
          },
          { $set: { "Passengers.$.Status": "CANCELLED" } }
        );
 editRefund==true&&DealAmount?calculateDealAmountMinus+=await calculateDealAmount(bookingData,cpassenger?.PType):calculateDealAmountMinus

      }
    } else {
      await PassengerPreference.updateOne(
        { bookingId: cartId },
        { $set: { "Passengers.$[].Status": "CANCELLED" } }
      );
      editRefund==true&&DealAmount?calculateDealAmountMinus= await calculateDealAmountFull(bookingData):calculateDealAmountMinus
    }
    const refundAmount=AirlineRefund-calculateDealAmountMinus
    const newBalance=agentConfigData.maxcreditLimit + Number(refundAmount)

    await agentConfig.findByIdAndUpdate(agentConfigData._id, {
      $set: { maxcreditLimit: newBalance}
    },{new:true});
    const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
    await ledger.create({
      userId: agentConfigData.userId,
      companyId: agentConfigData.companyId,
      ledgerId: ledgerId,
      cartId:cartId||bookingId,
      transactionAmount: refundAmount,
      currencyType: "INR",
      fop: "CREDIT",
      transactionType: "CREDIT",
      runningAmount: newBalance,
      remarks: `Manual ${remarks}` || "Cancellation Amount Added Into Your Account.",
      transactionBy: agentConfigData.userId
    });



    await CancelationBooking.findByIdAndUpdate(
      { _id:id},
      {
        $set: {
          fare:findCancelationData?.fare,
          AirlineCancellationFee,
          ServiceFee,
          RefundableAmt:refundAmount,
          AirlineRefund:AirlineRefund,
          isRefund: true,
          calcelationStatus: "REFUNDED"
        }
      },
      { new: true }
    );

    // Send success response
    return res.status(200).json({ IsSucess:true,Message: "Refund Process Completed Successfully" });

  } catch (error) {
    console.error("Error in processing cancellation refund:", error);
    return res.status(500).json({IsSucess:false,Message: error.Message });
  }
};


const ManualRefund = async (req, res) => {
  try {
    const { companyId, userId, refundList } = req.body;

    if (!companyId || !userId || !refundList) {
      return { response: "Please fill all required fields" };
    }

    for (let refundData of refundList) {
      const findRefund = await Users.aggregate([
        { $match: { userId: refundData.agentId } },
        {
          $lookup: {
            from: "agentconfigurations",
            localField: "_id",
            foreignField: "userId",
            as: "agentConfigurations",
          },
        },
        { $unwind: { path: "$agentConfigurations", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$_id",
            userData: { $first: "$$ROOT" },
            agentConfigData: { $first: "$agentConfigurations" },
          },
        },
      ]);

      if (findRefund.length) {
        const getUserId = findRefund.find(
          element => element.userData.userId === refundData.agentId
        );

        if (getUserId) {
          // Update the cancelation booking status
          const cancelationData = await CancelationBooking.updateMany(
            {
              $and: [
                { providerBookingId: refundData.providerbookingId },
                { calcelationStatus: { $ne: "REFUNDED" } },
              ],
            },
            {
              $set: {
                AirlineCancellationFee: refundData.AirlineCancellationFee,
                AirlineRefundData: refundData.AirlineRefundData,
                ServiceFee: refundData.ServiceFee,
                RefundableAmt: refundData.RefundableAmt,
                isRefund: true,
                calcelationStatus: "REFUNDED",
              },
            },
            { new: true }
          );

          // Update booking status in bookingDetails
          await bookingDetails.updateMany(
            { providerBookingId: refundData.providerbookingId },
            { $set: { bookingStatus: "CANCELLED" ,isRefund:true} },
            { new: true }
          );

          if (cancelationData.acknowledged && cancelationData.matchedCount > 0) {
            const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);
            
            // Create ledger entry
            await ledger.create({
              userId: getUserId.userData._id,
              companyId: companyId,
              ledgerId: ledgerId,
              cartId: null,
              transactionAmount: refundData.RefundableAmt,
              currencyType: "INR",
              fop: "CREDIT",
              transactionType: "CREDIT",
              runningAmount: findRefund[0].agentConfigData.maxcreditLimit + refundData.RefundableAmt,
              remarks: refundData.remark || "Cancellation Amount Added Into Your Account.",
              transactionBy: userId,
            });

            // Update agent configuration credit limit
            await agentConfig.findByIdAndUpdate(findRefund[0].agentConfigData._id, {
              $inc: { maxcreditLimit: refundData.RefundableAmt },
            });
          } else {
            // Check if cancellation exists for the providerBookingId before creating a new one
            const existingCancelation = await CancelationBooking.findOne({
              providerBookingId: refundData.providerbookingId,
              calcelationStatus: "REFUNDED"
            });

            if (!existingCancelation) {
              const BookingIdDetails = await bookingDetails.findOne({
                providerBookingId: refundData.providerbookingId,
              });

              // Create new cancelation record
              const cancelationBookingInstance = new CancelationBooking({
                bookingId: refundData.providerbookingId,
                providerBookingId: refundData.providerbookingId,
                AirlineCode: BookingIdDetails?.itinerary?.Sectors[0]?.AirlineCode || null,
                companyId: companyId || null,
                userId: getUserId.userData._id || null,
                PNR: BookingIdDetails?.PNR || null,
                fare: BookingIdDetails?.itinerary?.TotalPrice || null,
                AirlineCancellationFee: refundData.AirlineCancellationFee,
                AirlineRefundData: refundData.AirlineRefundData,
                ServiceFee: refundData.ServiceFee,
                RefundableAmt: refundData.RefundableAmt,
                isRefund: true,
                calcelationStatus: "REFUNDED",
                description: refundData.remark || null,
                modifyBy: getUserId.userData._id || null,
                modifyAt: new Date(),
              });

              await cancelationBookingInstance.save();
              const ledgerId = "LG" + Math.floor(100000 + Math.random() * 900000);

              // Create ledger entry
              await ledger.create({
                userId: getUserId.userData._id,
                companyId: companyId,
                ledgerId: ledgerId,
                cartId: null,
                transactionAmount: refundData.RefundableAmt,
                currencyType: "INR",
                fop: "CREDIT",
                transactionType: "CREDIT",
                runningAmount: findRefund[0].agentConfigData.maxcreditLimit + refundData.RefundableAmt,
                remarks: refundData.remark || "Cancellation Amount Added Into Your Account.",
                transactionBy: userId,
              });

              // Update agent configuration credit limit
              await agentConfig.findByIdAndUpdate(findRefund[0].agentConfigData._id, {
                $inc: { maxcreditLimit: refundData.RefundableAmt },
              });
            }
          }
        }
      }
    }

    return { response: "Refunded Successfully" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports = {flightCreditNotes,cancelationBooking,findCancelationRefund,ManualRefund,editRefundCancelation}



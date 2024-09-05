const Company = require("../../models/Company");
const Users = require("../../models/User");
const Supplier = require("../../models/Supplier");
const agentConfig = require("../../models/AgentConfig");
const bookingDetails = require("../../models/booking/BookingDetails");
const CancelationBooking = require("../../models/booking/CancelationBooking");
const creditNotes = require("../../models/CreditNotes");
const Passengerpreferences=require('../../models/booking/PassengerPreference')
const axios = require("axios");
const Logs = require("../../controllers/logs/PortalApiLogsCommon");
const uuid = require("uuid");
const NodeCache = require("node-cache");
const { Error } = require("mongoose");
const ledger = require("../../models/Ledger");
const { Config } = require("../../configs/config");
const flightCache = new NodeCache();
const {RefundedCommonFunction}=require('../../controllers/commonFunctions/common.function');
const InvoicingData = require("../../models/booking/InvoicingData");
const {ObjectId}=require("mongodb")





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
      farefamily: { $first: { $ifNull: ["$itinerary.FareFamily", ""] } }
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
      }
    
      }
  }
]);

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
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalAmount: CancelBookingData[0]?.bookingTotalAmount,
        bookingId: providerBokingId,
        passengers: CancelBookingData[0]?.passengesDetails,
        totalCancellationCharges: CancelBookingData[0]?.cancelData?.AirlineCancellationFee,
        totalRefundAmount: CancelBookingData[0]?.cancelData?.AirlineRefund,
        totalServiceCharges: CancelBookingData[0]?.cancelData?.ServiceFee,
        status: CancelBookingData[0]?.cancelData?.calcelationStatus,
        bookingId1:CancelBookingData[0]?.bookingId1
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
    const {status,fromDate,toDate}=req.body;
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
const neStatus={ calcelationStatus: { $ne: "REFUNDED" } }
const statusQuery = {
  calcelationStatus: status
};
searchData.push(dateQuery)
if(status){
searchData.push(statusQuery)
}else{
  searchData.push(neStatus)
}

    
   
    
    
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
  $sort:{
    createdAt:-1
  }
},


{
  $project:{
    bookingId:"$bookingdetailsData.bookingId",
    companyName:"$companyData.companyName",
    userData:{title:"$userData.title",fname:"$userData.fname",lastname:"$userData.lastName"},
    calcelationStatus:1,
    providerBookingId:1,
    fare:1,
    AirlineCancellationFee:1,
    AirlineRefund:1,
    ServiceFee:1,
    PNR:1,
    createdAt:1,
    isRefund:1


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

    console.log(supplier[0])
  

  
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
  
  }else if(refundProcessed.response=="Cancelation Proceed refund"){
    return({
      response:refundProcessed.response,
      
    })
  }


  } catch (error) {
    console.error("Error fetching cancellation refund history:", error);
  }

}

module.exports = {flightCreditNotes,cancelationBooking,findCancelationRefund}



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
const flightCache = new NodeCache();





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

  const {providerBokingId,bookingId} = req.body;

 if (!providerBokingId || !bookingId) {
    return {
      response: "Company or User id field are required",
    };
  }
console.log(providerBokingId)
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
      as: "passengerpreferences"
    }
  },
  {
    $unwind: {
      path: "$passengerpreferences",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $match: {
      "passengerpreferences.Passengers.Status": "CANCELLED"
    }
  },
  {
    $group: {
      _id: "$_id",
      passengerData: { $push: "$passengerpreferences.Passengers" },
      paxEmail: { $first: "$passengerpreferences.PaxEmail" },
      paxMobile: { $first: "$passengerpreferences.PaxMobile" },
      cancelData: { $first: "$cancelationBookingData" },
      bookingTotalAmount: { $first: "$bookingTotalAmount" },
      PNR: { $first: "$PNR" },
      paymentMethodType: { $first: "$paymentMethodType" },
      bookingId: { $first: "$bookingId" },
      userId: { $first: "$userId" },
      companyId: { $first: "$companyId" },
      createdAt: { $first: "$createdAt" }
    }
  },
  {
    $project: {
      passengerData: {
        $filter: {
          input: "$passengerData",
          as: "passenger",
          cond: { $eq: ["$$passenger.Status", "CANCELLED"] }
        }
      },
      paxEmail: 1,
      paxMobile: 1,
      cancelData: 1,
      bookingTotalAmount: 1,
      PNR: 1,
      paymentMethodType: 1,
      bookingId: 1,
      userId: 1,
      companyId: 1,
      createdAt: 1
    }
  },
  
]);




  if(!CancelBookingData){
    return ({
      response:"Data not found"
    })
  }


  // const passengerDatawiseCancel=CancelBookingData[0].passengerData.filter((element)=>{element.Status=="null"
  //   return element
  // } )
  // console.log(passengerDatawiseCancel,'dj')

//   const totalAmount = bookingDetails.totalAmount; // Assuming total amount is stored in the booking
//   const numPassengers = bookingDetails.passengers.length;

  // Find the existing credit note or create a new one
  console.log(CancelBookingData,"shdaa")
  // let creditNote = await creditNotes.findOne({ bookingId: providerBokingId }).exec();
  // if (!creditNote) {
  //   creditNote = new creditNotes({
  //     cNo:1,
  //     userId:CancelBookingData[0]?.userId,
  //     companyId:CancelBookingData[0]?.companyId,
  //     PNR:CancelBookingData[0]?.PNR,
  //     bookingDate: CancelBookingData[0]?.createdAt,
  //     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
  //     totalAmount:CancelBookingData[0]?.bookingTotalAmount,
  //     bookingId: providerBokingId,
  //     passengers:CancelBookingData[0]?.passengerData,
  //     totalCancellationCharges: CancelBookingData[0]?.cancelData?.AirlineCancellationFee,
  //     totalRefundAmount: CancelBookingData[0]?.cancelData?.AirlineRefund,
  //     totalServiceCharges: CancelBookingData[0]?.cancelData?.ServiceFee,
  //     status: CancelBookingData[0]?.cancelData?.calcelationStatus
  //   })
  //   creditNote=  await creditNote.save().then((savecreditNote)=>{
  //     savecreditNote.populate([{ path: "userId" }, { path: "companyId" }])

  //   })
  // }
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
    data:CancelBookingData
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
const statusQuery = {
  calcelationStatus: status
};
searchData.push(dateQuery)
if(status){
searchData.push(statusQuery)
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
    const { fromDate, toDate ,bookingIds} = req.body;

    // Prepare the API request body
    console.log(bookingIds)
    const apiRequestBody = {
      "P_TYPE": "API",
      "R_TYPE": "FLIGHT",
      "R_NAME": "FlightCancelHistory",
      "R_DATA": {
        "ACTION": "",
        "FROM_DATE": new Date(fromDate + 'T00:00:00.000Z'),
        "TO_DATE": new Date(toDate + 'T23:59:59.999Z')
      },
      "AID": "66211223",
      "MODULE": "B2B",
      "IP": "182.73.146.154",
      "TOKEN": "fd58e3d2b1e517f4ee46063ae176eee1",
      "ENV": "D",
      "Version": "1.0.0.0.0.0"
    };

  
    const refundHistoryResponse = await axios.post('http://stage1.ksofttechnology.com/api/Freport', apiRequestBody);

    const refundHistory = refundHistoryResponse.data;
   


// const bookingIdsInHistory = bookingIds.map(item => item);

// const filterData = refundHistory.filter(element => bookingIdsInHistory.includes(element.BookingId));

// const matchIds=filterData.map(item=> item.BookingId)

// console.log(matchIds,"jiejiei")

const cancelationbookignsData=await CancelationBooking.find({bookingId:bookingIds})

for(let element of refundHistory){
  for(let element1 of cancelationbookignsData){
    if(element.BookingId==element1.bookingId){
      if(element1.isRefund==false){
        
      }


    }

  }
}


    return({
      response: "Fetch Data Successfully",
      data: cancelationbookignsData,
    });

  } catch (error) {
    console.error("Error fetching cancellation refund history:", error);
  }

}

module.exports = {flightCreditNotes,cancelationBooking,findCancelationRefund}



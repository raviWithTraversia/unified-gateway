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


module.exports = {flightCreditNotes}



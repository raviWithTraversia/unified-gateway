const railBookings = require("../../../models/Irctc/bookingDetailsRail");
const {
  RailBookingCommonMethod,
} = require("../../../controllers/commonFunctions/common.function");
const User = require("../../../models/User");
const config = require("../../../models/AgentConfig");
const { ObjectId } = require("mongodb");
const { generateQR } = require("../../../utils/generate-qr");
const companies=require('../../../models/Company')
const {commonFunctionsRailLogs ,commonMethodDate,ProivdeIndiaStandardTime}=require('../../../controllers/commonFunctions/common.function')
const {checkPnrStatus} = require('../../rail/rail.controller')
const {Config}=require('../../../configs/config')
const {checkBookingWithCartId,gernateCancelCard}=require('../irctcBooking.service')

const ISOTime = async (time) => {
  const utcDate = new Date(time);
  const istDate = new Date(utcDate.getTime() - 5.5 * 60 * 60 * 1000);
  return istDate.toISOString();
};

const ISTTime = async (time) => {
  const utcDate = new Date(time);
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
  return istDate.toISOString();
};
const StartBookingRail = async (req) => {
  try {
      const {
          userId,
          companyId,
          cartId,
          amount,
          paymentmethod,
          agencyId,
          CommercialCharges,
          traceId,
          clientTransactionId,
          journeyDate,
          contactDetails,
          ticketType,
          passengerList,
          boardingStation,
          railFareBreakupRes,
          reservationMode,
          jQuota
      } = req.body;

      // Required fields validation
      const requiredFields = [
          "userId",
          "companyId",
          "cartId",
          "amount",
          "paymentmethod",
          "agencyId",
          "clientTransactionId",
      ];

      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
          return {
              response: null,
              isSomethingMissing: true,
              data: `Missing or null fields: ${missingFields.join(", ")}`,
          };
      }

      // Check if booking already exists
      // const existingBooking = await railBookings.findOne({ cartId });
      // if (existingBooking) {
      //     return {
      //         response: "Your Booking already exists",
      //     };
      // }

      // Process Rail Booking
      const RailBooking = await RailBookingCommonMethod(
          userId,
          amount,
          companyId,
          cartId,
          paymentmethod,
          railFareBreakupRes?.CommercialCharges,
          railFareBreakupRes?.enqClass
      );

      if (RailBooking.response === "Your Balance is not sufficient.") {
        commonFunctionsRailLogs(
          companyId,
          userId,
          traceId,
          "start booking",
          "startBooking",
          req.body,
          RailBooking?.response
      );
          return {
              response: "Your Balance is not sufficient.",
          };
      }

      if (RailBooking.response === "An error occurred. Please try again later.") {
        commonFunctionsRailLogs(
          companyId,
          userId,
          traceId,
          "start booking",
          "startBooking",
          req.body,
          RailBooking?.response
      );
          return {
              response: "Something went wrong",
          };
      }

      // Handle successful booking responses
      const CommonDateBooking = await commonMethodDate();

      if (
          RailBooking?.response == "Amount transferred successfully." ||
          RailBooking?.response === "Cart Created Succefully."
      ) {
 
          const newBooking = {
              cartId,
              clientTransactionId,
              companyId,
              userId,
              AgencyId: agencyId,
              paymentMethod: paymentmethod,
              trainNumber: railFareBreakupRes?.trainNo,
              journeyDate: `${railFareBreakupRes?.avlDayList[0]?.availablityDate} 00:00:00.0 IST`,
              fromStn: railFareBreakupRes?.from,
              destStn: railFareBreakupRes?.to,
              jClass: railFareBreakupRes?.enqClass,
              reservationMode,
              mobileNumber: contactDetails?.mobileNumber || null,
              emailId: contactDetails?.emailId || null,
              ticketType,
              boardingStn: boardingStation,
              jQuota,
              RailCommercial: CommercialCharges,
              psgnDtlList: passengerList,
              traceId,
              providerbookingId: CommonDateBooking?.bookingId,
              journeyClass: railFareBreakupRes?.journeyClass,
            journeyQuota: railFareBreakupRes?.jQuota,
            RailCommercial:CommercialCharges,
            trainName: railFareBreakupRes?.trainName,
            distance: railFareBreakupRes?.distance,
            boardingDate: railFareBreakupRes?.avlDayList[0]?.availablityDate+" 00:00:00.0 IST",
            reservationCharge: railFareBreakupRes?.reservationCharge,
            totalFare: railFareBreakupRes?.totalFare,
            wpServiceCharge: railFareBreakupRes?.wpServiceCharge,
            totalItemAmount:RailBooking.amount
               };

        
          // Save booking to database
          const createdBooking = await railBookings.create(newBooking);

          if (!createdBooking) {
              return {
                  response: "Failed to create booking",
              };
          }

          // Log booking process
          commonFunctionsRailLogs(
              companyId,
              userId,
              traceId,
              "start booking",
              "startBooking",
              req.body,
              RailBooking?.response
          );

          return {
              response: RailBooking?.response,
              bookingId: createdBooking._id,
          };
      }

      // Default fallback response
      return {
          response: "Unknown response from RailBookingCommonMethod",
      };

  } catch (error) {
      console.error("Error in StartBookingRail:", error);
      throw error; // Rethrow the error for higher-level handling
  }
};
//   const findRailAllBooking = async (req, res) => {
//         const {
//           userId,
//           agencyId,
//           bookingId,
//           pnr,
//           ticketNumber,
//           paxName,
//           status,
//           fromDate,
//           toDate,
//           salesInchargeIds,
//           BookedBy,
//           Authentication,
//           page,
//           limit
//         } = req.body;
//         const fieldNames = [
//           "agencyId",
//           "bookingId",
//           "pnr",
//           "status",
//           "fromDate",
//           "toDate",
//           "salesInchargeIds",
//         ];
//         const missingFields = fieldNames.filter(
//           (fieldName) =>
//             req.body[fieldName] === null || req.body[fieldName] === undefined
//         );
      
//         if (missingFields.length > 0) {
//           const missingFieldsString = missingFields.join(", ");
      
//           return {
//             response: null,
//             isSometingMissing: true,
//             data: `Missing or null fields: ${missingFieldsString}`,
//           };
//         }

//         const pages = parseInt(page) || 1;
//        const limits = parseInt(limit) || 20;
//     const skip = (pages - 1) * limits;
//       if(bookingId){
//         const bookingDataCartId=await railBookings.findOne({cartId:bookingId});
//         const latesPassengerData=await checkPnrStatus(Authentication,bookingDataCartId?.pnrNumber)
//         if (typeof latesPassengerData !== "string") {
//           await railBookings.findByIdAndUpdate(bookingDataCartId._id,  [
//             {
//               $set: {
//                 psgnDtlList: {
//                   $map: {
//                     input: { $range: [0, { $size: "$psgnDtlList" }] }, // Create a range of indices
//                     as: "index",
//                     in: {
//                       $mergeObjects: [
//                         { $arrayElemAt: ["$psgnDtlList", "$$index"] }, // Keep existing passenger data
//                         {
//                           currentStatus: {
//                             $arrayElemAt: [latesPassengerData.map(item => item.currentStatus), "$$index"]
//                           },
//                           // currentCoachId: {
//                           //   $arrayElemAt: [latesPassengerData.map(item => item.bookingCoachId), "$$index"]
//                           // },
//                           // currentBerthCode: {
//                           //   $arrayElemAt: [latesPassengerData.map(item => item.bookingBerthCode), "$$index"]
//                           // },
//                           currentBerthNo: {
//                             $arrayElemAt: [latesPassengerData.map(item => item.currentBerthNo=="0"?item.bookingBerthNo:item.currentBerthNo), "$$index"]
//                           }
//                         },
//                       ],
//                     },
//                   },
//                 }
//               },
//             },
//           ],{new:true})
//         }
//    await railBookings.findOneAndUpdate({_id:bookingDataCartId._id,"psgnDtlList.currentStatus":{$nin:["WL","CNF","RLWL","PQWL","RAC","2S","2A","3A","3E","CC","EC","SL","1A","FC","EV","TQWL" ]}},{$set:{bookingStatus:"CANCELLED"}},{new:true})
 

//       }
//         const checkUserIdExist = await User.findById(userId)
//           .populate("roleId")
//           .populate("company_ID");
      
//     const commonDateItc=await ProivdeIndiaStandardTime(fromDate,toDate);
    

//         if (
//           (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") ||
//           (checkUserIdExist.roleId && checkUserIdExist.roleId.type == "Manual")
//         ) {
//           const filter = {};
      
      
//           if (
//             agencyId == "6555f84c991eaa63cb171a9f" &&
//             checkUserIdExist.roleId &&
//             checkUserIdExist.roleId.type == "Manual"
//           ) {
//             filter.companyId = new ObjectId(agencyId);
//           } else if (agencyId !== undefined && agencyId !== "") {
//             filter.AgencyId = new ObjectId(agencyId);
//           } else {
//             checkUserIdExist.roleId.type == "Manual" &&
//             checkUserIdExist.company_ID?.type == "TMC"
//               ? (filter.companyId = checkUserIdExist.company_ID._id)
//               : (filter.AgencyId = new ObjectId(checkUserIdExist?.company_ID?._id));
//           }
      
//       if (bookingId !== undefined && bookingId.trim() !== "") {
//         filter.clientTransactionId = bookingId;
//       }
      
//       if (pnr !== undefined && pnr.trim() !== "") {
//         filter.pnrNumber = pnr;
//       }
      
//       if (status !== undefined && status.trim() !== "") {
//         filter.bookingStatus = status;
//       }
      
//       if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
//         filter.bookingDate = {
//           $gte: commonDateItc.startDateUTC, // Start of fromDate
//           $lte: commonDateItc.endDateUTC, // End of toDate
//         };
//       } else if (fromDate !== undefined && fromDate.trim() !== "") {
//         filter.bookingDate = {
//           $lte: commonDateItc.endDateUTC, // End of fromDate
//         };
//       } else if (toDate !== undefined && toDate.trim() !== "") {
//         filter.bookingDate = {
//           $gte: commonDateItc.startDateUTC, // Start of toDate
//         };
//       }
//       console.log(filter)
//      const railBooking = await railBookings.aggregate([
//   { $match: filter },

//   // 🔽 Apply sorting & pagination here
//   { $sort: { created: -1 } },
//   { $skip: skip },
//   { $limit: limit },

//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "_id",
//       as: "userId",
//       pipeline: [
//         {
//           $lookup: {
//             from: "companies",
//             localField: "company_ID",
//             foreignField: "_id",
//             as: "company_ID",
//           },
//         },
//         { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } },
//       ],
//     },
//   },
//   { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "users",
//       localField: "BookedBy",
//       foreignField: "_id",
//       as: "BookedBy",
//     },
//   },
//   { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "invoicingdatas",
//       localField: "_id",
//       foreignField: "bookingId",
//       as: "invoicingdatas",
//     },
//   },
//   { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },

//   {
//     $addFields: {
//       companyIdForLookup: "$userId.company_ID._id"
//     }
//   },
//   {
//     $lookup: {
//       from: "agentconfigurations",
//       localField: "companyIdForLookup",
//       foreignField: "companyId",
//       as: "agentconfigurationData"
//     },
//   },
//   { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "companies",
//       localField: "companyId",
//       foreignField: "_id",
//       as: "companyId"
//     }
//   },
//   { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

//   {
//     $addFields: {
//       salesId: "$agentconfigurationData.salesInchargeIds"
//     }
//   },

//   {
//     $group: {
//       _id: "$_id",
//       railBooking: { $first: "$$ROOT" },
//       userId: { $first: "$userId" },
//       BookedBy: { $first: "$BookedBy" },
//       invoicingdatas: { $first: "$invoicingdatas" },
//       companyId: { $first: "$companyId" },
//       agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
//     },
//   },
//   {
//     $replaceRoot: { newRoot: "$railBooking" },
//   },
// ]);

      
      
//       if(filter.clientTransactionId!==""){
//       await railBookings.findOneAndUpdate({clientTransactionId:filter.clientTransactionId},{$set:{isEmailSend:false}})
      
//       }
//           console.log("1st");
//           if (!railBooking || railBooking.length === 0) {
//             return {
//               response: "Data Not Found",
//             };
//           }
//            else {
//             // const statusCounts = {
//             //   PENDING: 0,
//             //   CONFIRMED: 0,
//             //   FAILED: 0,
//             //   CANCELLED: 0,
//             //   INCOMPLETE: 0,
//             //   HOLD: 0,
//             //   HOLDRELEASED: 0,
//             //   "FAILED PAYMENT": 0,
//             // };
      
      
//             // railBooking.forEach((booking) => {
        
       

//             //     const status = booking.bookingStatus;
//             //     // Increment the count corresponding to the status
//             //     statusCounts[status]++;
//             //   });
               
      
        
//             let filteredBookingData = railBooking; 
      
         
//             return {
//               response: "Fetch Data Successfully",
//               data: {
//                 bookingList: filteredBookingData.sort(
//                   (a, b) =>
//                     new Date(
//                       b.bookingDate -
//                         new Date(a.bookingDate)
//                     )
//                 ),
//                 statusCounts: statusCounts,
//               },
//             };
//           }
//         } else if (
//           checkUserIdExist.roleId &&
//           checkUserIdExist.roleId.name === "Distributer"
//         ) {
//           let filter = {};

//     // console.log("dhieieei")
//     if (agencyId !== undefined && agencyId == "") {
//       // filter.userId={}

//       if (checkUserIdExist?.roleId?.type === "Default") {
//         // Fetch all companies that have the current user's company ID as the parent
//         const companiesData = await companies.find({
//           parent: checkUserIdExist.company_ID._id,
//         });

//         // console.log(companiesData,"companiesData")
//         // Extract and map company IDs into an array of ObjectIds
//         const companyIds = companiesData.map(
//           (element) => new ObjectId(element._id)
//         );

//         // Assign the array of ObjectIds to filter.AgencyId
//         filter.AgencyId = { $in: companyIds };
//       } else {
//         // Assign the specific agencyId as a single ObjectId
//         filter.AgencyId = new ObjectId(agencyId);
//       } // let allagencyId = agencyId.map(id => new ObjectId(id));
//       // filter.AgencyId={$in:allagencyId}

//       // console.log(filter.AgencyId)
//     }
//           if (bookingId !== undefined && bookingId.trim() !== "") {
//             filter.clientTransactionId = bookingId;
//           }
//           if (pnr !== undefined && pnr.trim() !== "") {
//             filter.pnrNumber = pnr;
//           }
//           if (status !== undefined && status.trim() !== "") {
//             filter.bookingStatus = status;
//           }
//           if (
//             fromDate !== undefined &&
//             fromDate.trim() !== "" &&
//             toDate !== undefined &&
//             toDate.trim() !== ""
//           ) {
//             filter.bookingDate = {
//               $gte: commonDateItc.startDateUTC, // Start of fromDate
//               $lte: commonDateItc.endDateUTC, // End of toDate
//             };
//           } else if (fromDate !== undefined && fromDate.trim() !== "") {
//             filter.bookingDate = {
//               $lte: commonDateItc.endDateUTC, // End of fromDate
//             };
//           } else if (toDate !== undefined && toDate.trim() !== "") {
//             filter.bookingDate = {
//               $gte: commonDateItc.startDateUTC, // Start of toDate
//             };
//           }
//           console.log(filter,"filter")
      
//          const railBooking = await railBookings.aggregate([
//   { $match: filter },

//   // 🔽 Apply sorting & pagination here
//   { $sort: { created: -1 } },
//   { $skip: skip },
//   { $limit: limits },

//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "_id",
//       as: "userId",
//       pipeline: [
//         {
//           $lookup: {
//             from: "companies",
//             localField: "company_ID",
//             foreignField: "_id",
//             as: "company_ID",
//           },
//         },
//         { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } },
//       ],
//     },
//   },
//   { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "users",
//       localField: "BookedBy",
//       foreignField: "_id",
//       as: "BookedBy",
//     },
//   },
//   { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "invoicingdatas",
//       localField: "_id",
//       foreignField: "bookingId",
//       as: "invoicingdatas",
//     },
//   },
//   { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },

//   {
//     $addFields: {
//       companyIdForLookup: "$userId.company_ID._id"
//     }
//   },
//   {
//     $lookup: {
//       from: "agentconfigurations",
//       localField: "companyIdForLookup",
//       foreignField: "companyId",
//       as: "agentconfigurationData"
//     },
//   },
//   { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "companies",
//       localField: "companyId",
//       foreignField: "_id",
//       as: "companyId"
//     }
//   },
//   { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

//   {
//     $addFields: {
//       salesId: "$agentconfigurationData.salesInchargeIds"
//     }
//   },

//   {
//     $group: {
//       _id: "$_id",
//       railBooking: { $first: "$$ROOT" },
//       userId: { $first: "$userId" },
//       BookedBy: { $first: "$BookedBy" },
//       invoicingdatas: { $first: "$invoicingdatas" },
//       companyId: { $first: "$companyId" },
//       agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
//     },
//   },
//   {
//     $replaceRoot: { newRoot: "$railBooking" },
//   },
// ]);
         
//           if(filter.clientTransactionId!==""){
//             await railBookings.findOneAndUpdate({clientTransactionId:filter.clientTransactionId},{$set:{isEmailSend:false}})
            
//             }
      
//           console.log("2nd");
      
//           if (!railBooking || railBooking.length === 0) {
//             return {
//               response: "Data Not Found",
//             };
//           } else {
//           //   const statusCounts = {
//           //     PENDING: 0,
//           //     CONFIRMED: 0,
//           //     FAILED: 0,
//           //     CANCELLED: 0,
//           //     INCOMPLETE: 0,
//           //     HOLD: 0,
//           //     HOLDRELEASED: 0,
//           //     "FAILED PAYMENT": 0,
//           //   };
      
//           //   railBooking.forEach((booking) => {
        
       

//           //       const status = booking.bookingStatus;
//           //       // Increment the count corresponding to the status
//           //       statusCounts[status]++;
//           //     });
           
//             // Iterate over the railBooking array
      
//             // Iterate over the railBooking array
           
//             let filteredBookingData = railBooking; // Copy the original data
      
           
//             return {
//               response: "Fetch Data Successfully",
//               data: {
//                 bookingList: filteredBookingData.sort(
//                   (a, b) =>
//                     new Date(b.bookingDate) -
//                     new Date(a.bookingDate)
//                 ),
//                 statusCounts: statusCounts,
//               },
//             };
//           }
//           //|| checkUserIdExist?.company_ID?.type === "TMC"
//         } else if (
//           (checkUserIdExist.roleId &&
//             checkUserIdExist.roleId.name === "TMC" &&
//             checkUserIdExist?.roleId?.type == "Default") ||
//           (checkUserIdExist?.roleId?.type == "Manual" &&
//             checkUserIdExist?.company_ID == new ObjectId("6555f84c991eaa63cb171a9f"))
//         ) {
//           let filter = {};
//           if (agencyId !== undefined && agencyId !== ""&&agencyId != new ObjectId("6555f84c991eaa63cb171a9f")) {
//             // filter.userId={}
//             checkUserIdExist?.roleId?.type == "Manual"?filter.companyId = new ObjectId(agencyId):filter.userId=new ObjectId(agencyId);
//             // let allagencyId = agencyId.map(id => new ObjectId(id));
//             // filter.AgencyId={$in:allagencyId}
      
//             // console.log(filter.AgencyId)
//           }
//           else if(agencyId !== undefined &&agencyId !== "" ){
//             filter.companyId = new ObjectId(agencyId)
//           }
      
//           if (bookingId !== undefined && bookingId.trim() !== "") {
//             filter.clientTransactionId = bookingId;
//           }
//           if (pnr !== undefined && pnr.trim() !== "") {
//             filter.pnrNumber = pnr;
//           }
//           if (status !== undefined && status.trim() !== "") {
//             filter.bookingStatus = status;
//           }
//           if (
//             fromDate !== undefined &&
//             fromDate.trim() !== "" &&
//             toDate !== undefined &&
//             toDate.trim() !== ""
//           ) {
//             filter.bookingDate = {
//               $gte: commonDateItc.startDateUTC, // Start of fromDate
//               $lte: commonDateItc.endDateUTC, // End of toDate
//             };
//           } else if (fromDate !== undefined && fromDate.trim() !== "") {
//             filter.bookingDate = {
//               $lte: commonDateItc.endDateUTC, // End of fromDate
//             };
//           } else if (toDate !== undefined && toDate.trim() !== "") {
//             filter.bookingDate = {
//               $gte: commonDateItc.startDateUTC, // Start of toDate
//             };
//           }
          
//             const railBooking = await railBookings.aggregate([
//   { $match: filter },

//   // 🔽 Apply sorting & pagination here
//   { $sort: { created: -1 } },
//   { $skip: skip },
//   { $limit: limits },

//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "_id",
//       as: "userId",
//       pipeline: [
//         {
//           $lookup: {
//             from: "companies",
//             localField: "company_ID",
//             foreignField: "_id",
//             as: "company_ID",
//           },
//         },
//         { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } },
//       ],
//     },
//   },
//   { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "users",
//       localField: "BookedBy",
//       foreignField: "_id",
//       as: "BookedBy",
//     },
//   },
//   { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "invoicingdatas",
//       localField: "_id",
//       foreignField: "bookingId",
//       as: "invoicingdatas",
//     },
//   },
//   { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },

//   {
//     $addFields: {
//       companyIdForLookup: "$userId.company_ID._id"
//     }
//   },
//   {
//     $lookup: {
//       from: "agentconfigurations",
//       localField: "companyIdForLookup",
//       foreignField: "companyId",
//       as: "agentconfigurationData"
//     },
//   },
//   { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "companies",
//       localField: "companyId",
//       foreignField: "_id",
//       as: "companyId"
//     }
//   },
//   { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

//   {
//     $addFields: {
//       salesId: "$agentconfigurationData.salesInchargeIds"
//     }
//   },

//   {
//     $group: {
//       _id: "$_id",
//       railBooking: { $first: "$$ROOT" },
//       userId: { $first: "$userId" },
//       BookedBy: { $first: "$BookedBy" },
//       invoicingdatas: { $first: "$invoicingdatas" },
//       companyId: { $first: "$companyId" },
//       agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
//     },
//   },
//   {
//     $replaceRoot: { newRoot: "$railBooking" },
//   },
// ]);
// ;
           
//           if(filter.clientTransactionId!==""){
//           await railBookings.findOneAndUpdate({clientTransactionId:filter.clientTransactionId},{$set:{isEmailSend:false}})
//           }

//             // .find(filter)
//             // .populate({
//             //   path: "userId",
//             //   populate: {
//             //     path: "company_ID",
//             //   },
//             // })
//             // .populate("BookedBy");
//           console.log("3rd");
//           if (!railBooking || railBooking.length === 0) {
//             return {
//               response: "Data Not Found",
//             };
//           } else {
//       //       const statusCounts = {
//       //         PENDING: 0,
//       //         CONFIRMED: 0,
//       //         FAILED: 0,
//       //         CANCELLED: 0,
//       //         INCOMPLETE: 0,
//       //         HOLD: 0,
//       //         HOLDRELEASED: 0,
//       //         "FAILED PAYMENT": 0,
//       //       };
      
//       //       // Iterate over the railBooking array

//       // railBooking.forEach((booking) => {
//       //   const status = booking.bookingStatus;
//       //   // Increment the count corresponding to the status
//       //   statusCounts[status]++;
//       // });

//       let filteredBookingData = railBooking; // Copy the original data

//       return {
//         response: "Fetch Data Successfully",
//         data: {
//           bookingList: filteredBookingData.sort(
//             (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
//           ),
//           statusCounts: statusCounts,
//         },
//       };
//     }
//   } else {
//     const userCompanyId = checkUserIdExist.company_ID;
//     const checkComapnyUser = await User.findOne({
//       company_ID: userCompanyId,
//     }).populate({
//       path: "roleId",
//       match: { type: "Default" },
//     });
//     if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Agency") {
//       let filter = { userId: checkComapnyUser._id };
//       if (agencyId !== undefined && agencyId !== "") {
//         ilter.userId = {};
//         filter.userId = { $in: agencyId };
//       }

//       if (bookingId !== undefined && bookingId.trim() !== "") {
//         filter.clientTransactionId = bookingId;
//       }
//       if (pnr !== undefined && pnr.trim() !== "") {
//         filter.pnrNumber = pnr;
//       }
//       if (status !== undefined && status.trim() !== "") {
//         filter.bookingStatus = status;
//       }

//       if (
//         fromDate !== undefined &&
//         fromDate.trim() !== "" &&
//         toDate !== undefined &&
//         toDate.trim() !== ""
//       ) {
//         filter.bookingDate = {
//           $gte: commonDateItc.startDateUTC, // Start of fromDate
//           $lte: commonDateItc.endDateUTC, // End of toDate
//         };
//       } else if (fromDate !== undefined && fromDate.trim() !== "") {
//         filter.bookingDate = {
//           $lte:commonDateItc.endDateUTC, // End of fromDate
//         };
//       } else if (toDate !== undefined && toDate.trim() !== "") {
//         filter.bookingDate = {
//           $gte: commonDateItc.startDateUTC, // Start of toDate
//         };
//       }

//       // const railBooking = await railBooking
//       //   .find(filter)
//       //   .populate({
//       //     path: "userId",
//       //     populate: {
//       //       path: "company_ID",
//       //     },
//       //   })
//       //   .populate("BookedBy");

//       if (!railBooking || railBooking.length === 0) {
//         return {
//           response: "Data Not Found",
//         };
//       } else {
//         const statusCounts = {
//           PENDING: 0,
//           CONFIRMED: 0,
//           FAILED: 0,
//           CANCELLED: 0,
//           INCOMPLETE: 0,
//           HOLD: 0,
//           HOLDRELEASED: 0,
//           "FAILED PAYMENT": 0,
//         };

//         // Iterate over the railBooking array

//         let filteredBookingData = railBooking; // Copy the original data

//         if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
//           filteredBookingData = allBookingData.filter(
//             (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
//           );
//         }
//         return {
//           response: "Fetch Data Successfully",
//           data: {
//             bookingList: filteredBookingData.sort(
//               (a, b) => new Date(b.bookingDate - new Date(a.bookingDate))
//             ),
//             statusCounts: statusCounts,
//           },
//         };
//       }
//     } else if (
//       checkComapnyUser.roleId &&
//       checkComapnyUser.roleId.name === "Distributer"
//     ) {
//       let filter = { companyId: checkComapnyUser.company_ID._id };
//       if (agencyId !== undefined && agencyId !== "") {
//         ilter.userId = {};
//         filter.userId = { $in: agencyId };
//       }

//       if (bookingId !== undefined && bookingId.trim() !== "") {
//         filter.bookingId = bookingId;
//       }
//       if (pnr !== undefined && pnr.trim() !== "") {
//         filter.PNR = pnr;
//       }
//       if (status !== undefined && status.trim() !== "") {
//         filter.bookingStatus = status;
//       }
//       if (
//         fromDate !== undefined &&
//         fromDate.trim() !== "" &&
//         toDate !== undefined &&
//         toDate.trim() !== ""
//       ) {
//         filter.bookingDate = {
//           $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
//           $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
//         };
//       } else if (fromDate !== undefined && fromDate.trim() !== "") {
//         filter.bookingDate = {
//           $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
//         };
//       } else if (toDate !== undefined && toDate.trim() !== "") {
//         filter.bookingDate = {
//           $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
//         };
//       }

//       const railBooking = await railBooking
//         .find(filter)
//         .populate({
//           path: "userId",
//           populate: {
//             path: "company_ID",
//           },
//         })
//         .populate("BookedBy");

//       if (!railBooking || railBooking.length === 0) {
//         return {
//           response: "Data Not Found",
//         };
//       } else {
//         const statusCounts = {
//           PENDING: 0,
//           CONFIRMED: 0,
//           FAILED: 0,
//           CANCELLED: 0,
//           INCOMPLETE: 0,
//           HOLD: 0,
//           HOLDRELEASED: 0,
//           "FAILED PAYMENT": 0,
//         };

//         // Iterate over the railBooking array
//         railBooking.forEach((booking) => {
//           const status = booking.bookingStatus;
//           // Increment the count corresponding to the status
//           statusCounts[status]++;
//         });
//         const allBookingData = [];

//         await Promise.all(
//           railBooking.map(async (booking) => {
//             let filter2 = { bookingId: booking.bookingId };
//             if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
//               filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
//             }
//             const passengerPreference = await passengerPreferenceSchema.find(
//               filter2
//             );
//             const configDetails = await config.findOne({
//               userId: booking.userId,
//             });
//             if (passengerPreference.length) {
//               allBookingData.push({
//                 railBooking: booking,
//                 passengerPreference: passengerPreference,
//                 salesInchargeIds: configDetails?.salesInchargeIds,
//               });
//             }
//           })
//         );
//         let filteredBookingData = allBookingData; // Copy the original data

//         if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
//           filteredBookingData = allBookingData.filter(
//             (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
//           );
//         }
//         return {
//           response: "Fetch Data Successfully",
//           data: {
//             bookingList: filteredBookingData.sort(
//               (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
//             ),
//             statusCounts: statusCounts,
//           },
//         };
//       }
//     } else if (
//       (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC") ||
//       checkComapnyUser?.company_ID?.type === "TMC"
//     ) {
//       let filter = {};
//       if (agencyId !== undefined && agencyId !== "") {
//         ilter.userId = {};
//         filter.userId = { $in: agencyId };
//       }

//       if (bookingId !== undefined && bookingId.trim() !== "") {
//         filter.bookingId = bookingId;
//       }
//       if (pnr !== undefined && pnr.trim() !== "") {
//         filter.PNR = pnr;
//       }
//       if (status !== undefined && status.trim() !== "") {
//         filter.bookingStatus = status;
//       }
//       if (
//         fromDate !== undefined &&
//         fromDate.trim() !== "" &&
//         toDate !== undefined &&
//         toDate.trim() !== ""
//       ) {
//         filter.bookingDate = {
//           $gte: commonDateItc.startDateUTC ,// Start of fromDate
//           $lte: commonDateItc.endDateUTC, // End of toDate
//         };
//       } else if (fromDate !== undefined && fromDate.trim() !== "") {
//         filter.bookingDate = {
//           $lte: commonDateItc.endDateUTC, // End of fromDate
//         };
//       } else if (toDate !== undefined && toDate.trim() !== "") {
//         filter.bookingDate = {
//           $gte: commonDateItc.startDateUTC, // Start of toDate
//         };
//       }

//       const railBooking = await railBooking
//         .find(filter)
//         .populate({
//           path: "userId",
//           populate: {
//             path: "company_ID",
//           },
//         })
//         .populate("BookedBy");

//       if (!railBooking || railBooking.length === 0) {
//         return {
//           response: "Data Not Found",
//         };
//       } else {
//         const statusCounts = {
//           PENDING: 0,
//           CONFIRMED: 0,
//           FAILED: 0,
//           CANCELLED: 0,
//           INCOMPLETE: 0,
//           HOLD: 0,
//           HOLDRELEASED: 0,
//           "FAILED PAYMENT": 0,
//         };

//         // Iterate over the railBooking array

//         let filteredBookingData = railBooking; // Copy the original data

//         if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
//           filteredBookingData = allBookingData.filter(
//             (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
//           );
//         }

//         return {
//           response: "Fetch Data Successfully",
//           data: {
//             bookingList: filteredBookingData.sort(
//               (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
//             ),
//             statusCounts: statusCounts,
//           },
//         };
//       }
//     }
//   }
// };


const findRailAllBooking = async (req, res) => {
    const {
        userId,
        agencyId,
        bookingId,
        pnr,
        status,
        fromDate,
        toDate,
        Authentication,
        page = 1,
        limit = 20
    } = req.body;

    // 1. Validate required fields
    const requiredFields = [
        "agencyId", "bookingId", "pnr", "status", 
        "fromDate", "toDate", "salesInchargeIds"
    ];
    const missingFields = requiredFields.filter(field => 
        req.body[field] === null || req.body[field] === undefined
    );

    if (missingFields.length > 0) {
        return {
            response: null,
            isSometingMissing: true,
            data: `Missing or null fields: ${missingFields.join(", ")}`
        };
    }

    // 2. Pagination setup
    const pages = parseInt(page);
    const limits = parseInt(limit);
    const skip = (pages - 1) * limits;

    // 3. Handle bookingId updates
    if (bookingId) {
        await updateBookingStatus(bookingId, Authentication);
    }

    // 4. Get user context
    const user = await getUserContext(userId);
    if (!user) return { response: "User not found" };

    // 5. Date conversion
     let commonDateItc=null
    if(fromDate && toDate){
 commonDateItc = await ProivdeIndiaStandardTime(fromDate, toDate)
    };

    // 6. Build query filter based on user role
    const filter = await buildFilter({
        user,
        agencyId,
        bookingId,
        pnr,
        status,
        fromDate,
        toDate,
        commonDateItc
    });

    // 7. Fetch bookings with aggregation
    const railBooking = await fetchBookings(filter, skip, limits);

    // 8. Update email flag if needed
    if (filter.clientTransactionId) {
        await railBookings.findOneAndUpdate(
            { clientTransactionId: filter.clientTransactionId },
            { $set: { isEmailSend: false } }
        );
    }

    if (!railBooking.length) {
        return { response: "Data Not Found" };
    }
    
      const statusCounts = {
               PENDING: 0,
     CONFIRMED: 0,
      FAILED: 0,
       CANCELLED: 0,
   INCOMPLETE: 0,
      HOLD: 0,
       HOLDRELEASED: 0,
      "FAILED PAYMENT": 0,
     };
      
      
    railBooking.forEach((booking) => {
        
       

        const status = booking.bookingStatus;
    // Increment the count corresponding to the status
        statusCounts[status]++;
  });
    


    return {
        response: "Fetch Data Successfully",
        data: {
            bookingList: railBooking.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            ),
            statusCounts: statusCounts,
        }
    };
};

// Helper functions
async function updateBookingStatus(bookingId, Authentication) {
    const bookingData = await railBookings.findOne({ cartId: bookingId });
    if (!bookingData) return;
    // let updateStatusAPI=null
    if(!bookingData?.pnrNumber){
return await checkBookingWithCartId(bookingId,bookingData.traceId,Authentication)
    }

    const latesPassengerData = await checkPnrStatus(Authentication, bookingData.pnrNumber);
    // if (typeof latesPassengerData === "string") return;

    // const updateData = {
    //     "psgnDtlList.$[elem].currentStatus": latesPassengerData.map(p => p.currentStatus),
    //     "psgnDtlList.$[elem].currentBerthNo": latesPassengerData.map(p => 
    //         p.currentBerthNo === "0" ? p.bookingBerthNo : p.currentBerthNo
    //     )
    // };

    // await railBookings.findByIdAndUpdate(
    //     bookingData._id,
    //     { $set: updateData },
    //     { arrayFilters: [{ "elem.index": { $exists: true } }], new: true }
    // );

 const cancelBookingData=   await railBookings.findOneAndUpdate(
        { 
            _id: bookingData._id,
            "psgnDtlList.currentStatus": { 
                $nin: ["WL","CNF","RLWL","PQWL","RAC","2S","2A","3A","3E","CC","EC","SL","1A","FC","EV","TQWL"] 
            },
            bookingStatus: { $ne: "CANCELLED" }
        },
        { $set: { bookingStatus: "CANCELLED PROCESS" } },
        { new: true }
    );
    if(cancelBookingData && cancelBookingData?.bookingStatus!=="CANCELLED"){
        return await gernateCancelCard(Authentication,cancelBookingData,cancelBookingData?.traceId);
    }
}

async function getUserContext(userId) {
    return User.findById(userId)
        .populate("roleId")
        .populate("company_ID");
}

async function buildFilter(params) {
    const { user, agencyId, bookingId, pnr, status, commonDateItc } = params;
    const filter = {};
    const role = user.roleId?.name;
    const roleType = user.roleId?.type;
    const companyType = user.company_ID?.type;

    // Agency/Manual user filter
    if (role === "Agency" || roleType === "Manual") {
        if (agencyId === "6555f84c991eaa63cb171a9f" && roleType === "Manual") {
            filter.companyId = new ObjectId(agencyId);
        } else if (agencyId) {
            filter.AgencyId = new ObjectId(agencyId);
        } else {
            roleType === "Manual" && companyType === "TMC"
                ? filter.companyId = user.company_ID._id
                : filter.AgencyId = user.company_ID?._id;
        }
    }
    // Distributor user filter
    else if (role === "Distributer") {
        if (agencyId) {
            if (roleType === "Default") {
                const companiesData = await companies.find({
                    parent: user.company_ID._id
                });
                filter.AgencyId = { 
                    $in: companiesData.map(c => new ObjectId(c._id)) 
                };
            } else {
                filter.AgencyId = new ObjectId(agencyId);
            }
        }
    }
    // TMC user filter
    else if (role === "TMC" && (roleType === "Default" || 
            (roleType === "Manual" && user.company_ID.equals("6555f84c991eaa63cb171a9f")))) {
        if (agencyId && agencyId !== "6555f84c991eaa63cb171a9f") {
            roleType === "Manual" 
                ? filter.companyId = new ObjectId(agencyId)
                : filter.userId = new ObjectId(agencyId);
        } else if (agencyId) {
            filter.companyId = new ObjectId(agencyId);
        }
    }

    // Common filter parameters
    if (bookingId) filter.clientTransactionId = bookingId;
    if (pnr) filter.pnrNumber = pnr;
    if (status) filter.bookingStatus = status;

    // Date filtering
    if (commonDateItc) {
        if (commonDateItc.startDateUTC && commonDateItc.endDateUTC) {
            filter.createdAt = {
                $gte: commonDateItc.startDateUTC,
                $lte: commonDateItc.endDateUTC
            };
        } else if (commonDateItc.endDateUTC) {
            filter.createdAt = { $lte: commonDateItc.endDateUTC };
        } else if (commonDateItc.startDateUTC) {
            filter.createdAt = { $gte: commonDateItc.startDateUTC };
        }
    }

    return filter;
}

async function fetchBookings(filter, skip, limit) {
    return railBookings.aggregate([
        { $match: filter },
        { $sort: { created: -1 } },
        // { $skip: skip },
        // { $limit: limit },
        ...getCommonLookupStages()
    ]);
}

function getCommonLookupStages() {
    return [
        // User lookup with company population
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
                pipeline: [{
                    $lookup: {
                        from: "companies",
                        localField: "company_ID",
                        foreignField: "_id",
                        as: "company_ID"
                    }
                },
                { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } }]
            }
        },
        { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
        
        // BookedBy lookup
        {
            $lookup: {
                from: "users",
                localField: "BookedBy",
                foreignField: "_id",
                as: "BookedBy"
            }
        },
        { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },
        
        // Invoicing data lookup
        {
            $lookup: {
                from: "invoicingdatas",
                localField: "_id",
                foreignField: "bookingId",
                as: "invoicingdatas"
            }
        },
        { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },
        
        // Agent configuration lookup
        {
            $addFields: { companyIdForLookup: "$userId.company_ID._id" }
        },
        {
            $lookup: {
                from: "agentconfigurations",
                localField: "companyIdForLookup",
                foreignField: "companyId",
                as: "agentconfigurationData"
            }
        },
        { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },
        
        // Company lookup
        {
            $lookup: {
                from: "companies",
                localField: "companyId",
                foreignField: "_id",
                as: "companyId"
            }
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
        
        // Grouping and restructuring
        {
            $group: {
                _id: "$_id",
                railBooking: { $first: "$$ROOT" },
                userId: { $first: "$userId" },
                BookedBy: { $first: "$BookedBy" },
                invoicingdatas: { $first: "$invoicingdatas" },
                companyId: { $first: "$companyId" },
                agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
            }
        },
        { $replaceRoot: { newRoot: "$railBooking" } }
    ]
}
const getProvideStatusCount = async (req, res) => {
  try {
    let { companyId, toDate, fromDate } = req.body;
    const commonDateItc = await ProivdeIndiaStandardTime(fromDate, toDate)

    const bookingDetailsQuery = {
      createdAt: {
        $gte: commonDateItc.startDateUTC,
        $lte: commonDateItc.endDateUTC
      },
      ...(Config?.TMCID !== companyId
        ? { AgencyId:new ObjectId(companyId) }
        : { companyId: new ObjectId(companyId) })
    };

    // Build query filter
    

    // Use aggregation to count booking statuses directly in DB
    const bookingStatusCounts = await railBookings.aggregate([
  { $match: bookingDetailsQuery },
  {
    $group: {
      _id: "$bookingStatus",
      count: { $sum: 1 },
      totalSellPrice: {
        $sum: {
          $cond: [
            { $eq: ["$bookingStatus", "CONFIRMED"] },
            "$bookingTotalAmount",  // change to your actual field name for total price
            0
          ]
        }
      }
    }
  }
]);


    // Initialize default status counts
    const statusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      FAILED: 0,
      CANCELLED: 0,
      INCOMPLETE: 0,
      HOLD: 0,
      "HOLD RELEASED": 0,
      "FAILED PAYMENT": 0,
      "CANCELLATION PENDING":0 
    };

    // Fill counts from aggregation result
    let totalSellPrice = 0;
    bookingStatusCounts.forEach(({ _id, count ,totalSellPrice: sellPrice = 0}) => {
      if (statusCounts.hasOwnProperty(_id)) {
        statusCounts[_id] = count;
        if (_id === "CONFIRMED") {
      totalSellPrice = sellPrice;
    }
      }
    });

    return {
      response: "Data Found Successfully",
      data:{
        statusCount:statusCounts,
        totalSellPrice:totalSellPrice,
        totalCount:bookingStatusCounts.length
      }
    };

  } catch (error) {
    console.error("Error in getProvideStatusCount:", error);
    throw error;
  }
};

module.exports = { StartBookingRail, findRailAllBooking,getProvideStatusCount };

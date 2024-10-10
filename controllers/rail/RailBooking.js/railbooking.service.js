const railBookings = require("../../../models/Irctc/bookingDetailsRail");
const {
  RailBookingCommonMethod,
} = require("../../../controllers/commonFunctions/common.function");
const User = require("../../../models/User");
const config = require("../../../models/AgentConfig");
const { ObjectId } = require("mongodb");
const { generateQR } = require("../../../utils/generate-qr");

const StartBookingRail = async (req, res) => {
  try {
    const {
      userId,
      companyId,
      cartId,
      amount,
      paymentmethod,
      agencyId,
      clientTransactionId,trainNo,journeyDate,frmStn,toStn,jClass,jQuota,paymentEnqFlag,reservationMode,autoUpgradationSelected,travelInsuranceOpted,ignoreChoiceIfWl,mobileNumber,emailId,ticketType,passengerList,boardingStation,
    } = req.body;
    console.log("sdjfdh");
    const requiredFields = [
      "userId",
      "companyId",
      "cartId",
      "amount",
      "paymentmethod",
      "agencyId",
      "clientTransactionId",
    ];
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] // Checks for undefined, null, empty
    );

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSometingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`,
      };
    }

    const railBoookingDetails = await railBookings.find({ cartId: cartId });
    if (railBoookingDetails.length) {
      return {
        response: "Your Booking allready exist",
      };
    }
    const RailBooking = await RailBookingCommonMethod(
      userId,
      amount,
      companyId,
      cartId,
      paymentmethod
    );
    if (RailBooking.response == "Your Balance is not sufficient") {
      return {
        response: "Your Balance is not sufficient",
      };
    }
    
if(RailBooking.response="amount transfer succefully"){
    await railBookings.create({cartId:cartId,
        clientTransactionId:clientTransactionId,
        companyId:companyId,
        userId:userId,
        AgencyId:agencyId,
        paymentMethod:paymentmethod,
        trainNumber:trainNo,journeyDate:`${journeyDate} 00:00:00.0 IST`,fromStn:frmStn,destStn:toStn,jClass:jClass,reservationMode:reservationMode,mobileNumber:mobileNumber,emailId:emailId,ticketType:ticketType,boardingStn:boardingStation,
        jQuota:jQuota,
        psgnDtlList:passengerList


    })
}
return({
    response:"your amount transfer Succefully"
})

    }catch(error){
        throw error
    }
    }
    const findRailAllBooking = async (req, res) => {
        const {
          userId,
          agencyId,
          bookingId,
          pnr,
          ticketNumber,
          paxName,
          status,
          fromDate,
          toDate,
          salesInchargeIds,
          BookedBy,
        } = req.body;
        const fieldNames = [
          "agencyId",
          "bookingId",
          "pnr",
          "status",
          "fromDate",
          "toDate",
          "salesInchargeIds",
        ];
        const missingFields = fieldNames.filter(
          (fieldName) =>
            req.body[fieldName] === null || req.body[fieldName] === undefined
        );
      
        if (missingFields.length > 0) {
          const missingFieldsString = missingFields.join(", ");
      
          return {
            response: null,
            isSometingMissing: true,
            data: `Missing or null fields: ${missingFieldsString}`,
          };
        }
      
        const checkUserIdExist = await User.findById(userId)
          .populate("roleId")
          .populate("company_ID");
      
    
        if (
          (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") ||
          (checkUserIdExist.roleId && checkUserIdExist.roleId.type == "Manual")
        ) {
          const filter = {};
      
      
      if(agencyId=="6555f84c991eaa63cb171a9f"&&checkUserIdExist.roleId && checkUserIdExist.roleId.type == "Manual"){
        filter.companyId= new ObjectId(agencyId)
      }
      
      else if (agencyId !== undefined && agencyId !== "") {
        filter.AgencyId = new ObjectId(agencyId);
      }
      else{
        checkUserIdExist.roleId.type == "Manual"?filter.companyId=checkUserIdExist.company_ID._id: filter.userId=new ObjectId(userId)
      }
      
      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.clientTransactionId = bookingId;
      }
      
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.pnrNumber = pnr;
      }
      
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      
      if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
        filter.bookingDate = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.bookingDate = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.bookingDate = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }
      console.log(filter)
      const railBooking = await railBookings.aggregate([
        { $match: filter }, 
      
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
            pipeline: [
              {
                $lookup: {
                  from: "companies",
                  localField: "company_ID",
                  foreignField: "_id",
                  as: "company_ID",
                },
              },
              { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } },
            ],
          },
        },
        { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
      
        // Lookup for BookedBy field
        {
          $lookup: {
            from: "users",
            localField: "BookedBy",
            foreignField: "_id",
            as: "BookedBy",
          },
        },
        { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },
      
        // Lookup for invoicingdatas
        {
          $lookup: {
            from: "invoicingdatas",
            localField: "_id",
            foreignField: "bookingId",
            as: "invoicingdatas",
          },
        },
        { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },
      
        {
          $addFields: {
            companyIdForLookup: "$userId.company_ID._id"
          }
        },
      
        {
          $lookup: {
            from: "agentconfigurations",
            localField: "companyIdForLookup", 
            foreignField: "companyId",
            as: "agentconfigurationData"
          },
        },
        { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },
    {
        $lookup:{
            from:"companies",
            localField:"companyId",
            foreignField:"_id",
            as:"companyId"
        }

    },
    { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
      
        {
          $addFields: {
            salesId: "$agentconfigurationData.salesInchargeIds"
          }
        },
      
        {
          $group: {
            _id: "$_id",
            railBooking: { $first: "$$ROOT" }, 
            userId: { $first: "$userId" }, 
            BookedBy: { $first: "$BookedBy" }, 
            invoicingdatas: { $first: "$invoicingdatas" }, 
            companyId:{$first:"$companyId"},
            agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
          },
        },
      
        {
          $replaceRoot: { newRoot: "$railBooking" },
        },
      ]);
      
      
      
          console.log("1st");
          if (!railBooking || railBooking.length === 0) {
            return {
              response: "Data Not Found",
            };
          } else {
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
               
      
        
            let filteredBookingData = railBooking; 
      
         
            return {
              response: "Fetch Data Successfully",
              data: {
                bookingList: filteredBookingData.sort(
                  (a, b) =>
                    new Date(
                      b.bookingDate -
                        new Date(a.bookingDate)
                    )
                ),
                statusCounts: statusCounts,
              },
            };
          }
        } else if (
          checkUserIdExist.roleId &&
          checkUserIdExist.roleId.name === "Distributer"
        ) {
          let filter = { companyId:new ObjectId(checkUserIdExist.company_ID._id) };
          if (agencyId !== undefined && agencyId !== "") {
            filter.userId = {};
            filter.userId = { $in: agencyId };
          }
      
          if (bookingId !== undefined && bookingId.trim() !== "") {
            filter.clientTransactionId = bookingId;
          }
          if (pnr !== undefined && pnr.trim() !== "") {
            filter.pnrNumber = pnr;
          }
          if (status !== undefined && status.trim() !== "") {
            filter.bookingStatus = status;
          }
          if (
            fromDate !== undefined &&
            fromDate.trim() !== "" &&
            toDate !== undefined &&
            toDate.trim() !== ""
          ) {
            filter.bookingDate = {
              $gte: new Date(fromDate + "T00:00:00.000Z"), 
              $lte: new Date(toDate + "T23:59:59.999Z"), 
            };
          } else if (fromDate !== undefined && fromDate.trim() !== "") {
            filter.bookingDate = {
              $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
            };
          } else if (toDate !== undefined && toDate.trim() !== "") {
            filter.bookingDate = {
              $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
            };
          }
      
          const railBooking = await railBookings.aggregate([
            { $match: filter }, 
          
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
                pipeline: [
                  {
                    $lookup: {
                      from: "companies",
                      localField: "company_ID",
                      foreignField: "_id",
                      as: "company_ID",
                    },
                  },
                  { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } },
                ],
              },
            },
            { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
          
            // Lookup for BookedBy field
            {
              $lookup: {
                from: "users",
                localField: "BookedBy",
                foreignField: "_id",
                as: "BookedBy",
              },
            },
            { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },
          
            // Lookup for invoicingdatas
            {
              $lookup: {
                from: "invoicingdatas",
                localField: "_id",
                foreignField: "bookingId",
                as: "invoicingdatas",
              },
            },
            { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },
          
            {
              $addFields: {
                companyIdForLookup: "$userId.company_ID._id"
              }
            },
          
            {
              $lookup: {
                from: "agentconfigurations",
                localField: "companyIdForLookup", 
                foreignField: "companyId",
                as: "agentconfigurationData"
              },
            },
            { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },
        {
            $lookup:{
                from:"companies",
                localField:"companyId",
                foreignField:"_id",
                as:"companyId"
            }
    
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
          
            {
              $addFields: {
                salesId: "$agentconfigurationData.salesInchargeIds"
              }
            },
          
            {
              $group: {
                _id: "$_id",
                railBooking: { $first: "$$ROOT" }, 
                userId: { $first: "$userId" }, 
                BookedBy: { $first: "$BookedBy" }, 
                invoicingdatas: { $first: "$invoicingdatas" }, 
                companyId:{$first:"$companyId"},
                agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
              },
            },
          
            {
              $replaceRoot: { newRoot: "$railBooking" },
            },
          ]);
         
      
          console.log("2nd");
      
          if (!railBooking || railBooking.length === 0) {
            return {
              response: "Data Not Found",
            };
          } else {
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
           
            // Iterate over the railBooking array
      
            // Iterate over the railBooking array
           
            let filteredBookingData = railBooking; // Copy the original data
      
           
            return {
              response: "Fetch Data Successfully",
              data: {
                bookingList: filteredBookingData.sort(
                  (a, b) =>
                    new Date(b.bookingDate) -
                    new Date(a.bookingDate)
                ),
                statusCounts: statusCounts,
              },
            };
          }
          //|| checkUserIdExist?.company_ID?.type === "TMC"
        } else if (
          (checkUserIdExist.roleId &&
            checkUserIdExist.roleId.name === "TMC" &&
            checkUserIdExist?.roleId?.type == "Default") ||
          (checkUserIdExist?.roleId?.type == "Manual" &&
            checkUserIdExist?.company_ID == new ObjectId("6555f84c991eaa63cb171a9f"))
        ) {
          let filter = {};
          if (agencyId !== undefined && agencyId !== ""&&agencyId != new ObjectId("6555f84c991eaa63cb171a9f")) {
            // filter.userId={}
            checkUserIdExist?.roleId?.type == "Manual"?filter.companyId = new ObjectId(agencyId):filter.userId=new ObjectId(agencyId);
            // let allagencyId = agencyId.map(id => new ObjectId(id));
            // filter.AgencyId={$in:allagencyId}
      
            // console.log(filter.AgencyId)
          }
          else if(agencyId !== undefined &&agencyId !== "" ){
            filter.companyId = new ObjectId(agencyId)
          }
      
          if (bookingId !== undefined && bookingId.trim() !== "") {
            filter.clientTransactionId = bookingId;
          }
          if (pnr !== undefined && pnr.trim() !== "") {
            filter.pnrNumber = pnr;
          }
          if (status !== undefined && status.trim() !== "") {
            filter.bookingStatus = status;
          }
          if (
            fromDate !== undefined &&
            fromDate.trim() !== "" &&
            toDate !== undefined &&
            toDate.trim() !== ""
          ) {
            filter.bookingDate = {
              $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
              $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
            };
          } else if (fromDate !== undefined && fromDate.trim() !== "") {
            filter.bookingDate = {
              $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
            };
          } else if (toDate !== undefined && toDate.trim() !== "") {
            filter.bookingDate = {
              $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
            };
          }
          console.log(filter,"j;die")
          const railBooking = await railBookings.aggregate([
            { $match: filter }, 
          
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId",
                pipeline: [
                  {
                    $lookup: {
                      from: "companies",
                      localField: "company_ID",
                      foreignField: "_id",
                      as: "company_ID",
                    },
                  },
                  { $unwind: { path: "$company_ID", preserveNullAndEmptyArrays: true } },
                ],
              },
            },
            { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
          
            // Lookup for BookedBy field
            {
              $lookup: {
                from: "users",
                localField: "BookedBy",
                foreignField: "_id",
                as: "BookedBy",
              },
            },
            { $unwind: { path: "$BookedBy", preserveNullAndEmptyArrays: true } },
          
            // Lookup for invoicingdatas
            {
              $lookup: {
                from: "invoicingdatas",
                localField: "_id",
                foreignField: "bookingId",
                as: "invoicingdatas",
              },
            },
            { $unwind: { path: "$invoicingdatas", preserveNullAndEmptyArrays: true } },
          
            {
              $addFields: {
                companyIdForLookup: "$userId.company_ID._id"
              }
            },
          
            {
              $lookup: {
                from: "agentconfigurations",
                localField: "companyIdForLookup", 
                foreignField: "companyId",
                as: "agentconfigurationData"
              },
            },
            { $unwind: { path: "$agentconfigurationData", preserveNullAndEmptyArrays: true } },
        {
            $lookup:{
                from:"companies",
                localField:"companyId",
                foreignField:"_id",
                as:"companyId"
            }
    
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
          
            {
              $addFields: {
                salesId: "$agentconfigurationData.salesInchargeIds"
              }
            },
          
            {
              $group: {
                _id: "$_id",
                railBooking: { $first: "$$ROOT" }, 
                userId: { $first: "$userId" }, 
                BookedBy: { $first: "$BookedBy" }, 
                invoicingdatas: { $first: "$invoicingdatas" }, 
                companyId:{$first:"$companyId"},
                agentData: { $first: "$agentconfigurationData.salesInchargeIds" }
              },
            },
          
            {
              $replaceRoot: { newRoot: "$railBooking" },
            },
          ]);
           
          
            // .find(filter)
            // .populate({
            //   path: "userId",
            //   populate: {
            //     path: "company_ID",
            //   },
            // })
            // .populate("BookedBy");
          console.log("3rd");
          if (!railBooking || railBooking.length === 0) {
            return {
              response: "Data Not Found",
            };
          } else {
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
      
            // Iterate over the railBooking array

      railBooking.forEach((booking) => {
        const status = booking.bookingStatus;
        // Increment the count corresponding to the status
        statusCounts[status]++;
      });

      let filteredBookingData = railBooking; // Copy the original data

      return {
        response: "Fetch Data Successfully",
        data: {
          bookingList: filteredBookingData.sort(
            (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
          ),
          statusCounts: statusCounts,
        },
      };
    }
  } else {
    const userCompanyId = checkUserIdExist.company_ID;
    const checkComapnyUser = await User.findOne({
      company_ID: userCompanyId,
    }).populate({
      path: "roleId",
      match: { type: "Default" },
    });
    if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Agency") {
      let filter = { userId: checkComapnyUser._id };
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.clientTransactionId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.pnrNumber = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }

      if (
        fromDate !== undefined &&
        fromDate.trim() !== "" &&
        toDate !== undefined &&
        toDate.trim() !== ""
      ) {
        filter.bookingDate = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.bookingDate = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.bookingDate = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }

      // const railBooking = await railBooking
      //   .find(filter)
      //   .populate({
      //     path: "userId",
      //     populate: {
      //       path: "company_ID",
      //     },
      //   })
      //   .populate("BookedBy");

      if (!railBooking || railBooking.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
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

        // Iterate over the railBooking array

        let filteredBookingData = railBooking; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(
            (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
          );
        }
        return {
          response: "Fetch Data Successfully",
          data: {
            bookingList: filteredBookingData.sort(
              (a, b) => new Date(b.bookingDate - new Date(a.bookingDate))
            ),
            statusCounts: statusCounts,
          },
        };
      }
    } else if (
      checkComapnyUser.roleId &&
      checkComapnyUser.roleId.name === "Distributer"
    ) {
      let filter = { companyId: checkComapnyUser.company_ID._id };
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      if (
        fromDate !== undefined &&
        fromDate.trim() !== "" &&
        toDate !== undefined &&
        toDate.trim() !== ""
      ) {
        filter.bookingDate = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.bookingDate = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.bookingDate = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }

      const railBooking = await railBooking
        .find(filter)
        .populate({
          path: "userId",
          populate: {
            path: "company_ID",
          },
        })
        .populate("BookedBy");

      if (!railBooking || railBooking.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
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

        // Iterate over the railBooking array
        railBooking.forEach((booking) => {
          const status = booking.bookingStatus;
          // Increment the count corresponding to the status
          statusCounts[status]++;
        });
        const allBookingData = [];

        await Promise.all(
          railBooking.map(async (booking) => {
            let filter2 = { bookingId: booking.bookingId };
            if (ticketNumber !== undefined && ticketNumber.trim() !== "") {
              filter2["Passengers.Optional.TicketNumber"] = ticketNumber;
            }
            const passengerPreference = await passengerPreferenceSchema.find(
              filter2
            );
            const configDetails = await config.findOne({
              userId: booking.userId,
            });
            if (passengerPreference.length) {
              allBookingData.push({
                railBooking: booking,
                passengerPreference: passengerPreference,
                salesInchargeIds: configDetails?.salesInchargeIds,
              });
            }
          })
        );
        let filteredBookingData = allBookingData; // Copy the original data

        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(
            (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
          );
        }
        return {
          response: "Fetch Data Successfully",
          data: {
            bookingList: filteredBookingData.sort(
              (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
            ),
            statusCounts: statusCounts,
          },
        };
      }
    } else if (
      (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC") ||
      checkComapnyUser?.company_ID?.type === "TMC"
    ) {
      let filter = {};
      if (agencyId !== undefined && agencyId !== "") {
        ilter.userId = {};
        filter.userId = { $in: agencyId };
      }

      if (bookingId !== undefined && bookingId.trim() !== "") {
        filter.bookingId = bookingId;
      }
      if (pnr !== undefined && pnr.trim() !== "") {
        filter.PNR = pnr;
      }
      if (status !== undefined && status.trim() !== "") {
        filter.bookingStatus = status;
      }
      if (
        fromDate !== undefined &&
        fromDate.trim() !== "" &&
        toDate !== undefined &&
        toDate.trim() !== ""
      ) {
        filter.bookingDate = {
          $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
          $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.bookingDate = {
          $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.bookingDate = {
          $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
        };
      }

      const railBooking = await railBooking
        .find(filter)
        .populate({
          path: "userId",
          populate: {
            path: "company_ID",
          },
        })
        .populate("BookedBy");

      if (!railBooking || railBooking.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
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

        // Iterate over the railBooking array

        let filteredBookingData = railBooking; // Copy the original data

        console.log("sdhei");
        if (salesInchargeIds !== undefined && salesInchargeIds.trim() !== "") {
          filteredBookingData = allBookingData.filter(
            (bookingData) => bookingData.salesInchargeIds === salesInchargeIds
          );
        }

        return {
          response: "Fetch Data Successfully",
          data: {
            bookingList: filteredBookingData.sort(
              (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
            ),
            statusCounts: statusCounts,
          },
        };
      }
    }
  }
};
module.exports = { StartBookingRail, findRailAllBooking };

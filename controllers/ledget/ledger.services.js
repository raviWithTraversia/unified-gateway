const Company = require("../../models/Company");
const User = require("../../models/User");
const ledger = require("../../models/Ledger");
const { ObjectId } = require("mongodb");
const { response } = require("../../routes/payuRoute");
const bookingDetails = require("../../models/booking/BookingDetails");
const transactionModel = require("../../models/transaction");
const PassengerPreferenceModel = require("../../models/booking/PassengerPreference");
const {
  priceRoundOffNumberValues,
  calculateOfferedPricePaxWise,
} = require("../commonFunctions/common.function");
const payOnlineHistoryUpdate=require("../../models/onlinePaymentHistory")

const getAllledger = async (req, res) => {
  const { userId, fromDate, toDate, transactionType } = req.body;

  // Validate request body
  const requiredFields = ["userId", "fromDate", "toDate"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFields.join(", ")}`,
    };
  }

  // Check if user exists
  const user = await User.findById(userId).populate("roleId");
  if (!user) {
    return { response: "User id does not exist" };
  }

  const role = user.roleId ? user.roleId.name : null;
  let filter = {};

  // Set common filter for transaction date
  if (fromDate && toDate) {
    filter.transationDate = {
      $gte: new Date(fromDate + "T00:00:00.000Z"), // Start of fromDate
      $lte: new Date(toDate + "T23:59:59.999Z"), // End of toDate
    };
  } else if (fromDate) {
    filter.transationDate = {
      $lte: new Date(fromDate + "T23:59:59.999Z"), // End of fromDate
    };
  } else if (toDate) {
    filter.transationDate = {
      $gte: new Date(toDate + "T00:00:00.000Z"), // Start of toDate
    };
  }

  // Set filter based on role
  if (role === "Agency") {
    filter.userId = userId;
  } else if (role === "Distributer") {
    filter.companyId = user.company_ID;
  } else if (role === "TMC") {
    // No additional filter for TMC role
  } else {
    // Check if the user belongs to a company with an Agency or Distributer role
    const companyUser = await User.findOne({
      company_ID: user.company_ID,
    }).populate({
      path: "roleId",
      match: { type: "Default" },
    });

    if (!companyUser) {
      return { response: "Company user not found" };
    }

    const companyRole = companyUser.roleId ? companyUser.roleId.name : null;
    if (companyRole === "Agency") {
      filter.userId = companyUser._id;
    } else if (companyRole === "Distributer") {
      filter.companyId = companyUser.company_ID;
    } else {
      return { response: "Invalid company role" };
    }
  }

  // Add transaction type filter if provided
  if (transactionType) {
    filter.transactionType = transactionType.trim();
  }

  // Fetch ledger details
  const ledgerDetails = await ledger
    .find(filter)
    .sort({ transationDate: -1 })
    .populate("userId")
    .populate("companyId");
  if (!ledgerDetails || ledgerDetails.length === 0) {
    return { response: "Data Not Found" };
  }

  // If the user role is Agency, fetch booking details for each ledger
  const bookingsData = await Promise.all(
    ledgerDetails.map(async (element) => {
      let bookingData = [];
      let passengerpre = [];
      let transactionData = [];
      let netfare = 0;
      let sf = 0;
      let cb = 0;
      let gst = 0;
      let promo = 0;
      if (element?.cartId != null) {
        bookingData = await bookingDetails.find({ bookingId: element?.cartId });
        passengerpre = await PassengerPreferenceModel.find({
          bookingId: element?.cartId,
        });
        transactionData = await transactionModel.find({
          bookingId: element?.cartId,
        });
        if (passengerpre.length > 0) {
          for (let pp of passengerpre[0].Passengers) {
            if (bookingData.length > 0) {
              let getCommercialArray = bookingData[0].itinerary.PriceBreakup;
              let dpp = { ...pp._doc, getCommercialArray };
              // console.log(dpp,"itenaryitenary");
              netfare += await calculateOfferedPricePaxWise(dpp);
            }
          }
        }
      }

      netfare = await priceRoundOffNumberValues(netfare);
      return {
        ...element._doc,
        bookingData,
        transactionData,
        netfare,
        sf,
        cb,
        gst,
        promo,
      };
    })
  );

  return {
    response: "Fetch Data Successfully",
    data: bookingsData,
  };
};

const onlinePaymentHistory=async(req,res)=>{
  const { companyId, startDate, endDate, status } = req.body;
 
  try{
    let searchPayloadDate={}
     if(status){
      searchPayloadDate={
        companyId:companyId,
        createdAt: {
          $gte: new Date(startDate), // Start of fromDate
          $lte: new Date(endDate), // End of toDate
        },
        status:status
      }
    
  }
  else {
    searchPayloadDate={
      companyId:companyId,
      createdAt: {
        $gte: new Date(startDate), // Start of fromDate
        $lte: new Date(endDate), // End of toDate
      },
    }
  }

    const getPaymentHistory=await payOnlineHistoryUpdate.find(
      searchPayloadDate
    ).populate("companyId","companyName").populate("userId","userId").sort({createdAt:-1})

    if(!getPaymentHistory||getPaymentHistory.length==0){
      return{
        response:"Data Not Found"
      }
    }

    return{
      response:"Fetch Data Successfully",
      data:getPaymentHistory

    }

  }catch(error){
    throw error
  }
}
const transactionReport = async (req, res) => {
  try {
    console.log("jiejeij");
    const { agencyId, fromDate, toDate } = req.body;

    const searchData = [];

    const dateQuery = {
      createdAt: {
        $gte: new Date(fromDate + "T00:00:00.000Z"),
        $lte: new Date(toDate + "T23:59:59.999Z"),
      },
    };
    searchData.push(dateQuery);

    // if (agencyId) {
    //   const statusQuery = {
    //     "userId": new ObjectId(agencyId)
    //   };
    //   searchData.push(statusQuery);
    // }
    const getLedgerTransaction = await ledger.aggregate([
      {
        $match: {
          $and: searchData,
        },
      },
      {
        $lookup: {
          from: "bookingdetails",
          localField: "cartId",
          foreignField: "bookingId",
          as: "bookingData",
        },
      },
      { $unwind: "$bookingData" },
      {
        $match: {
          "bookingData.bookingStatus": "CONFIRMED",
          "bookingData.userId": agencyId
            ? new ObjectId(agencyId)
            : { $exists: true },
        },
      },
      {
        $project: {
          userId: "$bookingData.userId",
          aliasId: "$bookingData.providerBookingId",
          bookingAmount: "$transactionAmount",
          agentId: "$bookingData.AgencyId",
          currentBalance: "$runningAmount",
          previousBalance: { $add: ["$runningAmount", "$transactionAmount"] },
          product: "$bookingData.productType",
          dealAmount: "0",
          netAmount: "0",
          gstAmount: "0",
          sfAmount: "0",
          tdsAmount: "0",
          cbAmount: "0",
          PromoAmount: "0",
          eTime: "$bookingData.invoicingDate",
          remark: "$transactionType",
          narration: "AUTO",
          cartId: "$cartId",
        },
      },
    ]);
    console.log(getLedgerTransaction);
    getLedgerTransaction.forEach((element, index) => {
      element.id = index + 1;
    });
    if (!getLedgerTransaction.length) {
      return {
        response: "Data Not Found",
      };
    }
    return {
      response: "Fetch Data Successfully",
      data: getLedgerTransaction,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getAllledgerbyDate = async (req, res) => {
  try {
    const { date, companyId, page = 1, limit = 10 } = req.body;

    if (!date) {
      return {
        response: "please enter date",
      };
    }

    const inputDate = new Date(date);
    const endDate = new Date(inputDate.setUTCHours(23, 59, 59, 999));
    const findTmcUser = await Company.findById(companyId);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // STEP 1: Get all matching company IDs (before pagination)
    const matchStage = {
      $addFields: {
        matchCondition: {
          $cond: {
            if: { $eq: [findTmcUser.type, "TMC"] },
            then: { $in: ["$type", ["Agency", "Distributer"]] },
            else: { $eq: ["$parent", new ObjectId(companyId)] }
          }
        }
      }
    };

    const matchCompanies = await Company.aggregate([
      matchStage,
      { $match: { matchCondition: true } },
      { $project: { _id: 1 } }
    ]);

    const matchedCompanyIds = matchCompanies.map(c => c._id);
    const totalCount = matchedCompanyIds.length;

    // STEP 2: Now apply pagination manually to companyIds
    const paginatedCompanyIds = matchedCompanyIds.slice(skip, skip + limit);

    // STEP 3: Apply full heavy aggregation only on paginated company IDs
    const aggregationResult = await Company.aggregate([
      { $match: { _id: { $in: paginatedCompanyIds } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "company_ID",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "userData.roleId",
          foreignField: "_id",
          as: "roledata",
        },
      },
      {
        $unwind: {
          path: "$roledata",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "roledata.type": "Default",
        },
      },
      {
        $lookup: {
          from: "ledgers",
          localField: "userData._id",
          foreignField: "userId",
          as: "ledgerData",
        },
      },
      {
        $set: {
          ledgerData: {
            $sortArray: { input: "$ledgerData", sortBy: { createdAt: -1 } },
          },
        },
      },
      {
        $set: {
          ledgerData: {
            $filter: {
              input: "$ledgerData",
              as: "ledger",
              cond: { $lte: ["$$ledger.createdAt", endDate] },
              limit: 1,
            },
          },
        },
      },
      {
        $unwind: {
          path: "$ledgerData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: "$userData.userId",
          companyId: {
            companyName: "$companyName",
            type: "$type",
          },
          runningAmount: {
            $cond: {
              if: { $gt: ["$ledgerData.runningAmount", 0] },
              then: "$ledgerData.runningAmount",
              else: 0
            }
          },
          createdAt: "$ledgerData.createdAt",
        },
      }
    ]);

    return {
      response: "ledger find succefully",
      data:{
totalCount:totalCount,
     data:aggregationResult,
      }
      
    };

  } catch (error) {
    console.error("Error in getAllledgerbyDate:", error);
    throw error;
  }
};

module.exports = {
  getAllledger,
  transactionReport,
  getAllledgerbyDate,
  onlinePaymentHistory
};

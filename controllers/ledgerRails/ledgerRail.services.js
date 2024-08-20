const Company = require("../../models/Company");
const User = require("../../models/User");
const ledgerRail = require("../../models/Irctc/ledgerRail");
const { ObjectId } = require("mongodb");
const { response } = require("../../routes/payuRoute");
const bookingDetails=require('../../models/booking/BookingDetails');
const transactionModel = require("../../models/transaction");
const PassengerPreferenceModel = require("../../models/booking/PassengerPreference");
const { priceRoundOffNumberValues,calculateOfferedPricePaxWise } = require("../commonFunctions/common.function");

const getAllledger = async (req, res) => {
  const { userId, fromDate, toDate, transactionType } = req.body;

  // Validate request body
  const requiredFields = ["userId", "fromDate", "toDate"];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFields.join(", ")}`,
    };
  }

  // Check if user exists
  const user = await User.findById(userId).populate('roleId');
  if (!user) {
    return { response: "User id does not exist" };
  }

  const role = user.roleId ? user.roleId.name : null;
  let filter = {};

  // Set common filter for transaction date
  if (fromDate && toDate) {
    filter.transationDate = {
      $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
      $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
    };
  } else if (fromDate) {
    filter.transationDate = {
      $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
    };
  } else if (toDate) {
    filter.transationDate = {
      $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
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
    const companyUser = await User.findOne({ company_ID: user.company_ID }).populate({
      path: 'roleId',
      match: { type: 'Default' }
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
  const ledgerDetails = await ledgerRail.find(filter).sort({ transationDate: -1 }).populate("userId").populate('companyId');
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
        if(element?.cartId !=null){
          bookingData = await bookingDetails.find({ bookingId: element?.cartId });
          passengerpre = await PassengerPreferenceModel.find({ bookingId: element?.cartId });
          transactionData = await transactionModel.find({ bookingId: element?.cartId });
          if(passengerpre.length>0){
            for(let pp of passengerpre[0].Passengers){
              let getCommercialArray = bookingData[0].itinerary.PriceBreakup
              let dpp = {...pp._doc,getCommercialArray};
              // console.log(dpp,"itenaryitenary");
              netfare += await calculateOfferedPricePaxWise(dpp);
            }
          }
        }
        
        netfare = await priceRoundOffNumberValues(netfare);
        return { ...element._doc, bookingData,transactionData,netfare,sf,cb,gst,promo };
      }),
     
    );
  

  return {
    response: "Fetch Data Successfully",
    data: bookingsData
  };
};


const transactionReport = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  const getLedgerTransaction = await ledgerRail.aggregate([{
    $match: {
      createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate + 'T23:59:59.999Z') }
    }
  }, {
    $lookup: {
      from: "bookingdetails",
      localField: "cartId",
      foreignField: "bookingId",
      as: "bookingData",
    }
  }, { $unwind: "$bookingData" }, {
    $match: { "bookingData.bookingStatus": "CONFIRMED", "bookingData.AgencyId": agencyId ? new ObjectId(agencyId) : { $exists: true } }
  }, {
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
      cartId:"$cartId"
    }
  }]);
  getLedgerTransaction.forEach((element, index) => {
    element.id = index + 1;
  });
  if (!getLedgerTransaction.length) {
    return {
      response: "Data Not Found",
    };
  };
  return {
    response: "Fetch Data Successfully",
    data: getLedgerTransaction,
  };
}

const getAllledgerbyDate=async(req,res)=>{
  try{
    const {date,companyId}=req.body;
    if(!date){
      return {
        response:"please enter date"
      }
    }
    const inputDate = new Date(date);

    // Create start and end range for the day
    const startDate = new Date(inputDate.setUTCHours(0, 0, 0, 0));
    const endDate = new Date(inputDate.setUTCHours(23, 59, 59, 999));

    const dateId = {
      $gte: startDate,
      $lt: endDate
    };

const uniqueCompanyIds = await Company.aggregate([
  {
    $match: {
      parent: new ObjectId(companyId)
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: 'company_ID',
      as: 'userData'
    }
  },
  { 
    $unwind: { 
      path: '$userData', 
      preserveNullAndEmptyArrays: true 
    } 
  },
  {
    $lookup: {
      from: 'roles',
      localField: 'userData.roleId',
      foreignField: '_id',
      as: 'roledata'
    }
  },
  { 
    $unwind: { 
      path: '$roledata', 
      preserveNullAndEmptyArrays: true 
    } 
  },
  {
    $match: {
      'roledata.name': 'Agency'
    }
  },
  {
    $lookup: {
      from: "ledgerRails",
      localField: "_id",
      foreignField: "companyId",
      as: "ledgerData"
    }
  },
  { 
    $unwind: { 
      path: '$ledgerData', 
      preserveNullAndEmptyArrays: true 
    } 
  },
  
  {
    $sort: {
      "ledgerData.createdAt": -1
    }
  },
  {
    $group: {
      _id: '$_id',
      userId: { $first: '$userData.userId' },
      companyId: { 
        $first: { 
          companyName: '$companyName', 
          type: '$type' 
        } 
      },
      matchedRunningAmount: {
        $first: {
          $cond: {
            if: { $and: [
              { $gte: ['$ledgerData.createdAt', startDate] },
              { $lte: ['$ledgerData.createdAt', endDate] }
            ]},
            then: '$ledgerData.runningAmount',
            else: null
          }
        }
      },
      latestRunningAmount: { $first: '$ledgerData.runningAmount' },
      createdAt: { $first: "$ledgerData.createdAt" }
    }
  },
  {
    $addFields: {
      runningAmount: {
        $ifNull: ['$matchedRunningAmount', '$latestRunningAmount']
      },
      dateMatched: {
        $cond: {
          if: { $ne: ['$matchedRunningAmount', null] },
          then: true,
          else: false
        }
      }
    }
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      companyId: 1,
      runningAmount: {
        $cond: {
          if: { $eq: ['$runningAmount', null] },
          then: 0,
          else: '$runningAmount'
        }
      },
      createdAt: 1,
      dateMatched: 1
    }
  }
]);

  
const FindbyDate = await Company.aggregate([
  {
    $match: {
      parent: new ObjectId(companyId)
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: 'company_ID',
      as: 'userData'
    }
  },
  { 
    $unwind: { 
      path: '$userData', 
      preserveNullAndEmptyArrays: true 
    } 
  },
  {
    $lookup: {
      from: 'roles',
      localField: 'userData.roleId',
      foreignField: '_id',
      as: 'roledata'
    }
  },
  { 
    $unwind: { 
      path: '$roledata', 
      preserveNullAndEmptyArrays: true 
    } 
  },
  {
    $match: {
      'roledata.name': 'Agency'
    }
  },
  {
    $lookup: {
      from: "ledgerRail",
      localField: "_id",
      foreignField: "companyId",
      as: "ledgerData"
    }
  },
  { 
    $unwind: { 
      path: '$ledgerData', 
      preserveNullAndEmptyArrays: true 
    } 
  },
  {$sort:{
    "ledgerData.createdAt":-1
  }},
  {
    $match:{
      "ledgerData.createdAt": dateId
    }
  },
  {
    $group: {
      _id: '$_id',
      userId: { $first: '$userData.userId' },
      companyId: { 
        $first: { 
          companyName: '$companyName', 
          type: '$type' 
        } 
      },
      runningAmount: { $first: '$ledgerData.runningAmount' },
      createdAt: { $first: "$ledgerData.createdAt" }
    }
  }
]);


let element = [];
for (let i = 0; i < uniqueCompanyIds.length; i++) {
  
  let found = false;
  for (let j = 0; j < FindbyDate.length; j++) {
    if (uniqueCompanyIds[i].userId ==FindbyDate[j].userId) {
      found = true;
    }
  }
  if (!found) {
    element.push(uniqueCompanyIds[i]);
  }
}





const data=FindbyDate.concat(element)
  
  
  
  
  
    if(!uniqueCompanyIds){
return{
  response:"ledger not found"
}

    }
    else{
    return {
      response:"ledger find succefully",
      data:data
    }
  }

  }catch(error){
throw error 
  }
}
module.exports = {
  getAllledger, transactionReport,getAllledgerbyDate
};
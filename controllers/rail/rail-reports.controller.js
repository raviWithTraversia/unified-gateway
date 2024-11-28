const { apiErrorres, apiSucessRes } = require("../../utils/commonResponce");
const moment = require("moment");
const { ObjectId } = require("mongodb");
const bookingDetailsRail = require("../../models/Irctc/bookingDetailsRail");
const User = require("../../models/User");
const Company = require("../../models/Company");
const { forEach } = require("lodash");
const {Config}=require('../../configs/config')
const {commonMethodDate,convertTimeISTtoUTC}=require('../../controllers/commonFunctions/common.function')
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

const fetchRailReports = async (req, res) => {
  try {
    const { userId, agencyId, fromDate, toDate } = req.body;
    if (!userId) return apiErrorres(res, "user id required", 400, true);

    const user = await User.findById(userId);
    if (!user)
      return apiErrorres(res, "user not found, invalid user id", 400, true);

    const company = await Company.findById(user.company_ID);
    if (!company) return apiErrorres(res, "company not found", 400, true);

    const isTMC = company.type.toLowerCase() === "tmc";

    const query = {};
    if (isTMC) {
      if (agencyId) query.AgencyId = new ObjectId(agencyId);
    } else query.AgencyId = user.company_ID;

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        if (!moment(fromDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid fromDate format, must be YYYY-MM-DD",
            400,
            true
          );

        let startDate = moment(fromDate)
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .toDate();
        query.createdAt["$gte"] = startDate;
      }
      if (toDate && fromDate !== toDate) {
        if (!moment(toDate, "YYYY-MM-DD", true).isValid())
          return apiErrorres(
            res,
            "invalid toDate format, must be YYYY-MM-DD",
            400,
            true
          );
        let endDate = moment(toDate)
          .set("hour", 23)
          .set("minute", 59)
          .second(59)
          .toDate();
        query.createdAt["$lte"] = endDate;
      }
    }
    if (fromDate && toDate) {
      if (moment(toDate).isBefore(fromDate)) {
        return apiErrorres(
          res,
          "invalid fromDate | toDate, toDate must be a date greater than or equal to fromDate",
          400,
          true
        );
      }
    }
    console.log({ query });

    const railAggregation = await bookingDetailsRail.aggregate([
      { $match: query },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $set: {
          user: {
            $first: "$user",
          },
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "AgencyId",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $set: {
          company: {
            $first: "$company",
          },
        },
      },
      {
        $set: {
          email: {
            $ifNull: ["$user.email", ""],
          },
        },
      },
      {
        $set: {
          FID: {
            $ifNull: ["$user.userId", ""],
          },
        },
      },
      {
        $set: {
          RID: "$FID",
        },
      },
    ]);

    return apiSucessRes(res, "Fetched Rail Reports", railAggregation, 200);
  } catch (err) {
    console.error(err);
    apiErrorres(res, "something went wrong", 500, true);
  }
};

const getBillingRailData = async (req, res) => {
  const { key, fromDate, toDate } = req.query;
  const istDateString = await ISOTime(fromDate);
  const istDateString2 = await ISOTime(toDate);

  if (!fromDate || !toDate || !key) {
    return {
      response: "Please provide required fields",
    };
  }

  let MODEENV = "D";
  let authKey = "667bd5d44dccc9b2d2b80690";
  if (Config.MODE === "LIVE") {
    MODEENV = "P";
    authKey = "667bd64d2ca70f085a8328ca";
  }
  if (authKey !== key) {
    return {
      response: "Access Denied! Provide a valid Key!",
    };
  }


  const BillingData = await bookingDetailsRail
  .find({
    createdAt: {
      $gte: new Date(istDateString),
      $lte: new Date(istDateString2),
    },
    bookingStatus: "CONFIRMED",
  })
  .populate([
    { path: "userId" }, // Populates the `user` collection for `userId`
    { path: "companyId" }, // Populates the `company` collection for `companyId`
    { path: "AgencyId" }, // Populates the `company` collection for `AgencyId`
  ]);



// Use flatMap to flatten the results from psgnDtlList
const paxbyBillingData = BillingData.flatMap((element) => {
  const BookingIds = commonMethodDate(element?.createdAt);
  const commission = 
    element?.RailCommercial?.agentServiceCharge +
    element?.RailCommercial?.commericalConveniencefee +
    Math.round(element?.RailCommercial?.pgCharges);

  return element.psgnDtlList.map((psg) => ({
    _id: psg?._id,
    bookingId:element?.providerbookingId,
    agency_name: element?.AgencyId?.companyName,
    agent_id: element?.userId?.userId,
    ticket_no: element?.pnrNumber,
    item_amount: psg?.passengerNetFare,
    pnr: element?.pnrNumber,
    pax_name: psg?.passengerName,
    sector: `${element?.fromStn}-${element?.destStn}`,
    flight_no:`RL ${element?.trainNumber} (${element?.trainName})`,
    class: element?.journeyClass,
    cc_user: `${element?.reservationId}/${element?.bookedQuota}`,
    trav_date_outbound: convertTimeISTtoUTC(element?.boardingDate) || convertTimeISTtoUTC(element?.journeyDate),
    trave_date_inbound: convertTimeISTtoUTC(element?.destArrvDate),
    issue_date: element?.createdAt,
    airline_name: "RAILWAY TICKET",
    airline_tax: Math.round(element?.serviceTax),
    tran_fee: 0,
    s_tax: 0,
    commission: commission,
    tds: 0,
    cash_back: 0,
    account_post: psg?.accountPost,
    purchase_code: 0,
    FLCODE: null,
    bookingId_1: "WKAFILA00000",
  }));
});

const processedBookingIds = new Set();

const adjustedBillingData = paxbyBillingData.map((element) => {
  if (processedBookingIds.has(element.pnr)) {
    return {
      ...element,
      airline_tax: 0,
      commission: 0,
    };
  } else {
    processedBookingIds.add(element.pnr);
    return element;
  }
});

const data=await  Promise.all(adjustedBillingData)






  

  return {
    response: "Fetch Data Successfully",
    data: adjustedBillingData,
  };
};


const updateBillPost = async (req, res) => {
  const { accountPostArr } = req.body;
  if (!accountPostArr.length) {
    return {
      response: "Please provide valid AccountPost",
    };
  }
  const bulkOps = [];
  for (let item of accountPostArr) {
    bulkOps.push({
      updateOne: {
        filter: { "psgnDtlList._id": item._id },
        update: { $set: { "psgnDtlList.$.accountPost": item.accountPost } },
      },
    });
  }
  if (!bulkOps.length) {
    return {
      response: "Data Not Found",
    };
  }
  console.log(bulkOps)
  let updatedData = await bookingDetailsRail.bulkWrite(bulkOps);
  if (updatedData.modifiedCount < 1) {
    return {
      response: "Error in Updating AccountPost",
    };
  }
  return {
    response: "AccountPost Updated Successfully",
  };
};


module.exports={
  getBillingRailData,
  fetchRailReports,
  updateBillPost
}
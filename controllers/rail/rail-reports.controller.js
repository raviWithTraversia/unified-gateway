const { apiErrorres, apiSucessRes } = require("../../utils/commonResponce");
const moment = require("moment");
const { ObjectId } = require("mongodb");
const bookingDetailsRail = require("../../models/Irctc/bookingDetailsRail");
const User = require("../../models/User");
const Company = require("../../models/Company");
module.exports.fetchRailReports = async (req, res) => {
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
      if (toDate) {
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

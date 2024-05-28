const Company = require("../../models/Company");
const User = require("../../models/User");
const ledger = require("../../models/Ledger");
const { ObjectId } = require("mongodb");
const getAllledger = async (req, res) => {
  const {
    userId,
    fromDate,
    toDate,
    transactionType
  } = req.body;
  const fieldNames = [
    "userId",
    "fromDate",
    "toDate",
    "transactionType"
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
  if (!userId) {
    return {
      response: "User id does not exist",
    };
  }

  // Check if company Id exists
  const checkUserIdExist = await User.findById(userId).populate('roleId');


  if (!checkUserIdExist) {
    return {
      response: "User id does not exist",
    };
  }

  if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Agency") {
    let filter = { userId: userId };

    if (transactionType !== undefined && transactionType.trim() !== "") {
      filter.transactionType = transactionType;
    }

    if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      filter.transationDate = {
        $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
        $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.transationDate = {
        $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.transationDate = {
        $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      };
    }
    const ledgerDetails = await ledger.find(filter).sort({ transationDate: -1 })
      .populate("userId").populate('companyId');


    if (!ledgerDetails || ledgerDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: ledgerDetails
      };
    }
  } else if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "Distributer") {
    let filter = { companyId: checkUserIdExist.company_ID };
    if (transactionType !== undefined && transactionType.trim() !== "") {
      filter.transactionType = transactionType;
    }

    if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      filter.transationDate = {
        $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
        $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.transationDate = {
        $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.transationDate = {
        $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      };
    }
    const ledgerDetails = await ledger.find(filter).sort({ transationDate: -1 })
      .populate("userId").populate('companyId');

    if (!ledgerDetails || ledgerDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: ledgerDetails
      };
    }
  } else if (checkUserIdExist.roleId && checkUserIdExist.roleId.name === "TMC") {
    let filter = {};

    //   if (userId !== undefined && userId.trim() !== "") {
    //     filter.userId = userId;
    // }

    if (transactionType !== undefined && transactionType.trim() !== "") {
      filter.transactionType = transactionType;
    }

    if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
      filter.transationDate = {
        $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
        $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
      };
    } else if (fromDate !== undefined && fromDate.trim() !== "") {
      filter.transationDate = {
        $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
      };
    } else if (toDate !== undefined && toDate.trim() !== "") {
      filter.transationDate = {
        $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
      };
    }
    const ledgerDetails = await ledger.find(filter).sort({ transationDate: -1 })
      .populate("userId").populate('companyId');
    if (!ledgerDetails || ledgerDetails.length === 0) {
      return {
        response: "Data Not Found",
      };
    } else {
      return {
        response: "Fetch Data Successfully",
        data: ledgerDetails
      };
    }
  } else {
    const userCompanyId = checkUserIdExist.company_ID;
    const checkComapnyUser = await User.findOne({ company_ID: userCompanyId }).populate({
      path: 'roleId',
      match: { type: 'Default' }
    });
    if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Agency") {
      let filter = { userId: checkComapnyUser._id };

      if (transactionType !== undefined && transactionType.trim() !== "") {
        filter.transactionType = transactionType;
      }

      if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
        filter.transationDate = {
          $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
          $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.transationDate = {
          $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.transationDate = {
          $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
        };
      }
      const ledgerDetails = await ledger.find(filter).sort({ transationDate: -1 })
        .populate("userId").populate('companyId');


      if (!ledgerDetails || ledgerDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        return {
          response: "Fetch Data Successfully",
          data: ledgerDetails
        };
      }
    } else if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "Distributer") {
      let filter = { companyId: checkComapnyUser.company_ID };
      if (transactionType !== undefined && transactionType.trim() !== "") {
        filter.transactionType = transactionType;
      }

      if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
        filter.transationDate = {
          $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
          $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.transationDate = {
          $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.transationDate = {
          $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
        };
      }
      const ledgerDetails = await ledger.find(filter).sort({ transationDate: -1 })
        .populate("userId").populate('companyId');

      if (!ledgerDetails || ledgerDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        return {
          response: "Fetch Data Successfully",
          data: ledgerDetails
        };
      }
    } else if (checkComapnyUser.roleId && checkComapnyUser.roleId.name === "TMC") {
      let filter = {};

      //   if (userId !== undefined && userId.trim() !== "") {
      //     filter.userId = userId;
      // }

      if (transactionType !== undefined && transactionType.trim() !== "") {
        filter.transactionType = transactionType;
      }

      if (fromDate !== undefined && fromDate.trim() !== "" && toDate !== undefined && toDate.trim() !== "") {
        filter.transationDate = {
          $gte: new Date(fromDate + 'T00:00:00.000Z'), // Start of fromDate
          $lte: new Date(toDate + 'T23:59:59.999Z')    // End of toDate
        };
      } else if (fromDate !== undefined && fromDate.trim() !== "") {
        filter.transationDate = {
          $lte: new Date(fromDate + 'T23:59:59.999Z')  // End of fromDate
        };
      } else if (toDate !== undefined && toDate.trim() !== "") {
        filter.transationDate = {
          $gte: new Date(toDate + 'T00:00:00.000Z')    // Start of toDate
        };
      }
      const ledgerDetails = await ledger.find(filter).sort({ transationDate: -1 })
        .populate("userId").populate('companyId');
      if (!ledgerDetails || ledgerDetails.length === 0) {
        return {
          response: "Data Not Found",
        };
      } else {
        return {
          response: "Fetch Data Successfully",
          data: ledgerDetails
        };
      }
    }

  }



};

const transactionReport = async (req, res) => {
  const { agencyId, fromDate, toDate } = req.body;
  const getLedgerTransaction = await ledger.aggregate([{
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
      narration: "AUTO"
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

module.exports = {
  getAllledger, transactionReport
};
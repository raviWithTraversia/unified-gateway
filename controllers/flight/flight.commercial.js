const UserModule = require("../../models/User");
const Company = require("../../models/Company");
const agentConfig = require("../../models/AgentConfig");
const agencyGroup = require("../../models/AgencyGroup");
const commercialairplans = require("../../models/CommercialAirPlan");
const aircommercialsList = require("../../models/AirCommercial");
const aircommercialfilterincexcs = require("../../models/CommercialFilterExcludeIncludeList");
const updateaircommercialmatrixes = require("../../models/UpdateAirCommercialMatrix");
const incentivegroupmasters = require("../../models/IncentiveGroupMaster");
const incentivegrouphasincentivemasters = require("../../models/IncentiveGroupHasIncentiveMaster");
const plbgroupmasters = require("../../models/PLBGroupMaster");
const plbgrouphasplbmasters = require("../../models/PLBGroupHasPLBMaster");
const getApplyAllCommercial = async (Authentication, commonArray) => {
  const userDetails = await UserModule.findOne({ _id: Authentication.UserId });
  if (!userDetails) {
    return {
      IsSuccess: false,
      response: "User Id Not Available",
    };
  }

  const companyDetails = await Company.findOne({
    _id: userDetails.company_ID,
  }).populate("parent", "type");

  let commercialPlanDetails;
  let incentivePlanDetails;
  let plbPlanDetails;
  let markupDetails;
  if (companyDetails.type == "Agency" && companyDetails.parent.type == "TMC") {
    // TMC-Agency // // one time apply commertioal
    commercialPlanDetails = await getAssignCommercial(companyDetails._id);
    incentivePlanDetails = await getAssignIncentive(companyDetails._id);
    plbPlanDetails = await getAssignPlb(companyDetails._id);
    return plbPlanDetails;
  } else if (
    companyDetails.type == "Agency" &&
    companyDetails.parent.type == "Distributer"
  ) {
    // TMC-Distributer-Agency // Two time apply commertioal
    let commercialPlanDetailsForParent = await getAssignCommercial(
      companyDetails.parent._id
    );
    let incentivePlanDetailsForParent = await getAssignIncentive(companyDetails.parent._id);
    let plbPlanDetailsForParent = await getAssignPlb(companyDetails.parent._id);

    commercialPlanDetails = await getAssignCommercial(companyDetails._id);
    incentivePlanDetails = await getAssignIncentive(companyDetails._id);
    plbPlanDetails = await getAssignPlb(companyDetails._id);
    return commercialPlanDetails
  } else if (
    companyDetails.type == "Distributer" &&
    companyDetails.parent.type == "TMC"
  ) {
    // Distributer-TMC // one time apply commertioal
    commercialPlanDetails = await getAssignCommercial(companyDetails._id);
    incentivePlanDetails = await getAssignIncentive(companyDetails._id);
    plbPlanDetails = await getAssignPlb(companyDetails._id);
    return commercialPlanDetails;
  }

  return {
    IsSucess: true,
    response: commonArray,
  };
};



const getAssignCommercial = async (companyId) => {
  //// Get Commertial id , plb, incentive so on...
  let getAgentConfig = await agentConfig.findOne({
    companyId: companyId,
  }); // check config
  //return getAgentConfig;
  let commercialairplansVar = [];
  let combineAllCommercialArr = [];
  let aircommercialListVar;
  if (!getAgentConfig || getAgentConfig.commercialPlanIds === null) {
    getAgentConfig = await agencyGroup.findById(getAgentConfig.agencyGroupId);
    if (getAgentConfig) {
      // check from group privillage plan id
      commercialairplansVar = await commercialairplans
        .findOne({
          _id: getAgentConfig.commercialPlanId,
          status: true,
        })
        .select("_id commercialPlanName");
      aircommercialListVar = await aircommercialsList
        .find({
          commercialAirPlanId: commercialairplansVar._id,
        })
        .populate([
          {
            path: "carrier",
            select: "airlineCode",
          },
          {
            path: "supplier",
            select: "supplierCode",
          },
          {
            path: "source",
            select: "supplierCode",
          },
        ]);
      if (aircommercialListVar.length > 0) {
        let mappingData = aircommercialListVar.map(async (items) => {
          const aircommercialfilterincexcsVar =
            await aircommercialfilterincexcs.findOne({
              airCommercialId: items._id,
            });
          const updateaircommercialmatrixesVar =
            await updateaircommercialmatrixes.findOne({
              airCommercialPlanId: items._id,
            });

          return {
            _id: items._id,
            travelType: items.travelType,
            carrier: items.carrier.airlineCode,
            commercialCategory: items.commercialCategory,
            supplier: items.supplier.supplierCode,
            source: items.supplier.supplierCode,
            priority: items.priority,
            aircommercialfilterincexcs: aircommercialfilterincexcsVar,
            updateaircommercialmatrixes: updateaircommercialmatrixesVar,
          };
        });
        mappingData = await Promise.all(mappingData);
        combineAllCommercialArr.push({
          plan: commercialairplansVar,
          commercialFilterList: mappingData,
        });
      } else {
        return { IsSuccess: false, Message: "Commercial Not Available" };
      }
    } else {
      return { IsSuccess: false, Message: "Commercial Not Available" };
    }
  } else {
    // check Manuwal from config
    commercialairplansVar = await commercialairplans
      .findOne({
        _id: getAgentConfig.commercialPlanId,
        status: true,
      })
      .select("_id commercialPlanName");
    aircommercialListVar = await aircommercialsList
      .find({
        commercialAirPlanId: commercialairplansVar._id,
      })
      .populate([
        {
          path: "carrier",
          select: "_id airlineCode",
        },
        {
          path: "supplier",
          select: "supplierCode",
        },
        {
          path: "source",
          select: "supplierCode",
        },
      ]);
    if (aircommercialListVar.length > 0) {
      let mappingData = aircommercialListVar.map(async (items) => {
        const aircommercialfilterincexcsVar =
          await aircommercialfilterincexcs.findOne({
            airCommercialId: items._id,
          });
        const updateaircommercialmatrixesVar =
          await updateaircommercialmatrixes.findOne({
            airCommercialPlanId: items._id,
          });

        return {
          _id: items._id,
          travelType: items.travelType,
          carrier: items.carrier.airlineCode,
          commercialCategory: items.commercialCategory,
          supplier: items.supplier.supplierCode,
          source: items.supplier.supplierCode,
          priority: items.priority,
          aircommercialfilterincexcs: aircommercialfilterincexcsVar,
          updateaircommercialmatrixes: updateaircommercialmatrixesVar,
        };
      });
      mappingData = await Promise.all(mappingData);
      combineAllCommercialArr.push({
        plan: commercialairplansVar,
        commercialFilterList: mappingData,
      });
    } else {
      return { IsSuccess: false, Message: "Commercial Not Available" };
    }
  }
  if (!commercialairplansVar) {
    return { IsSuccess: false, Message: "No Commercial Air Plan Found" };
  }
  return { IsSuccess: true, data: combineAllCommercialArr };
};

const getAssignIncentive = async (companyId) => {
  //// Get Commertial id , plb, incentive so on...
  let getAgentConfig = await agentConfig.findOne({
    companyId: companyId,
  }); // check config
  //return getAgentConfig;
  let incentivegroupmastersVar = [];
  let incentiveListVar;
  if (!getAgentConfig || getAgentConfig.incentiveGroupIds === null) {
    getAgentConfig = await agencyGroup.findById(getAgentConfig.agencyGroupId);
    if (getAgentConfig) {
      // check from group incentive plan id
      // incentivegroupmastersVar = await incentivegroupmasters
      //   .findOne({
      //     _id: getAgentConfig.incentiveGroupId,
      //   })
      //   .select("_id incentiveGroupName");
      //return incentivegroupmastersVar;  
      incentiveListVar = await incentivegrouphasincentivemasters
        .find({
          incentiveGroupId: getAgentConfig.incentiveGroupId,
        }).populate('incentiveMasterId');

      if (incentiveListVar.length > 0) {
        return { IsSuccess: true, data: incentiveListVar };
      } else {
        return { IsSuccess: false, Message: "Incentive Not Available" };
      }
    } else {
      return { IsSuccess: false, Message: "Incentive Group Id  Not Available" };
    }
  } else {
    // check Manuwal from config
    // incentivegroupmastersVar = await incentivegroupmasters
    //   .findOne({
    //     _id: getAgentConfig.incentiveGroupIds

    //   })
    //   .select("_id incentiveGroupName");

    incentiveListVar = await incentivegrouphasincentivemasters
      .find({
        incentiveGroupId: getAgentConfig.incentiveGroupIds,
      })
      .populate('incentiveMasterId');

    if (incentiveListVar.length > 0) {
      return { IsSuccess: true, data: incentiveListVar };
    } else {
      return { IsSuccess: false, Message: "Incentive Not Available" };
    }
  }

};

const getAssignPlb = async (companyId) => {
  //// Get Commertial id , plb, incentive so on...
  let getAgentConfig = await agentConfig.findOne({
    companyId: companyId,
  }); // check config
  //return getAgentConfig;
  let plbgroupmastersVar = [];
  let plbListVar;
  if (!getAgentConfig || getAgentConfig.plbGroupIds === null) {
    getAgentConfig = await agencyGroup.findById(getAgentConfig.agencyGroupId);
    if (getAgentConfig) {
      // check from group incentive plan id
      // plbgroupmastersVar = await plbgroupmasters
      //   .findOne({
      //     _id: getAgentConfig.incentiveGroupId,
      //   })
      //   .select("_id PLBGroupName");
      //return incentivegroupmastersVar;  
      plbListVar = await plbgrouphasplbmasters
        .find({
          PLBGroupId: getAgentConfig.incentiveGroupId,
        }).populate('PLBMasterId');

      if (plbListVar.length > 0) {
        return { IsSuccess: true, data: plbListVar };
      } else {
        return { IsSuccess: false, Message: "PLB Group Not Available" };
      }
    } else {
      return { IsSuccess: false, Message: "PLB Group Id  Not Available" };
    }
  } else {
    // check Manuwal from config
    // plbgroupmastersVar = await plbgroupmasters
    //   .findOne({
    //     _id: getAgentConfig.plbGroupIds

    //   })
    //   .select("_id PLBGroupName");

    plbListVar = await plbgrouphasplbmasters
      .find({
        PLBGroupId: getAgentConfig.plbGroupIds,
      })
      .populate('PLBMasterId');

    if (plbListVar.length > 0) {
      return { IsSuccess: true, data: plbListVar };
    } else {
      return { IsSuccess: false, Message: "PLB Group Not Available" };
    }
  }
};

module.exports = {
  getApplyAllCommercial,
};

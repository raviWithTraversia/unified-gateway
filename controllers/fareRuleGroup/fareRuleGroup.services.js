const fareRuleGroupModels = require("../../models/FareRuleGroup");
const fareRuleModel = require("../../models/FareRules");
const Company = require("../../models/Company");
const agentConfig = require("../../models/AgentConfig");
const UserModule = require("../../models/User");
const agencyGroup = require("../../models/AgencyGroup");
const EventLogs=require('../logs/EventApiLogsCommon')
const user=require('../../models/User')

const addFareRuleGroup = async (req, res) => {
  try {
    let {
      fareRuleIds,
      fareRuleGroupName,
      fareRuleGroupDescription,
      companyId,
      isDefault,
    } = req.body;
    let fareRuleGroupNameExist = await fareRuleGroupModels.findOne({
      companyId,
      fareRuleGroupName,
    });
    if (fareRuleGroupNameExist) {
      return {
        response:
          "Fare rule group with the same name already exists for this company",
      };
    }
    if (isDefault === true) {
      let checkIsAnydefaultTrue = await fareRuleGroupModels.updateMany(
        { companyId },
        { isDefault: false }
      );
    }
    const newFareRuleGroup = new fareRuleGroupModels({
      fareRuleIds,
      fareRuleGroupName,
      fareRuleGroupDescription,
      companyId,
      modifyAt: new Date(),
      modifyBy: req.user._id,
      isDefault,
    });
    const saveFareRuleGroup = await newFareRuleGroup.save();
const userData= await user.findById(req.user._id)

    if (saveFareRuleGroup) {

      const LogsData={
        eventName:"GroupFareRules",
        doerId:req.user._id,
        doerName:userData.fname,
companyId:companyId,
        description:"Add FareRules For Group",
      }
     EventLogs(LogsData)
      return {
        response: "FareRule Group Added Sucessfully",
        data: saveFareRuleGroup,
      };
    } else {
      return {
        response: "FareRule Group Not Added",
      };
    }
  } catch (error) {
    console.log(error);
    throw console.error();
  }
};

const editFareRuleGroup = async (req, res) => {
  try {
    let { id } = req.query;
    let updateData = {
      ...req.body,
    };

    if (updateData?.isDefault === true) {
      let checkIsAnydefaultTrue = await fareRuleGroupModels.updateMany(
        { companyId: updateData.companyId },
        { isDefault: false }
      );
    }
    let updateFareRuleData = await fareRuleGroupModels.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        modifyAt: new Date(),
        modifyBy: req.user._id,
      },
      { new: true }
    );
const userData= await user.findById(req.user._id)

    if (updateFareRuleData) {
      //console.log(id);
      await agencyGroup.findOneAndUpdate(
        { companyId: updateData.companyId, isDefault: true },
        { fareRuleGroupId: id },
        { new: true }
      );
      const LogsData={
        eventName:"GroupFareRules",
        doerId:req.user._id,
        doerName:userData.fname,

        companyId:updateData.companyId,
        description:"Edit FareRules For Group",
      }
     EventLogs(LogsData)
      
      return {
        response: "Fare rule Updated Sucessfully",
        data: updateFareRuleData,
      };
    } else {
      return {
        response: "Fare rule Data Not Updated",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getCustomFareRule = async (req, res) => {
  const {
    UserId,
    origin,
    destination,
    provider,
    airlineCode,
    fareFamily,
    cabinclass,
    travelType,
    validDateFrom,
    validDateTo,
    rbd,
    fareBasis,
  } = req.body;
  const fieldNames = [
    "UserId",
    "origin",
    "destination",
    "provider",
    "airlineCode",
    "fareFamily",
    "cabinclass",
    "travelType",
    "validDateFrom",
    "validDateTo",
    "rbd",
    "fareBasis",
  ];
  const missingFields = fieldNames.filter(
    (field) => field === null || field === undefined
  );
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    return {
      response: null,
      isSometingMissing: true,
      data: `Missing or null fields: ${missingFieldsString}`,
    };
  }

  const userDetails = await UserModule.findOne({ _id: UserId });
  if (!userDetails) {
    return {
      IsSuccess: false,
      response: "User Id Not Available",
    };
  }
  const companyDetails = await Company.findOne({
    _id: userDetails.company_ID,
  }).populate("parent", "type");

  // Check if company Id exists
  if (!companyDetails) {
    return {
      response: "TMC Compnay id does not exist",
    };
  }
  const assignFareRuleGroup = await getAssignCommercial(
    companyDetails._id,
    req.body
  );

  return {
    response: "Fetch Data Successfully",
    data: assignFareRuleGroup,
  };
};
const getAssignCommercial = async (companyId, requestPayload) => {
  let getAgentConfig = await agentConfig.findOne({ companyId: companyId });

  if (!getAgentConfig || getAgentConfig.fareRuleGroupIds === null) {
    getAgentConfig = await agencyGroup.findById(getAgentConfig.agencyGroupId);

    if (getAgentConfig) {
      const fareRuleGroupVar = await fareRuleGroupModels
        .findOne({ _id: getAgentConfig.fareRuleGroupId })
        .populate({
          path: "fareRuleIds",
          populate: [
            { path: "providerId" },
            { path: "airlineCodeId" },
            { path: "fareFamilyId" },
            { path: "cabinclassId" },
          ],
        });

      if (!fareRuleGroupVar) {
        return "Fare Group Not Available";
      } else {
        const {
          origin,
          destination,
          provider,
          airlineCode,
          fareFamily,
          cabinclass,
          travelType,
          validDateFrom,
          validDateTo,
          rbd,
          fareBasis,
        } = requestPayload;

        const filteredFareRuleIds = fareRuleGroupVar.fareRuleIds.filter(
          (rule) => {
            return (
              rule.status === true &&
              (!origin || rule.origin === origin || rule.origin === "" || rule.origin === null) &&
              (!destination ||
                rule.destination === destination ||
                rule.destination === "" || rule.destination === null) &&
              (!provider ||
                (rule.providerId &&
                  rule.providerId.supplierCode === provider) ||
                rule.providerId === "" ||
                rule.providerId === null ||
                provider === "") &&
              (!airlineCode ||
                (rule.airlineCodeId &&
                  rule.airlineCodeId.airlineCode === airlineCode) ||
                rule.airlineCodeId === "" ||
                rule.airlineCodeId === null ||
                airlineCode === "") &&
              (!fareFamily ||
                rule.fareFamilyId?.fareFamilyCode === fareFamily ||
                rule.fareFamilyId === "" ||
                fareFamily === "") &&
              (!cabinclass ||
                rule.cabinclassId?.cabinClassCode === cabinclass ||
                rule.cabinclassId === "" ||
                cabinclass === "") &&
              (!travelType ||
                rule.travelType === travelType ||
                rule.travelType === "" ||
                travelType === "") &&
              (!validDateFrom ||
                new Date(rule.validDateFrom) >= new Date(validDateFrom) ||
                !rule.validDateFrom ||
                validDateFrom === "") &&
              (!validDateTo ||
                new Date(rule.validDateTo) <= new Date(validDateTo) ||
                !rule.validDateTo ||
                validDateTo === "") &&
              (!rbd || rule.rbd === rbd || rule.rbd === "" || rbd === "") &&
              (!fareBasis ||
                rule.fareBasis === fareBasis ||
                rule.fareBasis === "" ||
                fareBasis === "")
            );
          }
        );

        const descriptions = filteredFareRuleIds.map((rule) => ({
          DESC: rule?.desceription ?? "",
          CBHA: rule?.CBHA ?? "",
          CWBHA: rule?.CWBHA ?? "",
          RBHA: rule?.RBHA ?? "",
          RWBHA: rule?.RWBHA ?? "",
          SF: rule?.SF ?? "",
        }));
        return descriptions[0] ?? null;
      }
    } else {
      return "Fare Group Not Available";
    }
  } else {
    const fareRuleGroupVar = await fareRuleGroupModels
      .findOne({ _id: getAgentConfig.fareRuleGroupIds })
      .populate({
        path: "fareRuleIds",
        populate: [
          { path: "providerId" },
          { path: "airlineCodeId" },
          { path: "fareFamilyId" },
          { path: "cabinclassId" },
        ],
      });

    if (!fareRuleGroupVar) {
      return "Fare Group Not Available";
    } else {
      const {
        origin,
        destination,
        provider,
        airlineCode,
        fareFamily,
        cabinclass,
        travelType,
        validDateFrom,
        validDateTo,
        rbd,
        fareBasis,
      } = requestPayload;

      const filteredFareRuleIds = fareRuleGroupVar.fareRuleIds.filter(
        (rule) => {
          console.log(rule.rbd);
          console.log(cabinclass);
          return (
            rule.status === true &&
            (!origin || rule.origin === origin || rule.origin === "" || rule.origin === null) &&
            (!destination ||
              rule.destination === destination ||
              rule.destination === "" || rule.destination === null) &&
            (!provider ||
              (rule.providerId && rule.providerId.supplierCode === provider) ||
              rule.providerId === "" ||
              rule.providerId === null ||
              provider === "") &&
            (!airlineCode ||
              (rule.airlineCodeId &&
                rule.airlineCodeId.airlineCode === airlineCode) ||
              rule.airlineCodeId === "" ||
              rule.airlineCodeId === null ||
              airlineCode === "") &&
            (!fareFamily ||
              rule.fareFamilyId?.fareFamilyCode === fareFamily ||
              rule.fareFamilyId === "" ||
              fareFamily === "") &&
            (!cabinclass ||
              rule.cabinclassId?.cabinClassCode === cabinclass ||
              rule.cabinclassId === "" ||
              cabinclass === "") &&
            (!travelType ||
              rule.travelType === travelType ||
              rule.travelType === "" ||
              travelType === "") &&
            (!validDateFrom ||
              new Date(rule.validDateFrom) >= new Date(validDateFrom) ||
              !rule.validDateFrom ||
              validDateFrom === "") &&
            (!validDateTo ||
              new Date(rule.validDateTo) <= new Date(validDateTo) ||
              !rule.validDateTo ||
              validDateTo === "") &&
            (!rbd || rule.rbd === rbd || rule.rbd === "" || rbd === "") &&
            (!fareBasis ||
              rule.fareBasis === fareBasis ||
              rule.fareBasis === "" ||
              fareBasis === "")
          );
        }
      );      
      const descriptions = filteredFareRuleIds.map((rule) => ({
        DESC: rule?.desceription ?? "",
        CBHA: rule?.CBHA ?? "",
        CWBHA: rule?.CWBHA ?? "",
        RBHA: rule?.RBHA ?? "",
        RWBHA: rule?.RWBHA ?? "",
        SF: rule?.SF ?? "",
      }));
      return descriptions[0] ?? null;
    }
  }
};

// const getAssignCommercial = async (companyId) => {
//   //// Get Commertial id , plb, incentive so on...
//   let getAgentConfig = await agentConfig.findOne({
//     companyId: companyId,
//   }); // check config
//   // console.log(getAgentConfig);
//   //return getAgentConfig;

//   let fareRuleGroupVar = [];
//   if (!getAgentConfig || getAgentConfig.fareRuleGroupIds === null) {
//     getAgentConfig = await agencyGroup.findById(getAgentConfig.agencyGroupId);

//     if (getAgentConfig) {
//       // check from group privillage plan id
//       fareRuleGroupVar = await fareRuleGroupModels
//         .findOne({
//           _id: getAgentConfig.fareRuleGroupId,
//         }).populate({
//           path: 'fareRuleIds',
//           populate: [
//               { path: 'providerId' },
//               { path: 'airlineCodeId' }
//           ]
//       });
//       if (!fareRuleGroupVar) {
//         return  "Fare Group Not Available";
//       }else{
//         return fareRuleGroupVar;
//       }

//     } else {
//       return "Fare Group Not Available";
//     }
//   } else {
//     // check Manuwal from config
//     //return getAgentConfig
//     fareRuleGroupVar = await fareRuleGroupModels
//       .findOne({
//         _id: getAgentConfig.fareRuleGroupIds
//       }).populate({
//         path: 'fareRuleIds',
//         populate: [
//             { path: 'providerId' },
//             { path: 'airlineCodeId' },
//             { path: 'fareFamilyId' },
//             { path: 'cabinclassId' },
//         ]
//     });
//     if (!fareRuleGroupVar) {
//       return "Fare Group Not Available";
//     }else{
//       return fareRuleGroupVar;
//     }

//   }

//  // return { IsSuccess: true, data: combineAllCommercialArr };
// };
const getFareRuleGroup = async (req, res) => {
  try {
    const { ObjectId } = require("mongoose").Types;
    let companyId = req.query.companyId;
    let getFareRule;
    try {
      getFareRule = await fareRuleGroupModels.find({ companyId: companyId });
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>", getFareRule, "<<<<<<<<<<<");

      for (let i = 0; i < getFareRule.length; i++) {
        let convertedFareRuleIds = getFareRule[i].fareRuleIds.map((id) =>
          id.toString()
        );
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", convertedFareRuleIds);

        let documents = await fareRuleModel
          .find({ _id: { $in: convertedFareRuleIds } })
          .populate("providerId", "supplierCode")
          .populate("airlineCodeId", "airlineCode airlineName")
          .populate("fareFamilyId", "fareFamilyCode fareFamilyName")
          .populate("cabinclassId", "cabinClassCode cabinClassName")
          .exec();
        getFareRule[i].fareRuleIds = documents;
      }
    } catch (err) {
      retur;
      console.error(err);
    }
    if (getFareRule) {
      return {
        response: "Fare Rule Fetch Sucessfully",
        data: getFareRule,
      };
    } else {
      return {
        response: "Fare Rule Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteFareRuleGroup = async (req, res) => {
  try {
    let id = req.query.id;
    let deleteData = await fareRuleGroupModels.findByIdAndDelete(id);
const userData= await user.findById(req.user._id)

    if (deleteData) {

      const LogsData={
        eventName:"GroupFareRules",
        doerId:req.user._id,
        doerName:userData.fname,
companyId:deleteData.companyId,
        description:"Delete FareRules For Group",
      }
     EventLogs(LogsData)
      return {
        response: "Data deleted sucessfully",
      };
    } else {
      return {
        response: "Farerule Group data not found for this id",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addFareRuleGroup,
  editFareRuleGroup,
  getFareRuleGroup,
  deleteFareRuleGroup,
  getCustomFareRule,
};

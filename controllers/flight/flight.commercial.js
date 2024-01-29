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
const managemarkupsimport = require("../../models/ManageMarkup");
//const countryMaping = require("../../models/");
const moment = require("moment");

const getApplyAllCommercial = async (
  Authentication,
  TravelType,
  commonArray
) => {
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

  // let incentivePlanDetails;
  // let plbPlanDetails;
  let checkInnerFilterfun = null;
  let applyResponceCommercialArray = [];
  let groupPriority;
  let bestMatch = null;
  if (companyDetails.type == "Agency" && companyDetails.parent.type == "TMC") {
    // TMC-Agency // // one time apply commertioal
    // commercialPlanDetails = await getAssignCommercial(companyDetails._id);
    // incentivePlanDetails = await getAssignIncentive(companyDetails._id);
    // plbPlanDetails = await getAssignPlb(companyDetails._id);
    // markupDetails = await getAssignMarcup(companyDetails._id);

    const [
      commercialPlanDetails,
      incentivePlanDetails,
      plbPlanDetails,
      markupDetails,
    ] = await Promise.all([
      getAssignCommercial(companyDetails._id),
      getAssignIncentive(companyDetails._id),
      getAssignPlb(companyDetails._id),
      getAssignMarcup(companyDetails._id),
    ]);

    const commonArrayDummy = [
      {
        UID: "4431439e-2aa6-4a7e-9e93-9ed9e996a854",
        BaseFare: 24288,
        Taxes: 4945,
        TotalPrice: 29233,
        ExtraCharges: 0,
        TaxMarkUp: 0,
        MarkUp: 0,
        Commission: 0,
        Fees: 0,
        BookingFees: 0,
        ServiceFee: 0,
        CancellationFees: 0,
        RescheduleFees: 0,
        AdminFees: 0,
        Discount: 0,
        TDS: 0,
        BaseCharges: 0,
        SupplierDiscount: 0,
        SupplierDiscountPercent: 0,
        GrandTotal: 29233,
        Currency: "INR",
        FareType: "Economy",
        TourCode: "",
        PricingMethod: "Guaranteed",
        FareFamily: "GAL_PCC_AI",
        PromotionalFare: false,
        FareFamilyDN: null,
        PromotionalCode: "",
        PromoCodeType: "",
        RefundableFare: true,
        IndexNumber: 0,
        Provider: "Kafila",
        ValCarrier: "SG",
        LastTicketingDate: "",
        TravelTime: "1d:0h:50m",
        PriceBreakup: [
          {
            PassengerType: "ADT",
            NoOfPassenger: 3,
            Tax: 999,
            BaseFare: 5060,
            MarkUp: 0,
            TaxMarkUp: 0,
            Commission: 0,
            Fees: 0,
            BookingFees: 0,
            CancellationFees: 0,
            RescheduleFees: 0,
            AdminFees: 0,
            TDS: 0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            Key: null,
          },
          {
            PassengerType: "CHD",
            NoOfPassenger: 2,
            Tax: 974,
            BaseFare: 4554,
            MarkUp: 0,
            TaxMarkUp: 0,
            Commission: 0,
            Fees: 0,
            BookingFees: 0,
            CancellationFees: 0,
            RescheduleFees: 0,
            AdminFees: 0,
            TDS: 0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            Key: null,
          },
          {},
        ],
        Sectors: [
          {
            IsConnect: false,
            AirlineCode: "AI",
            AirlineName: "AirIndia",
            Class: "S",
            CabinClass: "Economy",
            BookingCounts: "",
            NoSeats: 9,
            FltNum: "839",
            EquipType: "32N",
            FlyingTime: "0d:2h:15m",
            TravelTime: "0d:2h:15m",
            TechStopOver: 1,
            Status: "",
            OperatingCarrier: null,
            MarketingCarrier: null,
            BaggageInfo: "20 Kilograms",
            HandBaggage: "7 KG",
            TransitTime: null,
            MealCode: null,
            Key: "",
            Distance: "708",
            ETicket: "No",
            ChangeOfPlane: "",
            ParticipantLevel: "",
            OptionalServicesIndicator: false,
            AvailabilitySource: "",
            Group: "0",
            LinkAvailability: "true",
            PolledAvailabilityOption: "",
            FareBasisCode: "SEPP",
            HostTokenRef: "",
            APISRequirementsRef: "",
            Departure: {
              Terminal: "3",
              Date: "2024-02-11",
              Time: "21:30",
              Day: null,
              DateTimeStamp: "2024-02-11T21:30:00.000+05:30",
              Code: "DEL",
              Name: "Delhi Indira Gandhi Intl",
              CityCode: "DEL",
              CityName: "Delhi",
              CountryCode: "IN",
              CountryName: "India",
            },
            Arrival: {
              Terminal: "",
              Date: "2024-02-11",
              Time: "23:45",
              Day: null,
              DateTimeStamp: "2024-02-11T23:45:00.000+05:30",
              Code: "HYD",
              Name: "Shamshabad Rajiv Gandhi Intl Arpt",
              CityCode: "HYD",
              CityName: "Hyderabad",
              CountryCode: "IN",
              CountryName: "India",
            },
          },
          {
            IsConnect: false,
            AirlineCode: "AI",
            AirlineName: "AirIndia",
            Class: "S",
            CabinClass: "Economy",
            BookingCounts: "",
            NoSeats: 9,
            FltNum: "587",
            EquipType: "359",
            FlyingTime: "0d:1h:10m",
            TravelTime: "0d:1h:10m",
            TechStopOver: 1,
            Status: "",
            OperatingCarrier: null,
            MarketingCarrier: null,
            BaggageInfo: "20 Kilograms",
            HandBaggage: "7 KG",
            TransitTime: null,
            MealCode: null,
            Key: "",
            Distance: "708",
            ETicket: "No",
            ChangeOfPlane: "",
            ParticipantLevel: "",
            OptionalServicesIndicator: false,
            AvailabilitySource: "",
            Group: "0",
            LinkAvailability: "true",
            PolledAvailabilityOption: "",
            FareBasisCode: "SEPP",
            HostTokenRef: "",
            APISRequirementsRef: "",
            Departure: {
              Terminal: "",
              Date: "2024-02-12",
              Time: "21:10",
              Day: null,
              DateTimeStamp: "2024-02-12T21:10:00.000+05:30",
              Code: "HYD",
              Name: "Shamshabad Rajiv Gandhi Intl Arpt",
              CityCode: "HYD",
              CityName: "Hyderabad",
              CountryCode: "IN",
              CountryName: "India",
            },
            Arrival: {
              Terminal: "2",
              Date: "2024-02-12",
              Time: "22:20",
              Day: null,
              DateTimeStamp: "2024-02-12T22:20:00.000+05:30",
              Code: "BLR",
              Name: "Bengaluru Intl Arpt",
              CityCode: "BLR",
              CityName: "Bengaluru",
              CountryCode: "IN",
              CountryName: "India",
            },
          },
        ],
        HostTokens: null,
        Key: "",
        SearchID: "",
        TRCNumber: null,
        TraceId: "12343253",
      },
      {
        UID: "a981ed02-945b-4610-b16c-1ae7134ccbd9",
        BaseFare: 28512,
        Taxes: 4265,
        TotalPrice: 32777,
        ExtraCharges: 0,
        TaxMarkUp: 0,
        MarkUp: 0,
        Commission: 0,
        Fees: 0,
        BookingFees: 0,
        ServiceFee: 0,
        CancellationFees: 0,
        RescheduleFees: 0,
        AdminFees: 0,
        Discount: 0,
        TDS: 0,
        BaseCharges: 0,
        SupplierDiscount: 0,
        SupplierDiscountPercent: 0,
        GrandTotal: 32777,
        Currency: "INR",
        FareType: "Economy",
        TourCode: "",
        PricingMethod: "Guaranteed",
        FareFamily: "GAL_PCC_AI",
        PromotionalFare: false,
        FareFamilyDN: null,
        PromotionalCode: "",
        PromoCodeType: "",
        RefundableFare: true,
        IndexNumber: 1,
        Provider: "Kafila",
        ValCarrier: "SS",
        LastTicketingDate: "",
        TravelTime: "0d:2h:55m",
        PriceBreakup: [
          {
            PassengerType: "ADT",
            NoOfPassenger: 3,
            Tax: 865,
            BaseFare: 5940,
            MarkUp: 0,
            TaxMarkUp: 0,
            Commission: 0,
            Fees: 0,
            BookingFees: 0,
            CancellationFees: 0,
            RescheduleFees: 0,
            AdminFees: 0,
            TDS: 0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            Key: null,
          },
          {
            PassengerType: "CHD",
            NoOfPassenger: 2,
            Tax: 835,
            BaseFare: 5346,
            MarkUp: 0,
            TaxMarkUp: 0,
            Commission: 0,
            Fees: 0,
            BookingFees: 0,
            CancellationFees: 0,
            RescheduleFees: 0,
            AdminFees: 0,
            TDS: 0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            Key: null,
          },
          {},
        ],
        Sectors: [
          {
            IsConnect: false,
            AirlineCode: "AI",
            AirlineName: "AirIndia",
            Class: "T",
            CabinClass: "Economy",
            BookingCounts: "",
            NoSeats: 9,
            FltNum: "803",
            EquipType: "321",
            FlyingTime: "0d:2h:55m",
            TravelTime: "0d:2h:55m",
            TechStopOver: 1,
            Status: "",
            OperatingCarrier: null,
            MarketingCarrier: null,
            BaggageInfo: "20 Kilograms",
            HandBaggage: "7 KG",
            TransitTime: null,
            MealCode: null,
            Key: "",
            Distance: "708",
            ETicket: "No",
            ChangeOfPlane: "",
            ParticipantLevel: "",
            OptionalServicesIndicator: false,
            AvailabilitySource: "",
            Group: "0",
            LinkAvailability: "true",
            PolledAvailabilityOption: "",
            FareBasisCode: "TIPYL",
            HostTokenRef: "",
            APISRequirementsRef: "",
            Departure: {
              Terminal: "3",
              Date: "2024-02-11",
              Time: "06:00",
              Day: null,
              DateTimeStamp: "2024-02-11T06:00:00.000+05:30",
              Code: "DEL",
              Name: "Delhi Indira Gandhi Intl",
              CityCode: "DEL",
              CityName: "Delhi",
              CountryCode: "IN",
              CountryName: "India",
            },
            Arrival: {
              Terminal: "2",
              Date: "2024-02-11",
              Time: "08:55",
              Day: null,
              DateTimeStamp: "2024-02-11T08:55:00.000+05:30",
              Code: "BLR",
              Name: "Bengaluru Intl Arpt",
              CityCode: "BLR",
              CityName: "Bengaluru",
              CountryCode: "IN",
              CountryName: "India",
            },
          },
        ],
        HostTokens: null,
        Key: "",
        SearchID: "",
        TRCNumber: null,
        TraceId: "12343253",
      },
    ];

    //for (const singleFlightDetails of commonArray) {
    for (const singleFlightDetails of commonArrayDummy) {
      // Check Commertial status and Commertial Apply
      if (commercialPlanDetails.IsSuccess === true) {
        // get group of priority base
        groupPriority = await makePriorityGroup(
          TravelType,
          singleFlightDetails,
          commercialPlanDetails
        );
        if (groupPriority.length > 0) {
          for (let i = 0; i < groupPriority.length; i++) {
            const commList = groupPriority[i];
            if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket"
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                bestMatch = checkInnerFilterfun;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket"
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                bestMatch = checkInnerFilterfun;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.ValCarrier &&
              commList.commercialCategory === "Ticket"
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                bestMatch = checkInnerFilterfun;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket"
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                bestMatch = checkInnerFilterfun;
                break;
              }
            }
          }
          if (bestMatch) {
            singleFlightDetails.bestMatch = bestMatch;
          }
        }
      }

      //  updateObjofsingleflight // this is update object with the apply commertial then apply incentive in below and then last push this update object in applyResponceCommercialArray.push({ updateObjofsingleflight });
      // this is last update and push function
      applyResponceCommercialArray.push(singleFlightDetails);
    }
    return applyResponceCommercialArray;
    //return commercialPlanDetails;
  } else if (
    companyDetails.type == "Agency" &&
    companyDetails.parent.type == "Distributer"
  ) {
    // TMC-Distributer-Agency // Two time apply commertioal
    let commercialPlanDetailsForParent = await getAssignCommercial(
      companyDetails.parent._id
    );
    let incentivePlanDetailsForParent = await getAssignIncentive(
      companyDetails.parent._id
    );
    let plbPlanDetailsForParent = await getAssignPlb(companyDetails.parent._id);

    commercialPlanDetails = await getAssignCommercial(companyDetails._id);
    incentivePlanDetails = await getAssignIncentive(companyDetails._id);
    plbPlanDetails = await getAssignPlb(companyDetails._id);
    markupDetails = await getAssignMarcup(companyDetails._id);
    return commonArray;
  } else if (
    companyDetails.type == "Distributer" &&
    companyDetails.parent.type == "TMC"
  ) {
    // Distributer-TMC // one time apply commertioal
    commercialPlanDetails = await getAssignCommercial(companyDetails._id);
    incentivePlanDetails = await getAssignIncentive(companyDetails._id);
    plbPlanDetails = await getAssignPlb(companyDetails._id);
    return commonArray;
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
          const aircommercialfilterincexcsVar = await aircommercialfilterincexcs
            .findOne({
              airCommercialId: items._id,
            })
            .populate("commercialFilter.commercialFilterId");
          const updateaircommercialmatrixesVar =
            await updateaircommercialmatrixes.findOne({
              airCommercialPlanId: items._id,
            });

          return {
            _id: items._id,
            travelType: items.travelType,
            carrier: items.carrier ? items.carrier.airlineCode : null,
            commercialCategory: items.commercialCategory,
            supplier: items.supplier ? items.supplier.supplierCode : null,
            source: items.supplier ? items.supplier.supplierCode : null,
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
    //return getAgentConfig
    commercialairplansVar = await commercialairplans
      .findOne({
        _id: getAgentConfig.commercialPlanIds,
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
        //return items
        const aircommercialfilterincexcsVar = await aircommercialfilterincexcs
          .findOne({
            airCommercialId: items._id,
          })
          .populate("commercialFilter.commercialFilterId");
        const updateaircommercialmatrixesVar = await updateaircommercialmatrixes
          .findOne({ airCommercialPlanId: items._id })
          .populate("data.AirCommertialRowMasterId")
          .populate("data.AirCommertialColumnMasterId");

        return {
          _id: items._id,
          travelType: items.travelType,
          carrier: items.carrier ? items.carrier.airlineCode : null,
          commercialCategory: items.commercialCategory,
          supplier: items.supplier ? items.supplier.supplierCode : null,
          source: items.supplier ? items.supplier.supplierCode : null,
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
        })
        .populate("incentiveMasterId");

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
      .populate("incentiveMasterId");

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
        })
        .populate("PLBMasterId");

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
      .populate("PLBMasterId");

    if (plbListVar.length > 0) {
      return { IsSuccess: true, data: plbListVar };
    } else {
      return { IsSuccess: false, Message: "PLB Group Not Available" };
    }
  }
};

const getAssignMarcup = async (companyId) => {
  let getmarkupData = await managemarkupsimport.find({
    companyId: companyId,
  });

  if (getmarkupData.length > 0) {
    return { IsSuccess: true, data: getmarkupData };
  } else {
    return { IsSuccess: false, Message: "Markup Not Available" };
  }
};

const checkInnerFilter = async (commList, singleFlightDetails, companyId) => {
  let bestMatch = true;

  // DeptDate filter start here
  const returnDeptDateExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "DeptDate" &&
        filter.type === "exclude" &&
        filter.valueType === "date" &&
        filter.value != null && 
        filter.value != ""
    );
  const returnDeptDateInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "DeptDate" &&
        filter.type === "include" &&
        filter.valueType === "date" &&
        filter.value != null && 
        filter.value != ""
    );

  if (returnDeptDateInclude) {
    const returnDeptDateIncludeValue = returnDeptDateInclude.value;
    const [startDateInclude, endDateInclude] =
      returnDeptDateIncludeValue.split(" - ");
    if (
      moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") >=
      moment(startDateInclude, "DD/MM/YYYY") &&
      moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") <=
      moment(endDateInclude, "DD/MM/YYYY")
    ) {
      //The mandate date is within the range
      bestMatch = true;
    } else {
      //The mandate date is outside the range
      bestMatch = false;
    }
  }

  if (returnDeptDateExclude) {
    const returnDeptDateExcludeValue = returnDeptDateExclude.value;
    const [startDateExclude, endDateExclude] =
      returnDeptDateExcludeValue.split(" - ");
    if (
      moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") >=
      moment(startDateExclude, "DD/MM/YYYY") &&
      moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") <=
      moment(endDateExclude, "DD/MM/YYYY")
    ) {
      //The mandate date is within the range
      bestMatch = false;
    } else {
      //The mandate date is outside the range
      bestMatch = true;
    }
  }

  // AllAirport filter start here...
  const allAirportInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "AllAirport" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null && 
        filter.value != ""
    );
   
    const allAirportExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "AllAirport" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null && 
        filter.value != ""
    ); 
    
    if (allAirportInclude) {
      const allAirportIncludeIncludeValue = allAirportInclude.value.split(',');
      if (allAirportIncludeIncludeValue.includes(singleFlightDetails.Sectors[0].Departure.CountryCode)) { 
        // country code exists  IN, US
        bestMatch = true; 
      } else {
        // does not exists country code Then Check Airport Code DEL,BOM
        if (allAirportIncludeIncludeValue.includes(singleFlightDetails.Sectors[0].Departure.Code)) {
          // Airport exits
          bestMatch = true; 
        }else{
          // Airport Not exits
          // Get country group 
          //countryMaping
          if (allAirportIncludeIncludeValue.includes(singleFlightDetails.Sectors[0].Departure.CountryCode)) {
            // Country Code Group Exists
            bestMatch = true; 
          }else{
            // Country Code Group Not Exits
            bestMatch = false; 
          }
        }
      }
    }


  // here send responce true and false if true share with data  if bestmatch is true apply values filters
  if (bestMatch === true) {
    return { match: true, data: commList };
  } else {
    return { match: false, data: null };
  }
};

const makePriorityGroup = async (
  TravelType,
  singleFlightDetails,
  commercialPlanDetails
) => {
  let groupedMatches = {};

  for (
    let i = 0;
    i < commercialPlanDetails.data[0].commercialFilterList.length;
    i++
  ) {
    const commList = commercialPlanDetails.data[0].commercialFilterList[i];
    // outer Filter check with periority
    if (
      TravelType === commList.travelType &&
      commList.carrier === singleFlightDetails.ValCarrier &&
      commList.source === singleFlightDetails.Provider &&
      commList.commercialCategory === "Ticket"
    ) {
      const groupKey = `${TravelType}-${commList.carrier}-${commList.source}-${commList.commercialCategory}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === null &&
      commList.source === singleFlightDetails.Provider &&
      commList.commercialCategory === "Ticket"
    ) {
      const groupKey = `${TravelType}-${commList.source}-${commList.commercialCategory}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === singleFlightDetails.ValCarrier &&
      commList.source === null &&
      commList.commercialCategory === "Ticket"
    ) {
      const groupKey = `${TravelType}-${commList.carrier}-${commList.commercialCategory}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === null &&
      commList.source === null &&
      commList.commercialCategory === "Ticket"
    ) {
      const groupKey = `${TravelType}-${commList.commercialCategory}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    }
  }

  let mergedArray = [];
  for (const groupKey in groupedMatches) {
    if (groupedMatches.hasOwnProperty(groupKey)) {
      const group = groupedMatches[groupKey];
      // Sort the group based on priority
      group.sort((a, b) => a.priority - b.priority);
      mergedArray = mergedArray.concat(group);
      //console.log(group);
    }
  }
  return mergedArray;
};

module.exports = {
  getApplyAllCommercial,
};

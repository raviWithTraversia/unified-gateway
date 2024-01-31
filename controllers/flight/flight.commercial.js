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
const countryMaping = require("../../models/CountryMapping");
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
  let commertialMatrixValueHandle = null;
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
                Amount: 100,
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
                Amount: 100,
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
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails
                );
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
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
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails
                );
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
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
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails
                );
                //bestMatch = commertialMatrixValueHandle;
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
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
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            }
          }
          if (commertialMatrixValueHandle) {
            singleFlightDetails.PriceBreakup = commertialMatrixValueHandle;
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
  let dataPrint;
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
        filter.value != "" &&
        singleFlightDetails.Sectors[0].Departure.CountryCode != null &&
        singleFlightDetails.Sectors[0].Departure.CountryCode != ""
    );

  const allAirportExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "AllAirport" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].Departure.CountryCode != null &&
        singleFlightDetails.Sectors[0].Departure.CountryCode != ""
    );

  if (allAirportInclude) {
    const allAirportIncludeIncludeValue = allAirportInclude.value.split(",");
    if (
      allAirportIncludeIncludeValue.includes(
        singleFlightDetails.Sectors[0].Departure.CountryCode
      )
    ) {
      // country code exists  IN, US
      bestMatch = true;
    } else {
      // does not exists country code Then Check Airport Code DEL,BOM
      if (
        allAirportIncludeIncludeValue.includes(
          singleFlightDetails.Sectors[0].Departure.Code
        )
      ) {
        // Airport exits
        bestMatch = true;
      } else {
        // Airport Not exits
        // Get country group
        const countryMapingVal = await countryMaping.findOne({
          companyId: companyId,
          ContinentCode: { $in: allAirportIncludeIncludeValue },
        });
        if (
          countryMapingVal &&
          countryMapingVal.countries &&
          countryMapingVal.countries.length > 0
        ) {
          if (
            countryMapingVal.countries
              .split(",")
              .includes(singleFlightDetails.Sectors[0].Departure.CountryCode)
          ) {
            // Country Code Group Exists
            bestMatch = true;
          } else {
            // Country Code Group Not Exits
            bestMatch = false;
          }
        } else {
          bestMatch = false;
        }
      }
    }
  }

  if (allAirportExclude) {
    const allAirportExcludeValue = allAirportExclude.value.split(",");
    if (
      allAirportExcludeValue.includes(
        singleFlightDetails.Sectors[0].Departure.CountryCode
      )
    ) {
      // country code exists  IN, US
      bestMatch = false;
    } else {
      // does not exists country code Then Check Airport Code DEL,BOM
      if (
        allAirportExcludeValue.includes(
          singleFlightDetails.Sectors[0].Departure.Code
        )
      ) {
        // Airport exits
        bestMatch = false;
      } else {
        // Airport Not exits
        // Get country group
        const countryMapingVal = await countryMaping.findOne({
          companyId: companyId,
          ContinentCode: { $in: allAirportExcludeValue },
        });
        if (
          countryMapingVal &&
          countryMapingVal.countries &&
          countryMapingVal.countries.length > 0
        ) {
          if (
            countryMapingVal.countries
              .split(",")
              .includes(singleFlightDetails.Sectors[0].Departure.CountryCode)
          ) {
            // Country Code Group Exists
            bestMatch = false;
          } else {
            // Country Code Group Not Exits
            bestMatch = true;
          }
        } else {
          bestMatch = true;
        }
      }
    }
  }

  // Start Booking Date Filter Here
  const bookingDateExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "BookingDate" &&
        filter.type === "exclude" &&
        filter.valueType === "date" &&
        filter.value != null &&
        filter.value != ""
    );
  const bookingDateInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "BookingDate" &&
        filter.type === "include" &&
        filter.valueType === "date" &&
        filter.value != null &&
        filter.value != ""
    );

  if (bookingDateInclude) {
    const bookingDateIncludeValue = bookingDateInclude.value;
    const [startBookingDateInclude, endBookingDateInclude] =
      bookingDateIncludeValue.split(" - ");
    const currentDate = moment();
    if (
      currentDate >= moment(startBookingDateInclude, "DD/MM/YYYY") &&
      currentDate <= moment(endBookingDateInclude, "DD/MM/YYYY")
    ) {
      //The mandate date is within the range
      bestMatch = true;
    } else {
      //The mandate date is outside the range
      bestMatch = false;
    }
  }

  if (bookingDateExclude) {
    const bookingDateExcludeValue = bookingDateExclude.value;
    const [startBookingDateExclude, endBookingDateExclude] =
      bookingDateExcludeValue.split(" - ");
    const currentDate = moment();
    if (
      currentDate >= moment(startBookingDateExclude, "DD/MM/YYYY") &&
      currentDate <= moment(endBookingDateExclude, "DD/MM/YYYY")
    ) {
      //The mandate date is within the range
      bestMatch = false;
    } else {
      //The mandate date is outside the range
      bestMatch = true;
    }
  }

  // Marketing Carrier (ValCarrier) Filter start Here
  const marketingCarrierInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "MarketingCarrier(Val)" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.ValCarrier != null &&
        singleFlightDetails.ValCarrier != ""
    );

  const marketingCarrierExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "MarketingCarrier(Val)" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.ValCarrier != null &&
        singleFlightDetails.ValCarrier != ""
    );

  if (marketingCarrierInclude) {
    const marketingCarrierIncludeValue =
      marketingCarrierInclude.value.split(",");
    if (marketingCarrierIncludeValue.includes(singleFlightDetails.ValCarrier)) {
      bestMatch = true;
    } else {
      bestMatch = false;
    }
  }

  if (marketingCarrierExclude) {
    const marketingCarrierExcludeValue =
      marketingCarrierExclude.value.split(",");
    if (marketingCarrierExcludeValue.includes(singleFlightDetails.ValCarrier)) {
      bestMatch = false;
    } else {
      bestMatch = true;
    }
  }

  // Operating Carrier start here
  const operatingCarrierInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "OperatingCarrier" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].OperatingCarrier != null &&
        singleFlightDetails.Sectors[0].OperatingCarrier != ""
    );

  const operatingCarrierExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "OperatingCarrier" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].OperatingCarrier != null &&
        singleFlightDetails.Sectors[0].OperatingCarrier != ""
    );

  if (operatingCarrierInclude) {
    const operatingCarrierIncludeValue =
      operatingCarrierInclude.value.split(",");
    if (
      operatingCarrierIncludeValue.includes(
        singleFlightDetails.Sectors[0].OperatingCarrier
      )
    ) {
      bestMatch = true;
    } else {
      bestMatch = false;
    }
  }

  if (operatingCarrierExclude) {
    const operatingCarrierExcludeValue =
      operatingCarrierExclude.value.split(",");
    if (
      operatingCarrierExcludeValue.includes(
        singleFlightDetails.Sectors[0].OperatingCarrier
      )
    ) {
      bestMatch = false;
    } else {
      bestMatch = true;
    }
  }

  // Tour Code filter here
  const tourCodeInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "TourCode" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.TourCode != null &&
        singleFlightDetails.TourCode != ""
    );

  const tourCodeExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "TourCode" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.TourCode != null &&
        singleFlightDetails.TourCode != ""
    );

  if (tourCodeInclude) {
    const tourCodeIncludeValue = tourCodeInclude.value.split(",");
    if (tourCodeIncludeValue.includes(singleFlightDetails.TourCode)) {
      bestMatch = true;
    } else {
      bestMatch = false;
    }
  }

  if (tourCodeExclude) {
    const tourCodeExcludeValue = tourCodeExclude.value.split(",");
    if (tourCodeExcludeValue.includes(singleFlightDetails.TourCode)) {
      bestMatch = false;
    } else {
      bestMatch = true;
    }
  }

  // Fare Basis Code Filter start Here
  const fareBasisInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "FareBasis" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].FareBasisCode != null &&
        singleFlightDetails.Sectors[0].FareBasisCode != ""
    );

  const fareBasisExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "FareBasis" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].FareBasisCode != null &&
        singleFlightDetails.Sectors[0].FareBasisCode != ""
    );

  if (fareBasisInclude) {
    const fareBasisIncludeValue = fareBasisInclude.value.split(",");
    if (
      fareBasisIncludeValue.includes(
        singleFlightDetails.Sectors[0].FareBasisCode
      )
    ) {
      bestMatch = true;
    } else {
      bestMatch = false;
    }
  }

  if (fareBasisExclude) {
    const fareBasisExcludeValue = fareBasisExclude.value.split(",");
    if (
      fareBasisExcludeValue.includes(
        singleFlightDetails.Sectors[0].FareBasisCode
      )
    ) {
      bestMatch = false;
    } else {
      bestMatch = true;
    }
  }

  // RBD Filter Start here
  const rbdInclude = commList.aircommercialfilterincexcs.commercialFilter.find(
    (filter) =>
      filter.commercialFilterId.rowName === "RBD" &&
      filter.type === "include" &&
      filter.valueType === "text" &&
      filter.value != null &&
      filter.value != "" &&
      singleFlightDetails.Sectors[0].FareBasisCode != null &&
      singleFlightDetails.Sectors[0].FareBasisCode != ""
  );

  const rbdExclude = commList.aircommercialfilterincexcs.commercialFilter.find(
    (filter) =>
      filter.commercialFilterId.rowName === "RBD" &&
      filter.type === "exclude" &&
      filter.valueType === "text" &&
      filter.value != null &&
      filter.value != "" &&
      singleFlightDetails.Sectors[0].FareBasisCode != null &&
      singleFlightDetails.Sectors[0].FareBasisCode != ""
  );

  if (rbdInclude) {
    const rbdIncludeValue = rbdInclude.value.split(",");
    if (
      rbdIncludeValue.includes(
        singleFlightDetails.Sectors[0].FareBasisCode.charAt(0)
      )
    ) {
      bestMatch = true;
    } else {
      bestMatch = false;
    }
  }

  if (rbdExclude) {
    const rbdExcludeValue = rbdExclude.value.split(",");
    if (
      rbdExcludeValue.includes(
        singleFlightDetails.Sectors[0].FareBasisCode.charAt(0)
      )
    ) {
      bestMatch = false;
    } else {
      bestMatch = true;
    }
  }
  // Product Class Filter Start here
  const productClassInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "ProductClass" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].CabinClass != null &&
        singleFlightDetails.Sectors[0].CabinClass != ""
    );

  const productClassExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "ProductClass" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.Sectors[0].CabinClass != null &&
        singleFlightDetails.Sectors[0].CabinClass != ""
    );

  if (productClassInclude) {
    const productClassIncludeValue = productClassInclude.value.split(",");
    if (
      productClassIncludeValue.includes(
        singleFlightDetails.Sectors[0].CabinClass
      )
    ) {
      bestMatch = true;
    } else {
      bestMatch = false;
    }
  }

  if (productClassExclude) {
    const productClassExcludeValue = productClassExclude.value.split(",");
    if (
      productClassExcludeValue.includes(
        singleFlightDetails.Sectors[0].CabinClass
      )
    ) {
      bestMatch = false;
    } else {
      bestMatch = true;
    }
  }

  // Fare Range Filter Start Here
  const fareRangeInclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "FareRange" &&
        filter.type === "include" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.GrandTotal != null &&
        singleFlightDetails.GrandTotal != ""
    );

  const fareRangeExclude =
    commList.aircommercialfilterincexcs.commercialFilter.find(
      (filter) =>
        filter.commercialFilterId.rowName === "FareRange" &&
        filter.type === "exclude" &&
        filter.valueType === "text" &&
        filter.value != null &&
        filter.value != "" &&
        singleFlightDetails.GrandTotal != null &&
        singleFlightDetails.GrandTotal != ""
    );

  if (fareRangeInclude) {
    const priceIncludeValues = parseFloat(fareRangeInclude.value);
    const totalPrice = parseFloat(singleFlightDetails.GrandTotal);

    if (!isNaN(priceIncludeValues) && totalPrice >= priceIncludeValues) {
      bestMatch = true;
    } else {
      // Price is outside the specified range
      bestMatch = false;
    }
  }

  if (fareRangeExclude) {
    const priceExcludeValues = parseFloat(fareRangeExclude.value);
    const totalPrice = parseFloat(singleFlightDetails.GrandTotal);

    if (!isNaN(priceExcludeValues) && priceExcludeValues >= totalPrice) {
      bestMatch = true;
    } else {
      // Price is outside the specified range
      bestMatch = false;
    }
  }

  // here send responce true and false if true share with data  if bestmatch is true apply values filters
  if (bestMatch === true) {
    return { match: true, data: "tDetails" };
  } else {
    return { match: false, data: null };
  }
};

const commertialMatrixValue = async (commList, singleFlightDetails) => {
  const serviceFeeRateAllColumn =
    commList.updateaircommercialmatrixes.data.filter(
      (filter) =>
        filter.AirCommertialRowMasterId.name === "Service Fee Rate(+)" &&
        filter.AirCommertialRowMasterId.commercialType === "rate" &&
        filter.AirCommertialRowMasterId.type === "row"
    );

  if (serviceFeeRateAllColumn.length > 0) {
    const rateSingleColumn = serviceFeeRateAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Rate %" &&
        filter.AirCommertialColumnMasterId.commercialType === "rate" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (rateSingleColumn) {
      const serviceRate =
        rateSingleColumn.textType === "number"
          ? parseFloat(rateSingleColumn.value)
          : 0;

      const applyServiceRateToTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yqTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YQ");
          if (yqTax) {
            yqTax.Amount += (parseFloat(serviceRate) / 100) * yqTax.Amount;
          }
        }
      };

      const onFuleSurchargeSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On Fuel Surcharge" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onFuleSurchargeSingleColumn?.textType === "checkbox" &&
        onFuleSurchargeSingleColumn.value
      ) {
        applyServiceRateToTax(singleFlightDetails.PriceBreakup[0], "ADT");
        applyServiceRateToTax(singleFlightDetails.PriceBreakup[1], "CHD");
        applyServiceRateToTax(singleFlightDetails.PriceBreakup[2], "INF");
      }

      const applyServiceRateToBaseFare = (fare) => {
        if (!(Object.keys(fare).length === 0)) {
          fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
          //fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
        }
      };

      const baseFareSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Base Fare" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      if (
        baseFareSingleColumn?.textType === "checkbox" &&
        baseFareSingleColumn.value
      ) {
        applyServiceRateToBaseFare(singleFlightDetails.PriceBreakup[0]);
        applyServiceRateToBaseFare(singleFlightDetails.PriceBreakup[1]);
        applyServiceRateToBaseFare(singleFlightDetails.PriceBreakup[2]);
      }
      // On other Tax
      const applyServiceRateToOnOtherTax = (fare) => {
        if (!(Object.keys(fare).length === 0)) {
          fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
          //fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
        }
      };

      const onOtherTaxSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On Other Tax" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      if (
        onOtherTaxSingleColumn?.textType === "checkbox" &&
        onOtherTaxSingleColumn.value
      ) {
        applyServiceRateToOnOtherTax(singleFlightDetails.PriceBreakup[0]);
        applyServiceRateToOnOtherTax(singleFlightDetails.PriceBreakup[1]);
        applyServiceRateToOnOtherTax(singleFlightDetails.PriceBreakup[2]);
      }

    }
  }

  return singleFlightDetails.PriceBreakup;
};

// const commertialMatrixValue = async (commList, singleFlightDetails) => {
//   // Here Apply matches commertial values
//   // Rate Commertials start here with persentage
//   // service fee rate (+)
//   const serviceFeeRateAllColumn =
//     commList.updateaircommercialmatrixes.data.filter(
//       (filter) =>
//         filter.AirCommertialRowMasterId.name === "Service Fee Rate(+)" &&
//         filter.AirCommertialRowMasterId.commercialType === "rate" &&
//         filter.AirCommertialRowMasterId.type === "row"
//     );

//   if (serviceFeeRateAllColumn.length > 0) {
//     const rateSingleColumn = serviceFeeRateAllColumn.find(
//       (filter) =>
//         filter.AirCommertialColumnMasterId.name === "Rate %" &&
//         filter.AirCommertialColumnMasterId.commercialType === "rate" &&
//         filter.AirCommertialColumnMasterId.type === "coloumn"
//     );
//     if (rateSingleColumn) {
//       // get value
//       serviceRate =
//         rateSingleColumn.textType === "number"
//           ? parseFloat(rateSingleColumn.value)
//           : 0;
//     }
//     // on fuel surcharge
//     const onFuleSurchargeSingleColumn = serviceFeeRateAllColumn.find(
//       (filter) =>
//         filter.AirCommertialColumnMasterId.name === "On Fuel Surcharge" &&
//         filter.AirCommertialColumnMasterId.commercialType === "rate" &&
//         filter.AirCommertialColumnMasterId.type === "coloumn"
//     );
//     if (
//       onFuleSurchargeSingleColumn &&
//       onFuleSurchargeSingleColumn.textType === "checkbox" &&
//       onFuleSurchargeSingleColumn.value === true
//     ) {
//       // check ADT
//       if (!(Object.keys(singleFlightDetails.PriceBreakup[0]).length === 0) && !(Object.keys(singleFlightDetails.PriceBreakup[0].TaxBreakup).length === 0)) {
//         const yqTaxADT = singleFlightDetails.PriceBreakup[0].TaxBreakup.find(tax => tax.TaxType === 'YQ');
//         if(yqTaxADT){
//          // matrixRate.percentage.ADT.onFuelSurcharge = (parseFloat(serviceRate) / 100) * yqTaxADT.Amount;
//           yqTaxADT.Amount = yqTaxADT.Amount + (parseFloat(serviceRate) / 100) * yqTaxADT.Amount;
//         }

//       }
//       // check CHD
//       if (!(Object.keys(singleFlightDetails.PriceBreakup[1]).length === 0) && !(Object.keys(singleFlightDetails.PriceBreakup[1].TaxBreakup).length === 0)) {
//         const yqTaxCHD = singleFlightDetails.PriceBreakup[1].TaxBreakup.find(tax => tax.TaxType === 'YQ');
//         if(yqTaxCHD){
//         yqTaxCHD.Amount = yqTaxCHD.Amount + (parseFloat(serviceRate) / 100) * yqTaxCHD.Amount;
//         }
//       }
//       // check INF
//       if (!(Object.keys(singleFlightDetails.PriceBreakup[2]).length === 0) && !(Object.keys(singleFlightDetails.PriceBreakup[2].TaxBreakup).length === 0)) {
//         const yqTaxINF = singleFlightDetails.PriceBreakup[2].TaxBreakup.find(tax => tax.TaxType === 'YQ');
//         if(yqTaxINF){
//           yqTaxINF.Amount = yqTaxINF.Amount + (parseFloat(serviceRate) / 100) * yqTaxINF.Amount;
//         }
//       }

//     }
//     // Base Fare
//     const baseFareSingleColumn = serviceFeeRateAllColumn.find(
//       (filter) =>
//         filter.AirCommertialColumnMasterId.name === "Base Fare" &&
//         filter.AirCommertialColumnMasterId.commercialType === "rate" &&
//         filter.AirCommertialColumnMasterId.type === "coloumn"
//     );
//     if (
//       baseFareSingleColumn &&
//       baseFareSingleColumn.textType === "checkbox" &&
//       baseFareSingleColumn.value === true
//     ) {
//       // check ADT
//       if (!(Object.keys(singleFlightDetails.PriceBreakup[0]).length === 0)) {
//         singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + (parseFloat(serviceRate) / 100) * singleFlightDetails.PriceBreakup[0].BaseFare;

//       }
//       // check CHD
//       if (!(Object.keys(singleFlightDetails.PriceBreakup[1]).length === 0)) {
//         singleFlightDetails.PriceBreakup[1].BaseFare = singleFlightDetails.PriceBreakup[1].BaseFare + (parseFloat(serviceRate) / 100) * singleFlightDetails.PriceBreakup[1].BaseFare;

//       }
//       // check INF
//       if (!(Object.keys(singleFlightDetails.PriceBreakup[2]).length === 0)) {
//         singleFlightDetails.PriceBreakup[2].BaseFare = singleFlightDetails.PriceBreakup[2].BaseFare + (parseFloat(serviceRate) / 100) * singleFlightDetails.PriceBreakup[2].BaseFare;

//       }

//     }

//   }

//   return singleFlightDetails.PriceBreakup;
// };

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

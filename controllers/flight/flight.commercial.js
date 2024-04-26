const UserModule = require("../../models/User");
const Company = require("../../models/Company");
const agentConfig = require("../../models/AgentConfig");
const agencyGroup = require("../../models/AgencyGroup");
const commercialairplans = require("../../models/CommercialAirPlan");
const aircommercialsList = require("../../models/AirCommercial");
const aircommercialfilterincexcs = require("../../models/CommercialFilterExcludeIncludeList");
const fareFamilyMaster = require("../../models/FareFamilyMaster");
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
  const fareFamilyMasterGet = await fareFamilyMaster.find({});
  // let incentivePlanDetails;
  // let plbPlanDetails;
  let checkInnerFilterfun = null;
  let checkIncentiveFilterfun = null;
  let applyResponceCommercialArray = [];
  let groupPriority;
  let commertialMatrixValueHandle = null;
  if (companyDetails.type == "Agency" && companyDetails.parent.type == "TMC") {
    // TMC-Agency // // one time apply commertioal
    console.log('TMC-Agency');
    const [
      commercialPlanDetails,
      incentivePlanDetails,
      plbPlanDetails,
      markupDetails,
      congifDetails,
    ] = await Promise.all([
      getAssignCommercial(companyDetails._id),
      getAssignIncentive(companyDetails._id),
      getAssignPlb(companyDetails._id),
      getAssignMarcup(companyDetails._id),
      getAssignCongifDetails(companyDetails.parent._id),
    ]);

    //console.log(congifDetails);

    const countryMapingVal = await countryMaping.find(
      {
        companyId: companyDetails.parent._id,
        //ContinentCode: { $in: allCountryValue },
      },
      {
        countries: 1,
        _id: 0, // Exclude _id field
      }
    );

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
        FareFamily: "FF",
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
            gst: 0.0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 100,
              },

              {
                TaxType: "K2",
                Amount: 55,
              },
              {
                TaxType: "p2",
                Amount: 322,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            AgentMarkupBreakup: {
              BookingFee: 0.0,
              Basic: 0.0,
              Tax: 0.0,
            },
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
            gst: 0.0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },

              {
                TaxType: "K2",
                Amount: 55,
              },
              {
                TaxType: "p2",
                Amount: 322,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],

            AgentMarkupBreakup: {
              BookingFee: 0.0,
              Basic: 0.0,
              Tax: 0.0,
            },
            Key: null,
          },
          {
            PassengerType: "INF",
            NoOfPassenger: 1,
            Tax: 222,
            BaseFare: 3000,
            MarkUp: 0,
            TaxMarkUp: 0,
            Commission: 0,
            Fees: 0,
            BookingFees: 0,
            CancellationFees: 0,
            RescheduleFees: 0,
            AdminFees: 0,
            TDS: 0,
            gst: 0.0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },

              {
                TaxType: "K2",
                Amount: 55,
              },
              {
                TaxType: "p2",
                Amount: 322,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            AgentMarkupBreakup: {
              BookingFee: 0.0,
              Basic: 0.0,
              Tax: 0.0,
            },
            Key: null,
          },
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
            FltNum: "831",
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
            FltNum: "839",
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
        ValCarrier: "AI",
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
            gst: 0.0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 100,
              },
              {
                TaxType: "K2",
                Amount: 55,
              },
              {
                TaxType: "p2",
                Amount: 322,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            AgentMarkupBreakup: {
              BookingFee: 0.0,
              Basic: 0.0,
              Tax: 0.0,
            },
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
            gst: 0.0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },

              {
                TaxType: "K2",
                Amount: 55,
              },
              {
                TaxType: "p2",
                Amount: 322,
              },
            ],
            AirPenalty: [],
            CommercialBreakup: [],
            AgentMarkupBreakup: {
              BookingFee: 0.0,
              Basic: 0.0,
              Tax: 0.0,
            },
            Key: null,
          },
          {
            PassengerType: "INF",
            NoOfPassenger: 1,
            Tax: 322,
            BaseFare: 2000,
            MarkUp: 0,
            TaxMarkUp: 0,
            Commission: 0,
            Fees: 0,
            BookingFees: 0,
            CancellationFees: 0,
            RescheduleFees: 0,
            AdminFees: 0,
            TDS: 0,
            gst: 0.0,
            ServiceFees: 0,
            Discount: 0,
            BaseCharges: 0,
            TaxBreakup: [
              {
                TaxType: "YQ",
                Amount: 0,
              },

              {
                TaxType: "K2",
                Amount: 55,
              },
              {
                TaxType: "p2",
                Amount: 322,
              },
            ],

            AirPenalty: [],
            CommercialBreakup: [],
            AgentMarkupBreakup: {
              BookingFee: 0.0,
              Basic: 0.0,
              Tax: 0.0,
            },
            Key: null,
          },
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

    for (const singleFlightDetails of commonArray) {
      //for (const singleFlightDetails of commonArrayDummy) {
      // Check Commertial status and Commertial Apply
      if (commercialPlanDetails.IsSuccess === true) {
        // console.log(commercialPlanDetails.data);
        // get group of priority base
        groupPriority = await makePriorityGroup(
          TravelType,
          singleFlightDetails,
          commercialPlanDetails
        );
        if (groupPriority.length > 0) {
          const sortedGroupPriority = groupPriority.sort((a, b) => {
            if (a.carrier === null && b.carrier === null) {
              return 0;
            }
            if (a.carrier === null) {
              return 1;
            }
            if (b.carrier === null) {
              return -1;
            }
            return a.priority - b.priority;
          });

          for (let i = 0; i < sortedGroupPriority.length; i++) {
            const commList = sortedGroupPriority[i];

            if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === singleFlightDetails.FareFamily &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === null &&
              //!commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === singleFlightDetails.FareFamily &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === singleFlightDetails.FareFamily &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === singleFlightDetails.FareFamily &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === null &&
              //!commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === null &&
              //!commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily === null &&
              //!commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              commList.fareFamily === singleFlightDetails.FareFamily &&
              ["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
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

      // Check Incentive status and  Apply Incentive
      if (incentivePlanDetails.IsSuccess === true) {
        checkIncentiveFilterfun = await checkIncentiveFilter(
          incentivePlanDetails.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingVal,
          congifDetails,
          "TMC",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkIncentiveFilterfun.PriceBreakup;
      }

      // CHeck PLB STatus And Apply PLB
      if (plbPlanDetails.IsSuccess === true) {
        checkPLBFilterfun = await checkPLBFilter(
          plbPlanDetails.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingVal,
          congifDetails,
          "TMC",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkPLBFilterfun.PriceBreakup;
      }

      // Check MArkup HERE
      if (markupDetails.IsSuccess === true) {
        if (markupDetails.data.length > 0) {
          const checkAllMarkup = markupDetails.data.find(
            (filter) =>
              filter.markupOn === TravelType &&
              (filter.airlineCodeId === null
                ? false
                : filter.airlineCodeId.airlineCode ===
                  singleFlightDetails.ValCarrier) &&
              filter.markupFor === "Ticket"
          );

          //console.log(checkAllMarkup);
          if (!checkAllMarkup) {
            const checkSpecificMarkupArr = markupDetails.data.find(
              (filter) =>
                filter.markupOn === TravelType &&
                (filter.airlineCodeId === null
                  ? true
                  : filter.airlineCodeId.airlineCode === null) &&
                filter.markupFor === "Ticket"
            );

            if (checkSpecificMarkupArr) {
              checkMarkupValuefun = await checkMarkupValue(
                checkSpecificMarkupArr,
                singleFlightDetails,
                companyDetails.parent._id,
                congifDetails,
                "TMC"
              );

              singleFlightDetails.PriceBreakup =
                checkMarkupValuefun.PriceBreakup;
            }
          } else {
            checkMarkupValuefun = await checkMarkupValue(
              checkAllMarkup,
              singleFlightDetails,
              companyDetails.parent._id,
              congifDetails,
              "TMC"
            );

            singleFlightDetails.PriceBreakup = checkMarkupValuefun.PriceBreakup;
          }
        }

        // checkMarkupFilterfun = await checkMarkupFilter(
        //   markupDetails.data,
        //   singleFlightDetails,
        //   companyDetails.parent._id
        // );

        // singleFlightDetails.PriceBreakup = checkPLBFilterfun.checkMarkupFilterfun;
      }

      // this is last update and push function
      applyResponceCommercialArray.push(singleFlightDetails);
    }
    return applyResponceCommercialArray.sort(
      (a, b) => a.TotalPrice - b.TotalPrice
    );
    //return congifDetails;
  } else if (
    companyDetails.type == "Agency" &&
    companyDetails.parent.type == "Distributer"
  ) {
    console.log('TMC-Distributer-Agency');
    // TMC-Distributer-Agency // Two time apply commertioal
    const [
      commercialPlanDetails,
      incentivePlanDetails,
      plbPlanDetails,
      congifDetails,
    ] = await Promise.all([
      getAssignCommercial(companyDetails.parent._id),
      getAssignIncentive(companyDetails.parent._id),
      getAssignPlb(companyDetails.parent._id),
      getAssignCongifDetails(companyDetails.parent._id),
    ]);
    const countryMapingVal = await countryMaping.find(
      {
        companyId: companyDetails.parent._id,
        //ContinentCode: { $in: allCountryValue },
      },
      {
        countries: 1,
        _id: 0, // Exclude _id field
      }
    );

    for (const singleFlightDetails of commonArray) {
        //for (const singleFlightDetails of commonArrayDummy) {
        // Check Commertial status and Commertial Apply
      if (commercialPlanDetails.IsSuccess === true) {
        // get group of priority base
        groupPriority = await makePriorityGroup(
          TravelType,
          singleFlightDetails,
          commercialPlanDetails
        );
        if (groupPriority.length > 0) {
          const sortedGroupPriority = groupPriority.sort((a, b) => {
            if (a.carrier === null && b.carrier === null) {
              return 0;
            }
            if (a.carrier === null) {
              return 1;
            }
            if (b.carrier === null) {
              return -1;
            }
            return a.priority - b.priority;
          });
          for (let i = 0; i < sortedGroupPriority.length; i++) {
            const commList = sortedGroupPriority[i];
            if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              ["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails.parent._id,
                  congifDetails,
                  "TMC"
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

      // Check Incentive status and  Apply Incentive
      if (incentivePlanDetails.IsSuccess === true) {
        checkIncentiveFilterfun = await checkIncentiveFilter(
          incentivePlanDetails.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingVal,
          congifDetails,
          "TMC",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkIncentiveFilterfun.PriceBreakup;
      }

      // CHeck PLB STatus And Apply PLB
      if (plbPlanDetails.IsSuccess === true) {
        checkPLBFilterfun = await checkPLBFilter(
          plbPlanDetails.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingVal,
          congifDetails,
          "TMC",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkPLBFilterfun.PriceBreakup;
      }
      // this is last update and push function
      applyResponceCommercialArray.push(singleFlightDetails);
    }

    // for distibuter
    const [
      commercialPlanDetailsDistibuter,
      incentivePlanDetailsDistibuter,
      plbPlanDetailsDistibuter,
      markupDetails,
      congifDetailsDistibuter,
    ] = await Promise.all([
      getAssignCommercial(companyDetails._id),
      getAssignIncentive(companyDetails._id),
      getAssignPlb(companyDetails._id),
      getAssignMarcup(companyDetails._id),
      getAssignCongifDetails(companyDetails.parent._id),
    ]);
    const countryMapingValDistibuter = await countryMaping.find(
      {
        companyId: companyDetails.parent._id,
        //ContinentCode: { $in: allCountryValue },
      },
      {
        countries: 1,
        _id: 0, // Exclude _id field
      }
    );

    for (const singleFlightDetails of commonArray) {
      //for (const singleFlightDetails of commonArrayDummy) {
      // Check Commertial status and Commertial Apply
      if (commercialPlanDetailsDistibuter.IsSuccess === true) {
        // get group of priority base
        groupPriority = await makePriorityGroup(
          TravelType,
          singleFlightDetails,
          commercialPlanDetailsDistibuter
        );
        if (groupPriority.length > 0) {
          const sortedGroupPriority = groupPriority.sort((a, b) => {
            if (a.carrier === null && b.carrier === null) {
              return 0;
            }
            if (a.carrier === null) {
              return 1;
            }
            if (b.carrier === null) {
              return -1;
            }
            return a.priority - b.priority;
          });
          for (let i = 0; i < sortedGroupPriority.length; i++) {
            const commList = sortedGroupPriority[i];
            if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                //bestMatch = commertialMatrixValueHandle;
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetailsDistibuter,
                  "Distributer"
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

      // Check Incentive status and  Apply Incentive
      if (incentivePlanDetailsDistibuter.IsSuccess === true) {
        checkIncentiveFilterfun = await checkIncentiveFilter(
          incentivePlanDetailsDistibuter.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingValDistibuter,
          congifDetailsDistibuter,
          "Distributer",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkIncentiveFilterfun.PriceBreakup;
      }

      // CHeck PLB STatus And Apply PLB
      if (plbPlanDetailsDistibuter.IsSuccess === true) {
        checkPLBFilterfun = await checkPLBFilter(
          plbPlanDetailsDistibuter.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingValDistibuter,
          congifDetailsDistibuter,
          "Distributer",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkPLBFilterfun.PriceBreakup;
      }

      // Check MArkup HERE
      if (markupDetails.IsSuccess === true) {
        if (markupDetails.data.length > 0) {
          const checkAllMarkup = markupDetails.data.find(
            (filter) =>
              filter.markupOn === TravelType &&
              (filter.airlineCodeId === null
                ? false
                : filter.airlineCodeId.airlineCode ===
                  singleFlightDetails.ValCarrier) &&
              filter.markupFor === "Ticket"
          );

          //console.log(checkAllMarkup);
          if (!checkAllMarkup) {
            const checkSpecificMarkupArr = markupDetails.data.find(
              (filter) =>
                filter.markupOn === TravelType &&
                (filter.airlineCodeId === null
                  ? true
                  : filter.airlineCodeId.airlineCode === null) &&
                filter.markupFor === "Ticket"
            );

            if (checkSpecificMarkupArr) {
              checkMarkupValuefun = await checkMarkupValue(
                checkSpecificMarkupArr,
                singleFlightDetails,
                companyDetails.parent._id,
                congifDetailsDistibuter,
                "Distributer"
              );

              singleFlightDetails.PriceBreakup =
                checkMarkupValuefun.PriceBreakup;
            }
          } else {
            checkMarkupValuefun = await checkMarkupValue(
              checkAllMarkup,
              singleFlightDetails,
              companyDetails.parent._id,
              congifDetailsDistibuter,
              "Distributer"
            );

            singleFlightDetails.PriceBreakup = checkMarkupValuefun.PriceBreakup;
          }
        }

        // checkMarkupFilterfun = await checkMarkupFilter(
        //   markupDetails.data,
        //   singleFlightDetails,
        //   companyDetails.parent._id
        // );

        // singleFlightDetails.PriceBreakup = checkPLBFilterfun.checkMarkupFilterfun;
      }

      // this is last update and push function
      applyResponceCommercialArray.push(singleFlightDetails);
    }
    return applyResponceCommercialArray.sort(
      (a, b) => a.TotalPrice - b.TotalPrice
    );
  } else if (
    companyDetails.type == "Distributer" &&
    companyDetails.parent.type == "TMC"
  ) {
    console.log('Distributer-TMC');
    // Distributer-TMC // one time apply commertioal
    const [
      commercialPlanDetails,
      incentivePlanDetails,
      plbPlanDetails,
      congifDetails,
    ] = await Promise.all([
      getAssignCommercial(companyDetails._id),
      getAssignIncentive(companyDetails._id),
      getAssignPlb(companyDetails._id),
      getAssignCongifDetails(companyDetails.parent._id),
    ]);
    const countryMapingVal = await countryMaping.find(
      {
        companyId: companyDetails.parent._id,
        //ContinentCode: { $in: allCountryValue },
      },
      {
        countries: 1,
        _id: 0, // Exclude _id field
      }
    );

    for (const singleFlightDetails of commonArray) {
      //for (const singleFlightDetails of commonArrayDummy) {
      // Check Commertial status and Commertial Apply
      if (commercialPlanDetails.IsSuccess === true) {
        // get group of priority base
        groupPriority = await makePriorityGroup(
          TravelType,
          singleFlightDetails,
          commercialPlanDetails
        );
        if (groupPriority.length > 0) {
          const sortedGroupPriority = groupPriority.sort((a, b) => {
            if (a.carrier === null && b.carrier === null) {
              return 0;
            }
            if (a.carrier === null) {
              return 1;
            }
            if (b.carrier === null) {
              return -1;
            }
            return a.priority - b.priority;
          });
          for (let i = 0; i < sortedGroupPriority.length; i++) {
            const commList = sortedGroupPriority[i];
            if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                //bestMatch = commertialMatrixValueHandle;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                //singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === null &&
              commList.source === singleFlightDetails.Provider &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              TravelType === commList.travelType &&
              commList.carrier === singleFlightDetails.ValCarrier &&
              commList.source === null &&
              commList.commercialCategory === "Ticket" &&
              !commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              !["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
                );
                //bestMatch = commertialMatrixValueHandle;
                // singleFlightDetails.PriceBreakup[0].BaseFare = singleFlightDetails.PriceBreakup[0].BaseFare + commertialMatrixValueHandle.percentage.onFuelSurcharge;
                break;
              }
            } else if (
              commList.fareFamily.includes(singleFlightDetails.FareFamily) &&
              ["FD", "FF"].includes(singleFlightDetails.FareFamily)
            ) {
              checkInnerFilterfun = await checkInnerFilter(
                commList,
                singleFlightDetails,
                companyDetails.parent._id
              );
              if (checkInnerFilterfun.match === true) {
                commertialMatrixValueHandle = await commertialMatrixValue(
                  commList,
                  singleFlightDetails,
                  companyDetails._id,
                  congifDetails,
                  "TMC"
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

      // Check Incentive status and  Apply Incentive
      if (incentivePlanDetails.IsSuccess === true) {
        checkIncentiveFilterfun = await checkIncentiveFilter(
          incentivePlanDetails.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingVal,
          congifDetails,
          "TMC",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkIncentiveFilterfun.PriceBreakup;
      }

      // CHeck PLB STatus And Apply PLB
      if (plbPlanDetails.IsSuccess === true) {
        checkPLBFilterfun = await checkPLBFilter(
          plbPlanDetails.data,
          singleFlightDetails,
          companyDetails.parent._id,
          countryMapingVal,
          congifDetails,
          "TMC",
          fareFamilyMasterGet
        );

        singleFlightDetails.PriceBreakup = checkPLBFilterfun.PriceBreakup;
      }
      // this is last update and push function
      applyResponceCommercialArray.push(singleFlightDetails);
    }
    return applyResponceCommercialArray.sort(
      (a, b) => a.TotalPrice - b.TotalPrice
    );
  }
  else if(companyDetails.parent.type == "TMC"){
    console.log('tmcc');
    return singleFlightDetails.sort(
      (a, b) => a.TotalPrice - b.TotalPrice
    );;
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
      if (!commercialairplansVar) {
        return { IsSuccess: false, Message: "Commercial Not Available" };
      }

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
          {
            path: "fareFamily",
            select: "fareFamilyName fareFamilyCode",
          },
        ]);
      //console.log(aircommercialListVar);
      if (aircommercialListVar.length > 0) {
        //const fareFamilyMasterGet = await fareFamilyMaster.find({});
        let mappingData = aircommercialListVar.map(async (items) => {
          // const matchedFareFamilyCodes = items.fareFamily?.fareFamilyName != null ? fareFamilyMasterGet
          // .filter(item => item.fareFamilyName === items.fareFamily.fareFamilyName)
          // .map(item => item.fareFamilyCode) :  [];
          const matchedFareFamilyCodes =
            items.fareFamily != null ? items.fareFamily?.fareFamilyCode : null;

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
            fareFamily: matchedFareFamilyCodes,
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
    if (!commercialairplansVar) {
      return { IsSuccess: false, Message: "Commercial Not Available" };
    }
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
        {
          path: "fareFamily",
          select: "fareFamilyName fareFamilyCode",
        },
      ]);

    if (aircommercialListVar.length > 0) {
      //const fareFamilyMasterGet = await fareFamilyMaster.find({});

      let mappingData = aircommercialListVar.map(async (items) => {
        //return items

        const matchedFareFamilyCodes =
          items.fareFamily != null ? items.fareFamily?.fareFamilyCode : null;

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
          fareFamily: matchedFareFamilyCodes,
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
        .populate({
          path: "incentiveMasterId",
          populate: [
            { path: "supplierCode" },
            { path: "airlineCode" },
            { path: "cabinClass" },
            { path: "fareFamily" },
          ],
        });

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
      .populate({
        path: "incentiveMasterId",
        populate: [
          { path: "supplierCode" },
          { path: "airlineCode" },
          { path: "cabinClass" },
          { path: "fareFamily" },
        ],
      });

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
          PLBGroupId: getAgentConfig.plbGroupId,
        })
        .populate({
          path: "PLBMasterId",
          populate: [
            { path: "supplierCode" },
            { path: "airlineCode" },
            { path: "cabinClass" },
            { path: "fareFamily" },
          ],
        });

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
      .populate({
        path: "PLBMasterId",
        populate: [
          { path: "supplierCode" },
          { path: "airlineCode" },
          { path: "cabinClass" },
          { path: "fareFamily" },
        ],
      });

    if (plbListVar.length > 0) {
      return { IsSuccess: true, data: plbListVar };
    } else {
      return { IsSuccess: false, Message: "PLB Group Not Available" };
    }
  }
};

const getAssignMarcup = async (companyId) => {
  let getmarkupData = await managemarkupsimport
    .find({
      companyId: companyId,
    })
    .populate("airlineCodeId")
    .populate("markupData.markUpCategoryId");

  if (getmarkupData.length > 0) {
    return { IsSuccess: true, data: getmarkupData };
  } else {
    return { IsSuccess: false, Message: "Markup Not Available" };
  }
};

const getAssignCongifDetails = async (companyId) => {
  try {
    let getAgentConfig = await agentConfig.findOne({
      companyId: companyId,
    });

    // console.log(companyId);

    if (getAgentConfig) {
      return { IsSuccess: true, data: getAgentConfig };
    } else {
      return { IsSuccess: false, Message: "Agent Config Not Available" };
    }
  } catch (error) {
    console.error("Error fetching agent config:", error);
    return { IsSuccess: false, Message: "Error fetching agent config" };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      ) ||
      allAirportIncludeIncludeValue.includes(
        singleFlightDetails.Sectors[0].Arrival.CountryCode
      )
    ) {
      // country code exists  IN, US
      bestMatch = true;
    } else {
      // does not exists country code Then Check Airport Code DEL,BOM
      if (
        allAirportIncludeIncludeValue.includes(
          singleFlightDetails.Sectors[0].Departure.Code
        ) ||
        allAirportIncludeIncludeValue.includes(
          singleFlightDetails.Sectors[0].Arrival.Code
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
              .includes(singleFlightDetails.Sectors[0].Departure.CountryCode) ||
            countryMapingVal.countries
              .split(",")
              .includes(singleFlightDetails.Sectors[0].Arrival.CountryCode)
          ) {
            // Country Code Group Exists
            bestMatch = true;
          } else {
            // Country Code Group Not Exits
            bestMatch = false;
            return { match: false, data: null };
          }
        } else {
          bestMatch = false;
          return { match: false, data: null };
        }
      }
    }
  }

  if (allAirportExclude) {
    const allAirportExcludeValue = allAirportExclude.value.split(",");
    if (
      allAirportExcludeValue.includes(
        singleFlightDetails.Sectors[0].Departure.CountryCode
      ) ||
      allAirportExcludeValue.includes(
        singleFlightDetails.Sectors[0].Arrival.CountryCode
      )
    ) {
      // country code exists  IN, US
      bestMatch = false;
      return { match: false, data: null };
    } else {
      // does not exists country code Then Check Airport Code DEL,BOM
      if (
        allAirportExcludeValue.includes(
          singleFlightDetails.Sectors[0].Departure.Code
        ) ||
        allAirportExcludeValue.includes(
          singleFlightDetails.Sectors[0].Arrival.Code
        )
      ) {
        // Airport exits
        bestMatch = false;
        return { match: false, data: null };
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
              .includes(singleFlightDetails.Sectors[0].Departure.CountryCode) ||
            countryMapingVal.countries
              .split(",")
              .includes(singleFlightDetails.Sectors[0].Arrival.CountryCode)
          ) {
            // Country Code Group Exists
            bestMatch = false;
            return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
    }
  }

  if (marketingCarrierExclude) {
    const marketingCarrierExcludeValue =
      marketingCarrierExclude.value.split(",");
    if (marketingCarrierExcludeValue.includes(singleFlightDetails.ValCarrier)) {
      bestMatch = false;
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
    }
  }

  if (tourCodeExclude) {
    const tourCodeExcludeValue = tourCodeExclude.value.split(",");
    if (tourCodeExcludeValue.includes(singleFlightDetails.TourCode)) {
      bestMatch = false;
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
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
      return { match: false, data: null };
    }
  }

  // here send responce true and false if true share with data  if bestmatch is true apply values filters
  if (bestMatch === true) {
    return { match: true, data: "tDetails" };
  } else {
    return { match: false, data: null };
  }
};

const checkIncentiveFilter = async (
  incentiveData,
  singleFlightDetails,
  companyId,
  countryMapingVal,
  configDetails,
  supplierTypeFor,
  fareFamilyMasterGet
) => {
  let bestMatch = true;
  if (incentiveData.length > 0) {
    for (let i = 0; i < incentiveData.length; i++) {
      const commList = incentiveData[i];
      // origin and destination
      const checkOrigin =
        commList.incentiveMasterId &&
        commList.incentiveMasterId.origin != null &&
        commList.incentiveMasterId.origin !== "";
      const checkDestination =
        commList.incentiveMasterId &&
        commList.incentiveMasterId.destination != null &&
        commList.incentiveMasterId.destination !== "";
      if (checkOrigin) {
        const allCountryValue = commList.incentiveMasterId.origin.split(",");

        if (
          allCountryValue.includes(
            singleFlightDetails.Sectors[0].Departure.CountryCode
          )
        ) {
          // country code exists  IN, US
          bestMatch = true;
        } else {
          // does not exists country code Then Check Country Mapping Code
          const existsInCountries = (countries, allCountryValue) => {
            const countriesArray = countries.split(",");
            return allCountryValue.some((country) =>
              countriesArray.includes(country)
            );
          };

          const foundCountries = countryMapingVal.filter((obj) =>
            existsInCountries(obj.countries, allCountryValue)
          );
          if (foundCountries && foundCountries.length > 0) {
            if (
              foundCountries.includes(
                singleFlightDetails.Sectors[0].Departure.CountryCode
              )
            ) {
              // Country Code Group Exists
              bestMatch = true;
            } else {
              if (
                allCountryValue.includes(
                  singleFlightDetails.Sectors[0].Departure.CityCode
                )
              ) {
                // City  DEL, BOM
                bestMatch = true;
              } else {
                // city  Code  Not Exits
                continue;
              }
            }
          } else {
            if (
              allCountryValue.includes(
                singleFlightDetails.Sectors[0].Departure.CityCode
              )
            ) {
              // City  DEL, BOM
              bestMatch = true;
            } else {
              // city  Code  Not Exits
              continue;
            }
          }
        }
      }

      if (checkDestination) {
        const allCountryValue =
          commList.incentiveMasterId.destination.split(",");
        const lastSectorIndex = singleFlightDetails.Sectors.length - 1;
        if (
          allCountryValue.includes(
            singleFlightDetails.Sectors[lastSectorIndex].Arrival.CountryCode
          )
        ) {
          // country code exists  IN, US
          bestMatch = true;
        } else {
          // does not exists country code Then Check Country Mapping Code
          const existsInCountries = (countries, allCountryValue) => {
            const countriesArray = countries.split(",");
            return allCountryValue.some((country) =>
              countriesArray.includes(country)
            );
          };

          const foundCountries = countryMapingVal.filter((obj) =>
            existsInCountries(obj.countries, allCountryValue)
          );

          if (foundCountries && foundCountries.length > 0) {
            if (
              foundCountries.includes(
                singleFlightDetails.Sectors[lastSectorIndex].Arrival.CountryCode
              )
            ) {
              // Country Code Group Exists
              bestMatch = true;
            } else {
              if (
                allCountryValue.includes(
                  singleFlightDetails.Sectors[0].Arrival.CityCode
                )
              ) {
                // City  DEL, BOM
                bestMatch = true;
              } else {
                // city  Code  Not Exits
                continue;
              }
            }
          } else {
            if (
              allCountryValue.includes(
                singleFlightDetails.Sectors[0].Arrival.CityCode
              )
            ) {
              // City  DEL, BOM
              bestMatch = true;
            } else {
              // city  Code  Not Exits
              continue;
            }
          }
        }
      }

      // Supplier Code
      const checksupplierCode =
        commList.incentiveMasterId.supplierCode &&
        commList.incentiveMasterId.supplierCode != null &&
        commList.incentiveMasterId.supplierCode !== "";

      if (checksupplierCode) {
        if (
          commList.incentiveMasterId.supplierCode.supplierCode ===
          singleFlightDetails.Provider
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Airline check
      const checkairlineCode =
        commList.incentiveMasterId.airlineCode &&
        commList.incentiveMasterId.airlineCode != null &&
        commList.incentiveMasterId.airlineCode !== "";

      if (checkairlineCode) {
        if (
          commList.incentiveMasterId.airlineCode.airlineCode ===
          singleFlightDetails.ValCarrier
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // fare Family
      const checkfareFamily =
        commList.incentiveMasterId.fareFamily &&
        commList.incentiveMasterId.fareFamily != null &&
        commList.incentiveMasterId.fareFamily !== "";

      if (checkfareFamily) {
        // const matchedFareFamilyCodes = commList.incentiveMasterId.fareFamily?.fareFamilyName != null ? fareFamilyMasterGet
        //   .filter(item => item.fareFamilyName === commList.incentiveMasterId.fareFamily.fareFamilyName)
        //   .map(item => item.fareFamilyCode) :  [];

        if (
          commList.incentiveMasterId.fareFamily.fareFamilyCode ===
            singleFlightDetails.FareFamily &&
          !["FD", "FF"].includes(singleFlightDetails.FareFamily)
        ) {
          bestMatch = true;
        } else if (
          commList.incentiveMasterId.fareFamily.fareFamilyCode ===
            singleFlightDetails.FareFamily &&
          ["FD", "FF"].includes(singleFlightDetails.FareFamily)
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      } else if (["FD", "FF"].includes(singleFlightDetails.FareFamily)) {
        continue;
      }
      // Cabin class
      const checkcabinClass =
        commList.incentiveMasterId.cabinClass &&
        commList.incentiveMasterId.cabinClass != null &&
        commList.incentiveMasterId.cabinClass !== "";

      if (checkcabinClass) {
        if (
          commList.incentiveMasterId.cabinClass.cabinClassCode ===
          singleFlightDetails.FareType
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }
      //RBD
      const checkrbd =
        commList.incentiveMasterId.rbd &&
        commList.incentiveMasterId.rbd != null &&
        commList.incentiveMasterId.rbd !== "";

      if (checkrbd) {
        if (
          commList.incentiveMasterId.rbd ===
          singleFlightDetails.Sectors[0].FareBasisCode.charAt(0)
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // FareBasis
      const checkFareBasis =
        commList.incentiveMasterId.farebasis &&
        commList.incentiveMasterId.farebasis != null &&
        commList.incentiveMasterId.farebasis !== "";

      if (checkFareBasis) {
        if (
          commList.incentiveMasterId.farebasis ===
          singleFlightDetails.Sectors[0].FareBasisCode
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Flight No
      const checkFlightNo =
        commList.incentiveMasterId.flightNo &&
        commList.incentiveMasterId.flightNo != null &&
        commList.incentiveMasterId.flightNo !== "";

      if (checkFlightNo) {
        if (
          commList.incentiveMasterId.flightNo ===
            singleFlightDetails.Sectors[0].FltNum &&
          !singleFlightDetails.Sectors[1]
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Date Issue From
      const checkDateIssueFrom =
        commList.incentiveMasterId.datefIssueFrom &&
        commList.incentiveMasterId.datefIssueFrom != null &&
        commList.incentiveMasterId.datefIssueFrom !== "";
      const currentDate = moment();
      if (checkDateIssueFrom) {
        if (
          currentDate >=
          moment(commList.incentiveMasterId.datefIssueFrom, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Date Issue To
      const checkDateIssueTo =
        commList.incentiveMasterId.datefIssueTo &&
        commList.incentiveMasterId.datefIssueTo != null &&
        commList.incentiveMasterId.datefIssueTo !== "";

      if (checkDateIssueTo) {
        if (
          currentDate >=
          moment(commList.incentiveMasterId.datefIssueTo, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Travel Date From
      const checkTravelDateFrom =
        commList.incentiveMasterId.travelDateFrom &&
        commList.incentiveMasterId.travelDateFrom != null &&
        commList.incentiveMasterId.travelDateFrom !== "";
      if (checkTravelDateFrom) {
        if (
          moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") >=
          moment(commList.incentiveMasterId.travelDateFrom, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Travel Date To
      const checkTravelDateTo =
        commList.incentiveMasterId.travelDateTo &&
        commList.incentiveMasterId.travelDateTo != null &&
        commList.incentiveMasterId.travelDateTo !== "";
      if (checkTravelDateTo) {
        if (
          moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") >=
          moment(commList.incentiveMasterId.travelDateTo, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Min Price
      const checkminPrice =
        commList.incentiveMasterId.minPrice &&
        commList.incentiveMasterId.minPrice != null &&
        commList.incentiveMasterId.minPrice !== "";

      // Max Price
      const checkmaxPrice =
        commList.incentiveMasterId.maxPrice &&
        commList.incentiveMasterId.maxPrice != null &&
        commList.incentiveMasterId.maxPrice !== "";

      // PLB Value Type
      const checkPlbValueType =
        commList.incentiveMasterId.PLBValueType &&
        commList.incentiveMasterId.PLBValueType != null &&
        commList.incentiveMasterId.PLBValueType !== "";
      if (checkPlbValueType) {
        if (commList.incentiveMasterId.PLBValueType == "fixed") {
          const checkPLBValue =
            commList.incentiveMasterId.PLBValue &&
            commList.incentiveMasterId.PLBValue != null &&
            commList.incentiveMasterId.PLBValue !== "" &&
            commList.incentiveMasterId.PLBValue !== 0;

          if (checkPLBValue) {
            if (commList.incentiveMasterId.deductTDS) {
              const tdsCheckFromConfig = configDetails.IsSuccess
                ? configDetails.data.tds || 5
                : 5;
              const tdsdeduct =
                (parseFloat(tdsCheckFromConfig) / 100) *
                commList.incentiveMasterId.PLBValue;
              const totalIncentiveVal =
                commList.incentiveMasterId.PLBValue - tdsdeduct;
              // check min or max

              if (checkminPrice && checkmaxPrice) {
                if (
                  !(
                    totalIncentiveVal >= commList.incentiveMasterId.minPrice &&
                    totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                  )
                ) {
                  continue;
                }
              } else if (checkminPrice) {
                if (
                  !(totalIncentiveVal >= commList.incentiveMasterId.minPrice)
                ) {
                  continue;
                }
              } else if (checkmaxPrice) {
                if (
                  !(totalIncentiveVal <= commList.incentiveMasterId.maxPrice)
                ) {
                  continue;
                }
              }
              addIncentiveToBreakup(
                singleFlightDetails.PriceBreakup,
                totalIncentiveVal,
                supplierTypeFor
              );
            } else {
              const totalIncentiveVal = commList.incentiveMasterId.PLBValue;
              // check min or max

              if (checkminPrice && checkmaxPrice) {
                if (
                  !(
                    totalIncentiveVal >= commList.incentiveMasterId.minPrice &&
                    totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                  )
                ) {
                  continue;
                }
              } else if (checkminPrice) {
                if (
                  !(totalIncentiveVal >= commList.incentiveMasterId.minPrice)
                ) {
                  continue;
                }
              } else if (checkmaxPrice) {
                if (
                  !(totalIncentiveVal <= commList.incentiveMasterId.maxPrice)
                ) {
                  continue;
                }
              }
              addIncentiveToBreakup(
                singleFlightDetails.PriceBreakup,
                totalIncentiveVal,
                supplierTypeFor
              );
            }
          } else {
            continue;
          }
          //bestMatch = true;
        } else {
          // persentage condition here
          const checkPLBValue =
            commList.incentiveMasterId.PLBValue &&
            commList.incentiveMasterId.PLBValue != null &&
            commList.incentiveMasterId.PLBValue !== "" &&
            commList.incentiveMasterId.PLBValue !== 0;

          if (checkPLBValue) {
            if (commList.incentiveMasterId.deductTDS) {
              const persentageValue =
                parseFloat(commList.incentiveMasterId.PLBValue) / 100;
              //let totalIncentiveVal = 0;
              if (commList.incentiveMasterId.PLBApplyOnBasefare) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const calculateBase =
                    await calculateAfterCommertialPriceIncentive(
                      singleFlightDetails.PriceBreakup,
                      "base",
                      "ADT"
                    );

                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    updateOrPushIncentive(
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                      totalIncentiveVal,
                      supplierTypeFor,
                      "base"
                    );
                    updateOrPushIncentiveTDS(
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                      parseFloat(tdsCheckFromConfig) / 100,
                      supplierTypeFor,
                      "base"
                    );
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const calculateBase =
                    await calculateAfterCommertialPriceIncentive(
                      singleFlightDetails.PriceBreakup,
                      "base",
                      "CHD"
                    );

                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    updateOrPushIncentive(
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                      totalIncentiveVal,
                      supplierTypeFor,
                      "base"
                    );
                    updateOrPushIncentiveTDS(
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                      parseFloat(tdsCheckFromConfig) / 100,
                      supplierTypeFor,
                      "base"
                    );
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const calculateBase =
                    await calculateAfterCommertialPriceIncentive(
                      singleFlightDetails.PriceBreakup,
                      "base",
                      "INF"
                    );

                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
              }
              if (commList.incentiveMasterId.PLBApplyOnYQ) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yqval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yqval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const yqTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yqval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup.push(
                        {
                          CommercialType: "Incentive",
                          Amount: totalIncentiveVal,
                          SupplierType: supplierTypeFor,
                        }
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup.push(
                        {
                          CommercialType: "Incentive",
                          Amount: totalIncentiveVal,
                          SupplierType: supplierTypeFor,
                        }
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup.push(
                        {
                          CommercialType: "Incentive",
                          Amount: totalIncentiveVal,
                          SupplierType: supplierTypeFor,
                        }
                      );
                    }
                  } else {
                    singleFlightDetails.PriceBreakup[2].CommercialBreakup.push({
                      CommercialType: "Incentive",
                      Amount: totalIncentiveVal,
                      SupplierType: supplierTypeFor,
                    });
                  }
                }
              }
              if (commList.incentiveMasterId.PLBApplyOnYR) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yrval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yrval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yrTax * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
              }
              if (commList.incentiveMasterId.PLBApplyOnAllTAxes) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[0].Tax;
                  singleFlightDetails.PriceBreakup[0].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[1].Tax;
                  singleFlightDetails.PriceBreakup[1].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[2].Tax;
                  singleFlightDetails.PriceBreakup[2].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushIncentiveTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
              }
            } else {
              const persentageValue =
                parseFloat(commList.incentiveMasterId.PLBValue) / 100;
              //let totalIncentiveVal = 0;
              if (commList.incentiveMasterId.PLBApplyOnBasefare) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  const calculateBase =
                    await calculateAfterCommertialPriceIncentive(
                      singleFlightDetails.PriceBreakup,
                      "base",
                      "ADT"
                    );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  const calculateBase =
                    await calculateAfterCommertialPriceIncentive(
                      singleFlightDetails.PriceBreakup,
                      "base",
                      "CHD"
                    );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const calculateBase =
                    await calculateAfterCommertialPriceIncentive(
                      singleFlightDetails.PriceBreakup,
                      "base",
                      "INF"
                    );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
              }
              if (commList.incentiveMasterId.PLBApplyOnYQ) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }

                  const totalIncentiveVal = yqval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const totalIncentiveVal = yqval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const yqTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const totalIncentiveVal = yqval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
              }
              if (commList.incentiveMasterId.PLBApplyOnYR) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }

                  const totalIncentiveVal = yrval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const totalIncentiveVal = yrval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const totalIncentiveVal = yrTax * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
              }
              if (commList.incentiveMasterId.PLBApplyOnAllTAxes) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[0].tax;
                  singleFlightDetails.PriceBreakup[0].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );

                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[1].tax;
                  singleFlightDetails.PriceBreakup[1].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[2].tax;
                  singleFlightDetails.PriceBreakup[2].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >=
                        commList.incentiveMasterId.minPrice &&
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (
                      totalIncentiveVal >= commList.incentiveMasterId.minPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (
                      totalIncentiveVal <= commList.incentiveMasterId.maxPrice
                    ) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
              }
            }
          } else {
            continue;
          }
        }
      }
    }
  }

  return singleFlightDetails;
};

const addIncentiveToBreakup = (
  priceBreakup,
  totalIncentiveVal,
  supplierTypeFor
) => {
  priceBreakup.forEach((price) => {
    if (price && price.CommercialBreakup) {
      price.CommercialBreakup.push({
        CommercialType: "Incentive",
        Amount: totalIncentiveVal,
        SupplierType: supplierTypeFor,
      });
    }
  });
};

function updateOrPushIncentive(
  CommercialBreakup,
  totalIncentiveVal,
  supplierTypeFor,
  type
) {
  if (type === "base") {
    const existingIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "Incentive" &&
        item.onCommercialApply === "On Base"
    );
    if (existingIncentiveIndex !== -1) {
      // Update the Amount if 'Incentive' already exists
      CommercialBreakup[existingIncentiveIndex].Amount += totalIncentiveVal;
    } else {
      // Push a new 'Incentive' object if it doesn't exist
      CommercialBreakup.push({
        CommercialType: "Incentive",
        onCommercialApply: "On Base",
        Amount: totalIncentiveVal,
        SupplierType: supplierTypeFor,
      });
    }
  } else if (type === "tax") {
    const existingIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "Incentive" &&
        item.onCommercialApply === "tax"
    );
    if (existingIncentiveIndex !== -1) {
      // Update the Amount if 'Incentive' already exists
      CommercialBreakup[existingIncentiveIndex].Amount += totalIncentiveVal;
    } else {
      // Push a new 'Incentive' object if it doesn't exist
      CommercialBreakup.push({
        CommercialType: "Incentive",
        onCommercialApply: "tax",
        Amount: totalIncentiveVal,
        SupplierType: supplierTypeFor,
      });
    }
  }
}

function updateOrPushIncentiveTDS(
  CommercialBreakup,
  totalIncentiveVal,
  supplierTypeFor,
  type
) {
  if (type === "base") {
    const existingcheckParentIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "Incentive" &&
        item.onCommercialApply === "On Base"
    );
    if (existingcheckParentIncentiveIndex !== -1) {
      const existingIncentiveIndex = CommercialBreakup.findIndex(
        (item) =>
          item.SupplierType === supplierTypeFor &&
          item.CommercialType === "TDS" &&
          item.onCommercialApply === "Incentive"
      );
      if (existingIncentiveIndex !== -1) {
        // Update the Amount if 'Incentive' already exists
        CommercialBreakup[existingIncentiveIndex].Amount +=
          CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
          totalIncentiveVal;
      } else {
        // Push a new 'Incentive' object if it doesn't exist
        CommercialBreakup.push({
          CommercialType: "TDS",
          onCommercialApply: "Incentive",
          Amount:
            CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
            totalIncentiveVal,
          SupplierType: supplierTypeFor,
        });
      }
    }
  } else if (type === "tax") {
    const existingcheckParentIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "Incentive" &&
        item.onCommercialApply === "tax"
    );
    if (existingcheckParentIncentiveIndex !== -1) {
      const existingIncentiveIndex = CommercialBreakup.findIndex(
        (item) =>
          item.SupplierType === supplierTypeFor &&
          item.CommercialType === "TDS" &&
          item.onCommercialApply === "Incentive"
      );
      if (existingIncentiveIndex !== -1) {
        // Update the Amount if 'Incentive' already exists
        CommercialBreakup[existingIncentiveIndex].Amount +=
          CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
          totalIncentiveVal;
      } else {
        // Push a new 'Incentive' object if it doesn't exist
        CommercialBreakup.push({
          CommercialType: "TDS",
          onCommercialApply: "Incentive",
          Amount:
            CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
            totalIncentiveVal,
          SupplierType: supplierTypeFor,
        });
      }
    }
  }
}
const checkPLBFilter = async (
  incentiveData,
  singleFlightDetails,
  companyId,
  countryMapingVal,
  configDetails,
  supplierTypeFor,
  fareFamilyMasterGet
) => {
  //console.log(incentiveData);
  let bestMatch = true;
  if (incentiveData.length > 0) {
    for (let i = 0; i < incentiveData.length; i++) {
      const commList = incentiveData[i];
      // origin and destination
      const checkOrigin =
        commList.PLBMasterId &&
        commList.PLBMasterId.origin != null &&
        commList.PLBMasterId.origin !== "";
      const checkDestination =
        commList.PLBMasterId &&
        commList.PLBMasterId.destination != null &&
        commList.PLBMasterId.destination !== "";

      if (checkOrigin) {
        const allCountryValue = commList.PLBMasterId.origin.split(",");

        if (
          allCountryValue.includes(
            singleFlightDetails.Sectors[0].Departure.CountryCode
          )
        ) {
          // country code exists  IN, US
          bestMatch = true;
        } else {
          // does not exists country code Then Check Country Mapping Code
          const existsInCountries = (countries, allCountryValue) => {
            const countriesArray = countries.split(",");
            return allCountryValue.some((country) =>
              countriesArray.includes(country)
            );
          };

          const foundCountries = countryMapingVal.filter((obj) =>
            existsInCountries(obj.countries, allCountryValue)
          );
          if (foundCountries && foundCountries.length > 0) {
            if (
              foundCountries.includes(
                singleFlightDetails.Sectors[0].Departure.CountryCode
              )
            ) {
              // Country Code Group Exists
              bestMatch = true;
            } else {
              if (
                allCountryValue.includes(
                  singleFlightDetails.Sectors[0].Departure.CityCode
                )
              ) {
                // City  DEL, BOM
                bestMatch = true;
              } else {
                // city  Code  Not Exits
                continue;
              }
            }
          } else {
            if (
              allCountryValue.includes(
                singleFlightDetails.Sectors[0].Departure.CityCode
              )
            ) {
              // City  DEL, BOM
              bestMatch = true;
            } else {
              // city  Code  Not Exits
              continue;
            }
          }
        }
      }

      if (checkDestination) {
        const allCountryValue = commList.PLBMasterId.destination.split(",");
        const lastSectorIndex = singleFlightDetails.Sectors.length - 1;
        if (
          allCountryValue.includes(
            singleFlightDetails.Sectors[lastSectorIndex].Arrival.CountryCode
          )
        ) {
          // country code exists  IN, US
          bestMatch = true;
        } else {
          // does not exists country code Then Check Country Mapping Code
          const existsInCountries = (countries, allCountryValue) => {
            const countriesArray = countries.split(",");
            return allCountryValue.some((country) =>
              countriesArray.includes(country)
            );
          };

          const foundCountries = countryMapingVal.filter((obj) =>
            existsInCountries(obj.countries, allCountryValue)
          );

          if (foundCountries && foundCountries.length > 0) {
            if (
              foundCountries.includes(
                singleFlightDetails.Sectors[lastSectorIndex].Arrival.CountryCode
              )
            ) {
              // Country Code Group Exists
              bestMatch = true;
            } else {
              if (
                allCountryValue.includes(
                  singleFlightDetails.Sectors[0].Arrival.CityCode
                )
              ) {
                // City  DEL, BOM
                bestMatch = true;
              } else {
                // city  Code  Not Exits
                continue;
              }
            }
          } else {
            if (
              allCountryValue.includes(
                singleFlightDetails.Sectors[0].Arrival.CityCode
              )
            ) {
              // City  DEL, BOM
              bestMatch = true;
            } else {
              // city  Code  Not Exits
              continue;
            }
          }
        }
      }

      // Supplier Code
      const checksupplierCode =
        commList.PLBMasterId &&
        commList.PLBMasterId?.supplierCode &&
        commList.PLBMasterId?.supplierCode != null &&
        commList.PLBMasterId?.supplierCode !== "";

      if (checksupplierCode) {
        if (
          commList.PLBMasterId.supplierCode.supplierCode ===
          singleFlightDetails.Provider
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Airline check
      const checkairlineCode =
        commList.PLBMasterId &&
        commList.PLBMasterId?.airlineCode &&
        commList.PLBMasterId?.airlineCode != null &&
        commList.PLBMasterId?.airlineCode !== "";

      if (checkairlineCode) {
        if (
          commList.incentiveMasterId.airlineCode.airlineCode ===
          singleFlightDetails.ValCarrier
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // fare Family
      const checkfareFamily =
        commList.PLBMasterId &&
        commList.PLBMasterId?.fareFamily &&
        commList.PLBMasterId?.fareFamily != null &&
        commList.PLBMasterId?.fareFamily !== "";

      if (checkfareFamily) {
        // const matchedFareFamilyCodes = commList.PLBMasterId.fareFamily?.fareFamilyName != null ? fareFamilyMasterGet
        //   .filter(item => item.fareFamilyName === commList.PLBMasterId.fareFamily.fareFamilyName)
        //   .map(item => item.fareFamilyCode) :  [];
        if (
          commList.PLBMasterId.fareFamily.fareFamilyCode ===
            singleFlightDetails.FareFamily &&
          !["FD", "FF"].includes(singleFlightDetails.FareFamily)
        ) {
          bestMatch = true;
        } else if (
          commList.PLBMasterId.fareFamily.fareFamilyCode ===
            singleFlightDetails.FareFamily &&
          ["FD", "FF"].includes(singleFlightDetails.FareFamily)
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      } else if (["FD", "FF"].includes(singleFlightDetails.FareFamily)) {
        continue;
      }
      // Cabin class
      const checkcabinClass =
        commList.PLBMasterId &&
        commList.PLBMasterId?.cabinClass &&
        commList.PLBMasterId?.cabinClass != null &&
        commList.PLBMasterId?.cabinClass !== "";

      if (checkcabinClass) {
        if (
          commList.PLBMasterId.cabinClass.cabinClassCode ===
          singleFlightDetails.FareType
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }
      //RBD
      const checkrbd =
        commList.PLBMasterId &&
        commList.PLBMasterId?.rbd &&
        commList.PLBMasterId?.rbd != null &&
        commList.PLBMasterId?.rbd !== "";

      if (checkrbd) {
        if (
          commList.PLBMasterId.rbd ===
          singleFlightDetails.Sectors[0].FareBasisCode.charAt(0)
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // FareBasis
      const checkFareBasis =
        commList.PLBMasterId.farebasis &&
        commList.PLBMasterId.farebasis != null &&
        commList.PLBMasterId.farebasis !== "";

      if (checkFareBasis) {
        if (
          commList.PLBMasterId.farebasis ===
          singleFlightDetails.Sectors[0].FareBasisCode
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Flight No
      const checkFlightNo =
        commList.PLBMasterId.flightNo &&
        commList.PLBMasterId.flightNo != null &&
        commList.PLBMasterId.flightNo !== "";

      if (checkFlightNo) {
        if (
          commList.PLBMasterId.flightNo ===
            singleFlightDetails.Sectors[0].FltNum &&
          !singleFlightDetails.Sectors[1]
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Date Issue From
      const checkDateIssueFrom =
        commList.PLBMasterId.datefIssueFrom &&
        commList.PLBMasterId.datefIssueFrom != null &&
        commList.PLBMasterId.datefIssueFrom !== "";
      const currentDate = moment();
      if (checkDateIssueFrom) {
        if (
          currentDate >=
          moment(commList.PLBMasterId.datefIssueFrom, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Date Issue To
      const checkDateIssueTo =
        commList.PLBMasterId.datefIssueTo &&
        commList.PLBMasterId.datefIssueTo != null &&
        commList.PLBMasterId.datefIssueTo !== "";

      if (checkDateIssueTo) {
        if (
          currentDate >= moment(commList.PLBMasterId.datefIssueTo, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Travel Date From
      const checkTravelDateFrom =
        commList.PLBMasterId.travelDateFrom &&
        commList.PLBMasterId.travelDateFrom != null &&
        commList.PLBMasterId.travelDateFrom !== "";
      if (checkTravelDateFrom) {
        if (
          moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") >=
          moment(commList.PLBMasterId.travelDateFrom, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Travel Date To
      const checkTravelDateTo =
        commList.PLBMasterId.travelDateTo &&
        commList.PLBMasterId.travelDateTo != null &&
        commList.PLBMasterId.travelDateTo !== "";
      if (checkTravelDateTo) {
        if (
          moment(singleFlightDetails.Sectors[0].Departure.Date, "YYYY-MM-DD") >=
          moment(commList.PLBMasterId.travelDateTo, "YYYY-MM-DD")
        ) {
          bestMatch = true;
        } else {
          continue;
        }
      }

      // Min Price
      const checkminPrice =
        commList.PLBMasterId.minPrice &&
        commList.PLBMasterId.minPrice != null &&
        commList.PLBMasterId.minPrice !== "";

      // Max Price
      const checkmaxPrice =
        commList.PLBMasterId.maxPrice &&
        commList.PLBMasterId.maxPrice != null &&
        commList.PLBMasterId.maxPrice !== "";

      // PLB Value Type
      const checkPlbValueType =
        commList.PLBMasterId.PLBValueType &&
        commList.PLBMasterId.PLBValueType != null &&
        commList.PLBMasterId.PLBValueType !== "";
      if (checkPlbValueType) {
        if (commList.PLBMasterId.PLBValueType == "fixed") {
          const checkPLBValue =
            commList.PLBMasterId.PLBValue &&
            commList.PLBMasterId.PLBValue != null &&
            commList.PLBMasterId.PLBValue !== "" &&
            commList.PLBMasterId.PLBValue !== 0;

          if (checkPLBValue) {
            if (commList.PLBMasterId.deductTDS) {
              const tdsCheckFromConfig = configDetails.IsSuccess
                ? configDetails.data.tds || 5
                : 5;
              const tdsdeduct =
                (parseFloat(tdsCheckFromConfig) / 100) *
                commList.PLBMasterId.PLBValue;
              const totalIncentiveVal =
                commList.PLBMasterId.PLBValue - tdsdeduct;
              // check min or max

              if (checkminPrice && checkmaxPrice) {
                if (
                  !(
                    totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                    totalIncentiveVal <= commList.PLBMasterId.maxPrice
                  )
                ) {
                  continue;
                }
              } else if (checkminPrice) {
                if (!(totalIncentiveVal >= commList.PLBMasterId.minPrice)) {
                  continue;
                }
              } else if (checkmaxPrice) {
                if (!(totalIncentiveVal <= commList.PLBMasterId.maxPrice)) {
                  continue;
                }
              }
              addPLBToBreakup(
                singleFlightDetails.PriceBreakup,
                totalIncentiveVal,
                supplierTypeFor
              );
            } else {
              const totalIncentiveVal = commList.PLBMasterId.PLBValue;
              // check min or max

              if (checkminPrice && checkmaxPrice) {
                if (
                  !(
                    totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                    totalIncentiveVal <= commList.PLBMasterId.maxPrice
                  )
                ) {
                  continue;
                }
              } else if (checkminPrice) {
                if (!(totalIncentiveVal >= commList.PLBMasterId.minPrice)) {
                  continue;
                }
              } else if (checkmaxPrice) {
                if (!(totalIncentiveVal <= commList.PLBMasterId.maxPrice)) {
                  continue;
                }
              }
              addPLBToBreakup(
                singleFlightDetails.PriceBreakup,
                totalIncentiveVal,
                supplierTypeFor
              );
            }
          } else {
            continue;
          }
          //bestMatch = true;
        } else {
          // persentage condition here
          const checkPLBValue =
            commList.PLBMasterId.PLBValue &&
            commList.PLBMasterId.PLBValue != null &&
            commList.PLBMasterId.PLBValue !== "" &&
            commList.PLBMasterId.PLBValue !== 0;

          if (checkPLBValue) {
            if (commList.PLBMasterId.deductTDS) {
              const persentageValue =
                parseFloat(commList.PLBMasterId.PLBValue) / 100;
              //let totalIncentiveVal = 0;
              if (commList.PLBMasterId.PLBApplyOnBasefare) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const calculateBase = await calculateAfterCommertialPricePLB(
                    singleFlightDetails.PriceBreakup,
                    "base",
                    "ADT"
                  );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    updateOrPushPLB(
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                      totalIncentiveVal,
                      supplierTypeFor,
                      "base"
                    );
                    updateOrPushPLBTDS(
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                      parseFloat(tdsCheckFromConfig) / 100,
                      supplierTypeFor,
                      "base"
                    );
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const calculateBase = await calculateAfterCommertialPricePLB(
                    singleFlightDetails.PriceBreakup,
                    "base",
                    "CHD"
                  );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    updateOrPushPLB(
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                      totalIncentiveVal,
                      supplierTypeFor,
                      "base"
                    );
                    updateOrPushPLBTDS(
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                      parseFloat(tdsCheckFromConfig) / 100,
                      supplierTypeFor,
                      "base"
                    );
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const calculateBase = await calculateAfterCommertialPricePLB(
                    singleFlightDetails.PriceBreakup,
                    "base",
                    "INF"
                  );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
              }
              if (commList.PLBMasterId.PLBApplyOnYQ) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yqval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yqval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const yqTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yqval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup.push(
                        {
                          CommercialType: "PLB",
                          Amount: totalIncentiveVal,
                          SupplierType: supplierTypeFor,
                        }
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup.push(
                        {
                          CommercialType: "PLB",
                          Amount: totalIncentiveVal,
                          SupplierType: supplierTypeFor,
                        }
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup.push(
                        {
                          CommercialType: "PLB",
                          Amount: totalIncentiveVal,
                          SupplierType: supplierTypeFor,
                        }
                      );
                    }
                  } else {
                    singleFlightDetails.PriceBreakup[2].CommercialBreakup.push({
                      CommercialType: "PLB",
                      Amount: totalIncentiveVal,
                      SupplierType: supplierTypeFor,
                    });
                  }
                }
              }
              if (commList.PLBMasterId.PLBApplyOnYR) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yrval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yrval * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal =
                    yrTax * persentageValue -
                    parseFloat(tdsCheckFromConfig) / 100;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
              }
              if (commList.PLBMasterId.PLBApplyOnAllTAxes) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[0].Tax;

                  singleFlightDetails.PriceBreakup[0].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );

                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[1].Tax;
                  singleFlightDetails.PriceBreakup[1].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[2].Tax;
                  singleFlightDetails.PriceBreakup[2].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const tdsCheckFromConfig = configDetails.IsSuccess
                    ? configDetails.data.tds || 5
                    : 5;
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;

                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                      updateOrPushPLBTDS(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        parseFloat(tdsCheckFromConfig) / 100,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
              }
            } else {
              const persentageValue =
                parseFloat(commList.PLBMasterId.PLBValue) / 100;
              //let totalIncentiveVal = 0;
              if (commList.PLBMasterId.PLBApplyOnBasefare) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  const calculateBase = await calculateAfterCommertialPricePLB(
                    singleFlightDetails.PriceBreakup,
                    "base",
                    "ADT"
                  );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  const calculateBase = await calculateAfterCommertialPricePLB(
                    singleFlightDetails.PriceBreakup,
                    "base",
                    "CHD"
                  );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const calculateBase = await calculateAfterCommertialPricePLB(
                    singleFlightDetails.PriceBreakup,
                    "base",
                    "INF"
                  );
                  const totalIncentiveVal = calculateBase * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "base"
                      );
                    }
                  }
                }
              }
              if (commList.PLBMasterId.PLBApplyOnYQ) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }

                  const totalIncentiveVal = yqval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yqval = 0;
                  const yqTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const totalIncentiveVal = yqval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  const yqTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YQ"
                    );
                  if (yqTax) {
                    yqval = yqTax.Amount;
                  }
                  const totalIncentiveVal = yqval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushIncentive(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
              }
              if (commList.PLBMasterId.PLBApplyOnYR) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }

                  const totalIncentiveVal = yrval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const totalIncentiveVal = yrval * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let yrval = 0;
                  const yrTax =
                    singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                      (tax) => tax.TaxType === "YR"
                    );
                  if (yrTax) {
                    yrval = yrTax.Amount;
                  }
                  const totalIncentiveVal = yrTax * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor
                      );
                    }
                  }
                }
              }
              if (commList.PLBMasterId.PLBApplyOnAllTAxes) {
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[0] &&
                  Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[0].Tax;
                  singleFlightDetails.PriceBreakup[0].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );

                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[0].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[0].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[1] &&
                  Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[1].Tax;
                  singleFlightDetails.PriceBreakup[1].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[1].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[1].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
                if (
                  singleFlightDetails.PriceBreakup &&
                  singleFlightDetails.PriceBreakup[2] &&
                  Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
                ) {
                  let allTaxes = singleFlightDetails.PriceBreakup[2].Tax;
                  singleFlightDetails.PriceBreakup[2].TaxBreakup.forEach(
                    (taxItem) => {
                      if (
                        taxItem.TaxType !== "YQ" &&
                        taxItem.TaxType !== "YR"
                      ) {
                        allTaxes += taxItem.Amount;
                      }
                    }
                  );
                  const totalIncentiveVal = allTaxes * persentageValue;
                  if (checkminPrice && checkmaxPrice) {
                    if (
                      totalIncentiveVal >= commList.PLBMasterId.minPrice &&
                      totalIncentiveVal <= commList.PLBMasterId.maxPrice
                    ) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkminPrice) {
                    if (totalIncentiveVal >= commList.PLBMasterId.minPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else if (checkmaxPrice) {
                    if (totalIncentiveVal <= commList.PLBMasterId.maxPrice) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  } else {
                    const CommercialBreakup =
                      singleFlightDetails.PriceBreakup[2].CommercialBreakup;
                    if (CommercialBreakup) {
                      updateOrPushPLB(
                        singleFlightDetails.PriceBreakup[2].CommercialBreakup,
                        totalIncentiveVal,
                        supplierTypeFor,
                        "tax"
                      );
                    }
                  }
                }
              }
            }
          } else {
            continue;
          }
        }
      }
    }
  }

  return singleFlightDetails;
};

const addPLBToBreakup = (priceBreakup, totalIncentiveVal, supplierTypeFor) => {
  priceBreakup.forEach((price) => {
    if (price && price.CommercialBreakup) {
      price.CommercialBreakup.push({
        CommercialType: "PLB",
        Amount: totalIncentiveVal,
        SupplierType: supplierTypeFor,
      });
    }
  });
};

function updateOrPushPLB(
  CommercialBreakup,
  totalIncentiveVal,
  supplierTypeFor,
  type
) {
  if (type === "base") {
    const existingIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "PLB" &&
        item.onCommercialApply === "On Base"
    );
    if (existingIncentiveIndex !== -1) {
      // Update the Amount if 'Incentive' already exists
      CommercialBreakup[existingIncentiveIndex].Amount += totalIncentiveVal;
    } else {
      // Push a new 'Incentive' object if it doesn't exist
      CommercialBreakup.push({
        CommercialType: "PLB",
        onCommercialApply: "On Base",
        Amount: totalIncentiveVal,
        SupplierType: supplierTypeFor,
      });
    }
  } else if (type === "tax") {
    const existingIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "PLB" &&
        item.onCommercialApply === "tax"
    );
    if (existingIncentiveIndex !== -1) {
      // Update the Amount if 'Incentive' already exists
      CommercialBreakup[existingIncentiveIndex].Amount += totalIncentiveVal;
    } else {
      // Push a new 'Incentive' object if it doesn't exist
      CommercialBreakup.push({
        CommercialType: "PLB",
        onCommercialApply: "tax",
        Amount: totalIncentiveVal,
        SupplierType: supplierTypeFor,
      });
    }
  }
}
function updateOrPushPLBTDS(
  CommercialBreakup,
  totalIncentiveVal,
  supplierTypeFor,
  type
) {
  if (type === "base") {
    const existingcheckParentIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "PLB" &&
        item.onCommercialApply === "On Base"
    );
    if (existingcheckParentIncentiveIndex !== -1) {
      const existingIncentiveIndex = CommercialBreakup.findIndex(
        (item) =>
          item.SupplierType === supplierTypeFor &&
          item.CommercialType === "TDS" &&
          item.onCommercialApply === "PLB"
      );
      if (existingIncentiveIndex !== -1) {
        // Update the Amount if 'Incentive' already exists
        CommercialBreakup[existingIncentiveIndex].Amount +=
          CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
          totalIncentiveVal;
      } else {
        // Push a new 'Incentive' object if it doesn't exist
        CommercialBreakup.push({
          CommercialType: "TDS",
          onCommercialApply: "PLB",
          Amount:
            CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
            totalIncentiveVal,
          SupplierType: supplierTypeFor,
        });
      }
    }
  } else if (type === "tax") {
    const existingcheckParentIncentiveIndex = CommercialBreakup.findIndex(
      (item) =>
        item.SupplierType === supplierTypeFor &&
        item.CommercialType === "PLB" &&
        item.onCommercialApply === "tax"
    );
    if (existingcheckParentIncentiveIndex !== -1) {
      const existingIncentiveIndex = CommercialBreakup.findIndex(
        (item) =>
          item.SupplierType === supplierTypeFor &&
          item.CommercialType === "TDS" &&
          item.onCommercialApply === "PLB"
      );
      if (existingIncentiveIndex !== -1) {
        // Update the Amount if 'Incentive' already exists
        CommercialBreakup[existingIncentiveIndex].Amount +=
          CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
          totalIncentiveVal;
      } else {
        // Push a new 'Incentive' object if it doesn't exist
        CommercialBreakup.push({
          CommercialType: "TDS",
          onCommercialApply: "PLB",
          Amount:
            CommercialBreakup[existingcheckParentIncentiveIndex].Amount *
            totalIncentiveVal,
          SupplierType: supplierTypeFor,
        });
      }
    }
  }
}
const commertialMatrixValue = async (
  commList,
  singleFlightDetails,
  companyId,
  configDetails,
  supplierTypeFor
) => {
  // console.log("Total=====>>",singleFlightDetails.TotalPrice)
  //  console.log("b=====>>",singleFlightDetails.PriceBreakup[0].BaseFare)
  //   "[[[[[[[[[[[[[[[[",singleFlightDetails,
  //   companyId,
  //   configDetails,
  //   supplierTypeFor)

  let oldBaseFareADT = 0;
  let oldTaxFareADT = 0;
  let oldTaxBreakupADT = 0;

  let oldBaseFareCHD = 0;
  let oldTaxFareCHD = 0;
  let oldTaxBreakupCHD = 0;

  let oldBaseFareInf = 0;
  let oldTaxFareInf = 0;
  let oldTaxBreakupInf = 0;

  if (
    typeof singleFlightDetails.PriceBreakup[0] === "object" &&
    Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
  ) {
    oldBaseFareADT = singleFlightDetails.PriceBreakup[0].BaseFare;
    oldTaxFareADT = singleFlightDetails.PriceBreakup[0].Tax;
    oldTaxBreakupADT = singleFlightDetails.PriceBreakup[0].TaxBreakup;
  }

  if (
    typeof singleFlightDetails.PriceBreakup[1] === "object" &&
    Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
  ) {
    oldBaseFareCHD = singleFlightDetails.PriceBreakup[1].BaseFare;
    oldTaxFareCHD = singleFlightDetails.PriceBreakup[1].Tax;
    oldTaxBreakupCHD = singleFlightDetails.PriceBreakup[1].TaxBreakup;
  }

  if (
    typeof singleFlightDetails.PriceBreakup[2] === "object" &&
    Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
  ) {
    oldBaseFareInf = singleFlightDetails.PriceBreakup[2].BaseFare;
    oldTaxFareInf = singleFlightDetails.PriceBreakup[2].Tax;
    oldTaxBreakupInf = singleFlightDetails.PriceBreakup[2].TaxBreakup;
  }

  // Markup Rate start Here
  const markupRateAllColumn = commList.updateaircommercialmatrixes.data.filter(
    (filter) =>
      filter.AirCommertialRowMasterId.name === "Markup Rate(+)" &&
      filter.AirCommertialRowMasterId.commercialType === "rate" &&
      filter.AirCommertialRowMasterId.type === "row"
  );

  if (markupRateAllColumn.length > 0) {
    const rateSingleColumn = markupRateAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Rate %" &&
        filter.AirCommertialColumnMasterId.commercialType === "rate" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      rateSingleColumn &&
      rateSingleColumn.textType === "number" &&
      rateSingleColumn.value != "0"
    ) {
      const serviceRate =
        rateSingleColumn.textType === "number"
          ? parseFloat(rateSingleColumn.value)
          : 0;

      // Exclude Child and infant finction here
      const excludeChildSingleColumn = markupRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Child" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const excludeInFantSingleColumn = markupRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Infant" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const isExcludeChildChecked =
        excludeChildSingleColumn?.textType === "checkbox" &&
        excludeChildSingleColumn.value;
      const isExcludeInfantChecked =
        excludeInFantSingleColumn?.textType === "checkbox" &&
        excludeInFantSingleColumn.value;

      // Exclude Child and infant finction end

      const applyServiceRateToBaseFare = (fare) => {
        if (!(Object.keys(fare).length === 0)) {
          const existingBookingFeesIndex = fare.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "Markup" &&
              item.onCommercialApply === "Base Fare"
          );
          if (existingBookingFeesIndex !== -1) {
            fare.CommercialBreakup[existingBookingFeesIndex].Amount +=
              (parseFloat(serviceRate) / 100) * fare.BaseFare;
            fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
          } else {
            fare.CommercialBreakup.push({
              CommercialType: "Markup",
              onCommercialApply: "Base Fare",
              Amount: (parseFloat(serviceRate) / 100) * fare.BaseFare,
              SupplierType: supplierTypeFor,
            });
            fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
          }
          //fare.MarkUp += (parseFloat(serviceRate) / 100) * fare.BaseFare;
          //fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
        }
      };

      const baseFareSingleColumn = markupRateAllColumn.find(
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // On other Tax
      const applyServiceRateToOnOtherTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            if (taxItem.TaxType !== "YQ" && taxItem.TaxType !== "YR") {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "Markup" &&
                  item.onCommercialApply === "On Other Tax"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  (parseFloat(serviceRate) / 100) * taxItem.Amount;
                taxItem.Amount +=
                  (parseFloat(serviceRate) / 100) * taxItem.Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "Markup",
                  onCommercialApply: "On Other Tax",
                  Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                  SupplierType: supplierTypeFor,
                });
                taxItem.Amount +=
                  (parseFloat(serviceRate) / 100) * taxItem.Amount;
              }
              //tax.MarkUp += (parseFloat(serviceRate) / 100) * taxItem.Amount;
            }
          });
        }
      };

      const onOtherTaxSingleColumn = markupRateAllColumn.find(
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
    }
  }

  // End Markup Rate End here

  // Fixed Markup ( + ) START HERE
  const fixedMarkupAllColumn = commList.updateaircommercialmatrixes.data.filter(
    (filter) =>
      filter.AirCommertialRowMasterId.name === "Fixed Markup (+)" &&
      filter.AirCommertialRowMasterId.commercialType === "fixed" &&
      filter.AirCommertialRowMasterId.type === "row"
  );

  if (fixedMarkupAllColumn.length > 0) {
    const fixedAdultSingleColumn = fixedMarkupAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Adult" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedChildSingleColumn = fixedMarkupAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Child" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedInfantSingleColumn = fixedMarkupAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Infant" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      fixedAdultSingleColumn &&
      fixedChildSingleColumn &&
      fixedInfantSingleColumn &&
      (fixedAdultSingleColumn.value != 0 ||
        fixedChildSingleColumn.value != 0 ||
        fixedInfantSingleColumn.value != 0)
    ) {
      const fixedAdultRate =
        fixedAdultSingleColumn.textType === "number"
          ? parseFloat(fixedAdultSingleColumn.value)
          : 0;
      const fixedChildRate =
        fixedChildSingleColumn.textType === "number"
          ? parseFloat(fixedChildSingleColumn.value)
          : 0;

      const fixedInfantRate =
        fixedInfantSingleColumn.textType === "number"
          ? parseFloat(fixedInfantSingleColumn.value)
          : 0;

      // Base Other Taxes START HERE

      const applyFixedMarkupFeeToBaseOtherTaxes = async (
        singleFlightDetails,
        tax,
        type,
        fixedAmount,
        fixedMarkupAllColumn,
        supplierTypeFor
      ) => {
        const baseOtherTaxesSingleColumn = fixedMarkupAllColumn.find(
          (filter) =>
            filter.AirCommertialColumnMasterId.name === "Base / Other Taxes" &&
            filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
            filter.AirCommertialColumnMasterId.type === "coloumn"
        );

        if (
          baseOtherTaxesSingleColumn?.textType === "dropdown" &&
          baseOtherTaxesSingleColumn.value === "Base"
        ) {
          const gstPersentageSingleColumn = fixedMarkupAllColumn.find(
            (filter) =>
              filter.AirCommertialColumnMasterId.name === "GST" &&
              filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
              filter.AirCommertialColumnMasterId.type === "coloumn"
          );

          if (gstPersentageSingleColumn?.textType === "number") {
            if (type === "ADT") {
              if (
                !(Object.keys(singleFlightDetails.PriceBreakup[0]).length === 0)
              ) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "otherTax" &&
                      item.onCommercialApply === "Base"
                  );
                if (existingBookingFeesIndex !== -1) {
                  tax.BaseFare += fixedAmount;
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                    (parseFloat(gstPersentageSingleColumn.value) / 100) *
                    fixedAmount;
                } else {
                  tax.CommercialBreakup.push({
                    CommercialType: "otherTax",
                    onCommercialApply: "Base",
                    Amount:
                      (parseFloat(gstPersentageSingleColumn.value) / 100) *
                      fixedAmount,
                    SupplierType: supplierTypeFor,
                  });
                  tax.BaseFare += fixedAmount;
                }
                // const K2TaxADT =
                //   singleFlightDetails.PriceBreakup[0].TaxBreakup.find(
                //     (tax) => tax.TaxType != "K2"
                //   );
                // if(K2TaxADT){
                //   K2TaxADT.Amount += (parseFloat(values) / 100) * fixedAdultRate;
                // }else{
                //   tax.gst += (parseFloat(values) / 100) * fixedAdultRate;
                // }
              }
            } else if (type === "CHD") {
              if (
                !(Object.keys(singleFlightDetails.PriceBreakup[1]).length === 0)
              ) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "otherTax" &&
                      item.onCommercialApply === "Base"
                  );
                if (existingBookingFeesIndex !== -1) {
                  tax.BaseFare += fixedAmount;
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                    (parseFloat(gstPersentageSingleColumn.value) / 100) *
                    fixedAmount;
                } else {
                  tax.CommercialBreakup.push({
                    CommercialType: "otherTax",
                    onCommercialApply: "Base",
                    Amount:
                      (parseFloat(gstPersentageSingleColumn.value) / 100) *
                      fixedAmount,
                    SupplierType: supplierTypeFor,
                  });
                  tax.BaseFare += fixedAmount;
                }
                // const K2TaxADT =
                //   singleFlightDetails.PriceBreakup[1].TaxBreakup.find(
                //     (tax) => tax.TaxType != "K2"
                //   );
                // if(K2TaxADT){
                //   K2TaxADT.Amount += (parseFloat(values) / 100) * fixedChildRate;
                // }else{
                //   tax.gst += (parseFloat(values) / 100) * fixedChildRate;
                // }
              }
            } else if (type === "INF") {
              if (
                !(Object.keys(singleFlightDetails.PriceBreakup[2]).length === 0)
              ) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "otherTax" &&
                      item.onCommercialApply === "Base"
                  );
                if (existingBookingFeesIndex !== -1) {
                  tax.BaseFare += fixedAmount;
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                    (parseFloat(gstPersentageSingleColumn.value) / 100) *
                    fixedAmount;
                } else {
                  tax.CommercialBreakup.push({
                    CommercialType: "otherTax",
                    onCommercialApply: "Base",
                    Amount:
                      (parseFloat(gstPersentageSingleColumn.value) / 100) *
                      fixedAmount,
                    SupplierType: supplierTypeFor,
                  });
                  tax.BaseFare += fixedAmount;
                }
                // const K2TaxADT =
                //   singleFlightDetails.PriceBreakup[2].TaxBreakup.find(
                //     (tax) => tax.TaxType != "K2"
                //   );
                // if(K2TaxADT){
                //   K2TaxADT.Amount += (parseFloat(values) / 100) * fixedInfantRate;
                // }else{
                //   tax.gst += (parseFloat(values) / 100) * fixedInfantRate;
                // }
              }
            }
          }
        } else {
          // for tax here
          // unset this object for tax
          tax.CommercialBreakup = tax.CommercialBreakup.filter(
            (item) =>
              !(
                item.CommercialType === "Markup" &&
                (item.onCommercialApply === "Onward Only" ||
                  item.onCommercialApply === "Per Airline Per Pax" ||
                  item.onCommercialApply === "Per PNR PER Ticket" ||
                  item.onCommercialApply === "Per Pax per sector" ||
                  item.onCommercialApply === "Per Flight Per Pax") &&
                item.SupplierType === supplierTypeFor
              )
          );

          if (type === "ADT") {
            if (
              !(Object.keys(singleFlightDetails.PriceBreakup[0]).length === 0)
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "otherTax" &&
                  item.onCommercialApply === "Tax"
              );

              if (existingBookingFeesIndex !== -1) {
                //tax.BaseFare += fixedAmount;
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedAmount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "otherTax",
                  onCommercialApply: "Tax",
                  Amount: fixedAmount,
                  SupplierType: supplierTypeFor,
                });
                //tax.BaseFare += fixedAmount;
              }
            }
          } else if (type === "CHD") {
            if (
              !(Object.keys(singleFlightDetails.PriceBreakup[1]).length === 0)
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "otherTax" &&
                  item.onCommercialApply === "Tax"
              );
              if (existingBookingFeesIndex !== -1) {
                // tax.BaseFare += fixedAmount;
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedAmount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "otherTax",
                  onCommercialApply: "Tax",
                  Amount: fixedAmount,
                  SupplierType: supplierTypeFor,
                });
                // tax.BaseFare += fixedAmount;
              }
            }
          } else if (type === "INF") {
            if (
              !(Object.keys(singleFlightDetails.PriceBreakup[2]).length === 0)
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "otherTax" &&
                  item.onCommercialApply === "Tax"
              );

              if (existingBookingFeesIndex !== -1) {
                // tax.BaseFare += fixedAmount;
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedAmount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "otherTax",
                  onCommercialApply: "Tax",
                  Amount: fixedAmount,
                  SupplierType: supplierTypeFor,
                });
                //tax.BaseFare += fixedAmount;
              }
            }
          }
        }
      };

      // const baseOtherTaxesSingleColumn = fixedMarkupAllColumn.find(
      //   (filter) =>
      //     filter.AirCommertialColumnMasterId.name === "Base / Other Taxes" &&
      //     filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
      //     filter.AirCommertialColumnMasterId.type === "coloumn"
      // );

      // if (
      //   baseOtherTaxesSingleColumn?.textType === "dropdown" &&
      //   baseOtherTaxesSingleColumn.value === "Base"
      // ) {

      //   const gstPersentageSingleColumn = fixedMarkupAllColumn.find(
      //     (filter) =>
      //       filter.AirCommertialColumnMasterId.name === "GST" &&
      //       filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
      //       filter.AirCommertialColumnMasterId.type === "coloumn"
      //   );

      //   if (
      //     gstPersentageSingleColumn?.textType === "number" &&
      //     gstPersentageSingleColumn.value != "0"
      //   ) {
      //     //apply on base on k2 or gst

      //     if (singleFlightDetails.PriceBreakup[0] && Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0) {

      //       applyFixedMarkupFeeToBaseOtherTaxes(
      //       singleFlightDetails,
      //       gstPersentageSingleColumn.value,
      //       singleFlightDetails.PriceBreakup[0],
      //       "ADT",
      //       fixedAmount,
      //       supplierTypeFor
      //     );
      //     }
      //     if (singleFlightDetails.PriceBreakup[1] && Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0) {
      //     applyFixedMarkupFeeToBaseOtherTaxes(
      //       singleFlightDetails,
      //       gstPersentageSingleColumn.value,
      //       singleFlightDetails.PriceBreakup[1],
      //       "CHD",
      //       supplierTypeFor
      //     );
      //     }
      //     if (singleFlightDetails.PriceBreakup[2] && Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0) {
      //     applyFixedMarkupFeeToBaseOtherTaxes(
      //       singleFlightDetails,
      //       gstPersentageSingleColumn.value,
      //       singleFlightDetails.PriceBreakup[2],
      //       "INF",
      //       supplierTypeFor
      //     );
      //     }
      //   }
      // } else {
      //   // apply to other tax ( ot )
      //   if (singleFlightDetails.PriceBreakup[0] && Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0) {
      //   applyFixedMarkupFeeToBaseOtherTaxes(
      //     singleFlightDetails,
      //     "tax",
      //     singleFlightDetails.PriceBreakup[0],
      //     "ADT",
      //     supplierTypeFor
      //   );
      //   }
      //   if (singleFlightDetails.PriceBreakup[1] && Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0) {
      //   applyFixedMarkupFeeToBaseOtherTaxes(
      //     singleFlightDetails,
      //     "tax",
      //     singleFlightDetails.PriceBreakup[1],
      //     "CHD",
      //     supplierTypeFor
      //   );
      //   }
      //   if (singleFlightDetails.PriceBreakup[2] && Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0) {
      //   applyFixedMarkupFeeToBaseOtherTaxes(
      //     singleFlightDetails,
      //     "tax",
      //     singleFlightDetails.PriceBreakup[2],
      //     "INF",
      //     supplierTypeFor
      //   );
      //   }
      // }
      // Base Other Taxes END HERE

      // on word only start here
      const applyFixedMarkupToOnWardOnly = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            if (
              singleFlightDetails.PriceBreakup[0] &&
              Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.onCommercialApply === "Onward Only"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedAdultRate;

                applyFixedMarkupFeeToBaseOtherTaxes(
                  singleFlightDetails,
                  singleFlightDetails.PriceBreakup[0],
                  "ADT",
                  fixedAdultRate,
                  fixedMarkupAllColumn,
                  supplierTypeFor
                );
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "Markup",
                  onCommercialApply: "Onward Only",
                  Amount: fixedAdultRate,
                  SupplierType: supplierTypeFor,
                });
                applyFixedMarkupFeeToBaseOtherTaxes(
                  singleFlightDetails,
                  singleFlightDetails.PriceBreakup[0],
                  "ADT",
                  fixedAdultRate,
                  fixedMarkupAllColumn,
                  supplierTypeFor
                );
              }
            }

            //tax.MarkUp += fixedAdultRate;
          } else if (type === "CHD") {
            if (
              singleFlightDetails.PriceBreakup[1] &&
              Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.onCommercialApply === "Onward Only"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedChildRate;
                applyFixedMarkupFeeToBaseOtherTaxes(
                  singleFlightDetails,
                  singleFlightDetails.PriceBreakup[1],
                  "CHD",
                  fixedChildRate,
                  fixedMarkupAllColumn,
                  supplierTypeFor
                );
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "Markup",
                  onCommercialApply: "Onward Only",
                  Amount: fixedChildRate,
                  SupplierType: supplierTypeFor,
                });
                applyFixedMarkupFeeToBaseOtherTaxes(
                  singleFlightDetails,
                  singleFlightDetails.PriceBreakup[1],
                  "CHD",
                  fixedChildRate,
                  fixedMarkupAllColumn,
                  supplierTypeFor
                );
              }
            }

            // tax.MarkUp += fixedChildRate;
          } else if (type === "INF") {
            if (
              singleFlightDetails.PriceBreakup[2] &&
              Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.onCommercialApply === "Onward Only"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedInfantRate;
                applyFixedMarkupFeeToBaseOtherTaxes(
                  singleFlightDetails,
                  singleFlightDetails.PriceBreakup[2],
                  "INF",
                  fixedInfantRate,
                  fixedMarkupAllColumn,
                  supplierTypeFor
                );
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "Markup",
                  onCommercialApply: "Onward Only",
                  Amount: fixedInfantRate,
                  SupplierType: supplierTypeFor,
                });
                applyFixedMarkupFeeToBaseOtherTaxes(
                  singleFlightDetails,
                  singleFlightDetails.PriceBreakup[2],
                  "INF",
                  fixedInfantRate,
                  fixedMarkupAllColumn,
                  supplierTypeFor
                );
              }
            }

            //tax.MarkUp += fixedInfantRate;
          }
        }
      };

      const onWardOnlySingleColumn = fixedMarkupAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Onward Only" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onWardOnlySingleColumn?.textType === "checkbox" &&
        onWardOnlySingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedMarkupToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedMarkupToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedMarkupToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }

      // on word only  End

      // Non Zero Only Start Here
      const applyFixedMarkupFeeToNonZeroOnly = (
        singleFlightDetails,
        tax,
        type
      ) => {
        if (tax) {
          // const countAirline = tax.CommercialBreakup.find((commercial) => commercial.CommercialType === "SegmentKickback");
          // if (countAirline) {
          //   const totalCount = Object.values(fltNumCount).reduce((sum, count) => sum + count, 0);
          //   if (type === "ADT") {
          //     countAirline.Amount = totalCount * fixedAdultRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedAdultRate);
          //   } else if (type === "CHD") {
          //     countAirline.Amount = totalCount * fixedChildRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedChildRate);
          //   } else if (type === "INF") {
          //     countAirline.Amount = totalCount * fixedInfantRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedInfantRate);
          //   }
          // }
        }
      };

      const nonZeroOnlySingleColumn = fixedMarkupAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Non Zero Only" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        nonZeroOnlySingleColumn?.textType === "checkbox" &&
        nonZeroOnlySingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedMarkupFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT"
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedMarkupFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedMarkupFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // Non Zero Only End Here

      // Per Airline Per Pax Start Here
      const applyFixedMarkupFeeToPerAirlinePerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });

          const totalCount = Object.values(fltNumCount).reduce(
            (sum, count) => sum + count,
            0
          );
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });

              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += totalCount * fixedAdultRate;
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += totalCount * fixedChildRate;
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += totalCount * fixedInfantRate;
          }
        }
      };

      const perAirlinePerPaxSingleColumn = fixedMarkupAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Airline Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perAirlinePerPaxSingleColumn?.textType === "checkbox" &&
        perAirlinePerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedMarkupFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedMarkupFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedMarkupFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per Airline Per Pax End Here

      // Per PNR PER Ticket start Here
      const applyFixedMarkupFeeToPerPnrPerTicket = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per PNR PER Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per PNR PER Ticket",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            // tax.MarkUp += fixedAdultRate;
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per PNR PER Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per PNR PER Ticket",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            // tax.MarkUp += fixedChildRate;
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per PNR PER Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per PNR PER Ticket",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += fixedInfantRate;
          }
        }
      };

      const perPntperTicketSingleColumn = fixedMarkupAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pnr Per Ticket" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPntperTicketSingleColumn?.textType === "checkbox" &&
        perPntperTicketSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedMarkupFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedMarkupFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedMarkupFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per PNR per Ticket End Here

      // Per Pax per sector start here
      const applyFixedMarkupFeeToPerPaxperSector = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Pax per sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Pax per sector",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            // tax.MarkUp += fixedAdultRate;
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Pax per sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Pax per sector",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += fixedChildRate;
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Pax per sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Pax per sector",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += fixedInfantRate;
          }
        }
      };

      const perPaxPerSectorSingleColumn = fixedMarkupAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pax Per Sector" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPaxPerSectorSingleColumn?.textType === "checkbox" &&
        perPaxPerSectorSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedMarkupFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedMarkupFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedMarkupFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // per pax per sector end here

      // Per FLight Per Pax Start Here
      const applyFixedMarkupFeeToPerFlightPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();
          singleFlightDetails.Sectors.forEach((sector) => {
            const AirlineCode = sector.AirlineCode;

            if (AirlineCode && !encounteredFltNums.has(AirlineCode)) {
              if (fltNumCount[AirlineCode] === undefined) {
                fltNumCount[AirlineCode] = 1;
              } else {
                fltNumCount[AirlineCode]++;
              }

              encounteredFltNums.add(AirlineCode);
            }
          });
          const totalCount = Object.values(fltNumCount).reduce(
            (sum, count) => sum + count,
            0
          );

          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[0],
                "ADT",
                fixedAdultRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            //tax.MarkUp += totalCount * fixedAdultRate;
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[1],
                "CHD",
                fixedChildRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            // tax.MarkUp += totalCount * fixedChildRate;
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Markup",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
              applyFixedMarkupFeeToBaseOtherTaxes(
                singleFlightDetails,
                singleFlightDetails.PriceBreakup[2],
                "INF",
                fixedInfantRate,
                fixedMarkupAllColumn,
                supplierTypeFor
              );
            }
            // tax.MarkUp += totalCount * fixedInfantRate;
          }
        }
      };

      const perFlightPerPaxSingleColumn = fixedMarkupAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Flight Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perFlightPerPaxSingleColumn?.textType === "checkbox" &&
        perFlightPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedMarkupFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedMarkupFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedMarkupFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per Flight Per Pax End Here
    }
  }
  // FIXED MARKUP ( + ) END HERE

  // service fee rate start here
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

    if (
      rateSingleColumn &&
      rateSingleColumn.textType === "number" &&
      rateSingleColumn.value != "0"
    ) {
      const serviceRate =
        rateSingleColumn.textType === "number"
          ? parseFloat(rateSingleColumn.value)
          : 0;

      // Exclude Child and infant finction here
      const excludeChildSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Child" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const excludeInFantSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Infant" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const isExcludeChildChecked =
        excludeChildSingleColumn?.textType === "checkbox" &&
        excludeChildSingleColumn.value;
      const isExcludeInfantChecked =
        excludeInFantSingleColumn?.textType === "checkbox" &&
        excludeInFantSingleColumn.value;

      // Exclude Child and infant finction end
      const applyServiceRateToTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yqTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YQ");
          if (yqTax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "ServiceFees" &&
                item.onCommercialApply === "On Fuel Surcharge"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * yqTax.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "ServiceFees",
                onCommercialApply: "On Fuel Surcharge",
                Amount: (parseFloat(serviceRate) / 100) * yqTax.Amount,
                SupplierType: supplierTypeFor,
              });
            }
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
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToTax(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToTax(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }

      const applyServiceRateToBaseFare = (fare) => {
        if (!(Object.keys(fare).length === 0)) {
          const existingBookingFeesIndex = fare.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "ServiceFees" &&
              item.onCommercialApply === "Base Fare"
          );

          if (existingBookingFeesIndex !== -1) {
            fare.CommercialBreakup[existingBookingFeesIndex].Amount +=
              (parseFloat(serviceRate) / 100) * fare.BaseFare;
          } else {
            fare.CommercialBreakup.push({
              CommercialType: "ServiceFees",
              onCommercialApply: "Base Fare",
              Amount: (parseFloat(serviceRate) / 100) * fare.BaseFare,
              SupplierType: supplierTypeFor,
            });
          }

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
        if (isExcludeChildChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // On other Tax
      const applyServiceRateToOnOtherTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            if (taxItem.TaxType !== "YQ" && taxItem.TaxType !== "YR") {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "ServiceFees" &&
                  item.onCommercialApply === "On Other Tax"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  (parseFloat(serviceRate) / 100) * taxItem.Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "ServiceFees",
                  onCommercialApply: "On Other Tax",
                  Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          });
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }

      // On YR here
      const applyServiceRateToOnYR = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yrTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YR");
          if (yrTax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "ServiceFees" &&
                item.onCommercialApply === "On YR"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * yrTax.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "ServiceFees",
                onCommercialApply: "On YR",
                Amount: (parseFloat(serviceRate) / 100) * yrTax.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onYRSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On YR" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (onYRSingleColumn?.textType === "checkbox" && onYRSingleColumn.value) {
        applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }
      // on yR end
      //On Gross here
      const applyServiceRateToOnGross = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "ServiceFees" &&
                item.onCommercialApply === "On Gross"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * taxItem.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "ServiceFees",
                onCommercialApply: "On Gross",
                Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          });

          if ("BaseFare" in tax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "ServiceFees" &&
                item.onCommercialApply === "On Gross"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * tax.BaseFare;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "ServiceFees",
                onCommercialApply: "On Gross",
                Amount: (parseFloat(serviceRate) / 100) * tax.BaseFare,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onGrossSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On Gross" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onGrossSingleColumn?.textType === "checkbox" &&
        onGrossSingleColumn.value
      ) {
        applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }

      //on gross end

      // GST Start Here
      const applyServiceRateToGst = async (tax, type, supplierTypeFor) => {
        if (tax && Object.keys(tax).length !== 0) {
          // let getAgentConfig = await agentConfig.findOne({
          //   companyId: companyId,
          // });
          // console.log(getAgentConfig);
          // if (getAgentConfig) {
          //  tax.gst += getAgentConfig.discountPercentage
          // }

          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "ServiceFees"
          );

          if (existingBookingFeesIndex !== -1) {
            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );

            if (existingGSTIndex !== -1) {
              //const tdsCheckFromConfig = configDetails.IsSuccess ? (configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 !== undefined ? configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 : 0 || 0) : 0;

              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) *
                tax.CommercialBreakup[existingBookingFeesIndex].Amount;
            } else {
              //const tdsCheckFromConfig = configDetails.IsSuccess ? (configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 || 0) : 0;

              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount:
                  (parseFloat(18) / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount,
                SupplierType: supplierTypeFor,
              });
            }
          } else {
            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              //const tdsCheckFromConfig = configDetails.IsSuccess ? (configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 || 0) : 0;
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) * 0;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount: (parseFloat(18) / 100) * 0,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onGstSingleColumn = serviceFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "GST" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onGstSingleColumn &&
        onGstSingleColumn.textType === "checkbox" &&
        onGstSingleColumn.value
      ) {
        applyServiceRateToGst(
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          supplierTypeFor
        );
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToGst(
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToGst(
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // GST END
    }
  }
  // service fee rate end here

  // Discount ( - ) here
  const discountPersentageAllColumn =
    commList.updateaircommercialmatrixes.data.filter(
      (filter) =>
        filter.AirCommertialRowMasterId.name === "Discount (-)" &&
        filter.AirCommertialRowMasterId.commercialType === "rate" &&
        filter.AirCommertialRowMasterId.type === "row"
    );

  if (discountPersentageAllColumn.length > 0) {
    const rateSingleColumn = discountPersentageAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Rate %" &&
        filter.AirCommertialColumnMasterId.commercialType === "rate" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      rateSingleColumn &&
      rateSingleColumn.textType === "number" &&
      rateSingleColumn.value != "0"
    ) {
      const serviceRate =
        rateSingleColumn.textType === "number"
          ? parseFloat(rateSingleColumn.value)
          : 0;

      // Exclude Child and infant finction here
      const excludeChildSingleColumn = discountPersentageAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Child" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const excludeInFantSingleColumn = discountPersentageAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Infant" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const isExcludeChildChecked =
        excludeChildSingleColumn?.textType === "checkbox" &&
        excludeChildSingleColumn.value;
      const isExcludeInfantChecked =
        excludeInFantSingleColumn?.textType === "checkbox" &&
        excludeInFantSingleColumn.value;

      // Exclude Child and infant finction end
      const applyServiceRateToTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yqTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YQ");
          if (yqTax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "Discount"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * yqTax.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Discount",
                Amount: (parseFloat(serviceRate) / 100) * yqTax.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onFuleSurchargeSingleColumn = discountPersentageAllColumn.find(
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
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToTax(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToTax(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }

      const applyServiceRateToBaseFare = (fare) => {
        if (!(Object.keys(fare).length === 0)) {
          const existingBookingFeesIndex = fare.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "Discount"
          );
          if (existingBookingFeesIndex !== -1) {
            fare.CommercialBreakup[existingBookingFeesIndex].Amount +=
              (parseFloat(serviceRate) / 100) * fare.BaseFare;
          } else {
            fare.CommercialBreakup.push({
              CommercialType: "Discount",
              Amount: (parseFloat(serviceRate) / 100) * fare.BaseFare,
              SupplierType: supplierTypeFor,
            });
          }

          //fare.BaseFare += (parseFloat(serviceRate) / 100) * fare.BaseFare;
        }
      };

      const baseFareSingleColumn = discountPersentageAllColumn.find(
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // On other Tax
      const applyServiceRateToOnOtherTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            if (taxItem.TaxType !== "YQ" && taxItem.TaxType !== "YR") {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "Discount"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  (parseFloat(serviceRate) / 100) * taxItem.Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "Discount",
                  Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          });
        }
      };

      const onOtherTaxSingleColumn = discountPersentageAllColumn.find(
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }

      // On YR here
      const applyServiceRateToOnYR = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yrTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YR");
          if (yrTax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "Discount"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * yrTax.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Discount",
                Amount: (parseFloat(serviceRate) / 100) * yrTax.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onYRSingleColumn = discountPersentageAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On YR" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (onYRSingleColumn?.textType === "checkbox" && onYRSingleColumn.value) {
        applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }
      // on yR end
      //On Gross here
      const applyServiceRateToOnGross = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "Discount"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * taxItem.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Discount",
                Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          });

          if ("BaseFare" in tax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "Discount"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * tax.BaseFare;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "Discount",
                Amount: (parseFloat(serviceRate) / 100) * tax.BaseFare,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onGrossSingleColumn = discountPersentageAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On Gross" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onGrossSingleColumn?.textType === "checkbox" &&
        onGrossSingleColumn.value
      ) {
        applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }

      //on gross end

      // TDS Start Here
      const applyServiceRateToTDS = async (tax, type) => {
        if (tax && Object.keys(tax).length !== 0) {
          // let getAgentConfig = await agentConfig.findOne({
          //   companyId: companyId,
          // });
          // console.log(getAgentConfig);
          // if (getAgentConfig) {
          //  tax.TDS += getAgentConfig.tds
          // }
          const tdsCheckFromConfig = configDetails.IsSuccess
            ? configDetails.data.tds || 5
            : 5;
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "Discount"
          );
          if (existingBookingFeesIndex !== -1) {
            //tax.CommercialBreakup[existingBookingFeesIndex].Amount += (parseFloat(serviceRate) / 100) * tax.BaseFare;
            const existingTDSIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.onCommercialApply === "Discount"
            );
            if (existingTDSIndex !== -1) {
              //tax.CommercialBreakup[existingBookingFeesIndex].Amount = tax.CommercialBreakup[existingBookingFeesIndex].Amount - (parseFloat(tdsCheckFromConfig) / 100) ;
              //tax.CommercialBreakup[existingTDSIndex].Amount += (parseFloat(tdsCheckFromConfig) / 100);
              tax.CommercialBreakup[existingTDSIndex].Amount +=
                (parseFloat(tdsCheckFromConfig) / 100) *
                tax.CommercialBreakup[existingBookingFeesIndex].Amount;
            } else {
              //tax.CommercialBreakup[existingBookingFeesIndex].Amount = tax.CommercialBreakup[existingBookingFeesIndex].Amount - (parseFloat(tdsCheckFromConfig) / 100) ;
              tax.CommercialBreakup.push({
                CommercialType: "TDS",
                onCommercialApply: "Discount",
                Amount:
                  (parseFloat(tdsCheckFromConfig) / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount,
                SupplierType: supplierTypeFor,
              });
            }
          }
          // else {
          //   const existingTDSIndex = tax.CommercialBreakup.findIndex(item => item.SupplierType === supplierTypeFor && item.CommercialType === 'TDS');
          //   if (existingTDSIndex !== -1) {
          //     tax.CommercialBreakup[existingTDSIndex].Amount += (parseFloat(tdsCheckFromConfig) / 100) * 0;
          //   } else {
          //     tax.CommercialBreakup.push({
          //           CommercialType: "TDS",
          //           Amount: (parseFloat(tdsCheckFromConfig) / 100) * 0,
          //           SupplierType: supplierTypeFor
          //       });
          //   }

          // }
        }
      };

      const onTdsSingleColumn = discountPersentageAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Deduct TDS" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onTdsSingleColumn?.textType === "checkbox" &&
        onTdsSingleColumn.value
      ) {
        applyServiceRateToTDS(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToTDS(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToTDS(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }
      // TDS END
    }
  }
  // Discount ( - ) end here

  // Booking Fee Rate(+) start here

  const bookingFeeRateAllColumn =
    commList.updateaircommercialmatrixes.data.filter(
      (filter) =>
        filter.AirCommertialRowMasterId.name === "Booking Fee Rate(+)" &&
        filter.AirCommertialRowMasterId.commercialType === "rate" &&
        filter.AirCommertialRowMasterId.type === "row"
    );

  if (bookingFeeRateAllColumn.length > 0) {
    const rateSingleColumn = bookingFeeRateAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Rate %" &&
        filter.AirCommertialColumnMasterId.commercialType === "rate" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      rateSingleColumn &&
      rateSingleColumn.textType === "number" &&
      rateSingleColumn.value != "0"
    ) {
      const serviceRate =
        rateSingleColumn.textType === "number"
          ? parseFloat(rateSingleColumn.value)
          : 0;

      // Exclude Child and infant finction here
      const excludeChildSingleColumn = bookingFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Child" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const excludeInFantSingleColumn = bookingFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Exclude Infant" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );
      const isExcludeChildChecked =
        excludeChildSingleColumn?.textType === "checkbox" &&
        excludeChildSingleColumn.value;
      const isExcludeInfantChecked =
        excludeInFantSingleColumn?.textType === "checkbox" &&
        excludeInFantSingleColumn.value;

      // Exclude Child and infant finction end
      const applyServiceRateToTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yqTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YQ");
          if (yqTax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "BookingFees" &&
                item.onCommercialApply === "On Fuel Surcharge"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * yqTax.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "BookingFees",
                onCommercialApply: "On Fuel Surcharge",
                Amount: (parseFloat(serviceRate) / 100) * yqTax.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onFuleSurchargeSingleColumn = bookingFeeRateAllColumn.find(
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
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToTax(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToTax(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }

      const applyServiceRateToBaseFare = (fare) => {
        if (!(Object.keys(fare).length === 0)) {
          const existingBookingFeesIndex = fare.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "BookingFees" &&
              item.onCommercialApply === "Base Fare"
          );
          if (existingBookingFeesIndex !== -1) {
            fare.CommercialBreakup[existingBookingFeesIndex].Amount +=
              (parseFloat(serviceRate) / 100) * fare.BaseFare;
          } else {
            fare.CommercialBreakup.push({
              CommercialType: "BookingFees",
              onCommercialApply: "Base Fare",
              Amount: (parseFloat(serviceRate) / 100) * fare.BaseFare,
              SupplierType: supplierTypeFor,
            });
          }
        }
      };

      const baseFareSingleColumn = bookingFeeRateAllColumn.find(
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToBaseFare(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // On other Tax
      const applyServiceRateToOnOtherTax = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            if (taxItem.TaxType !== "YQ" && taxItem.TaxType !== "YR") {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "BookingFees" &&
                  item.onCommercialApply === "On Other Tax"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  (parseFloat(serviceRate) / 100) * taxItem.Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "BookingFees",
                  onCommercialApply: "On Other Tax",
                  Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          });
        }
      };

      const onOtherTaxSingleColumn = bookingFeeRateAllColumn.find(
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
        if (isExcludeChildChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }

        if (isExcludeInfantChecked != true) {
          applyServiceRateToOnOtherTax(
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }

      // On YR here
      const applyServiceRateToOnYR = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          const yrTax = tax.TaxBreakup.find((tax) => tax.TaxType === "YR");
          if (yrTax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "BookingFees" &&
                item.onCommercialApply === "On YR"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * yrTax.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "BookingFees",
                onCommercialApply: "On YR",
                Amount: (parseFloat(serviceRate) / 100) * yrTax.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onYRSingleColumn = bookingFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On YR" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (onYRSingleColumn?.textType === "checkbox" && onYRSingleColumn.value) {
        applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToOnYR(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }
      // on yR end
      //On Gross here
      const applyServiceRateToOnGross = (tax, type) => {
        if (
          !(Object.keys(tax).length === 0) &&
          !(Object.keys(tax.TaxBreakup).length === 0)
        ) {
          tax.TaxBreakup.forEach((taxItem) => {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "BookingFees" &&
                item.onCommercialApply === "On Gross"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * taxItem.Amount;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "BookingFees",
                onCommercialApply: "On Gross",
                Amount: (parseFloat(serviceRate) / 100) * taxItem.Amount,
                SupplierType: supplierTypeFor,
              });
            }
          });

          if ("BaseFare" in tax) {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "BookingFees" &&
                item.onCommercialApply === "On Gross"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                (parseFloat(serviceRate) / 100) * tax.BaseFare;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "BookingFees",
                onCommercialApply: "On Gross",
                Amount: (parseFloat(serviceRate) / 100) * tax.BaseFare,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onGrossSingleColumn = bookingFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "On Gross" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onGrossSingleColumn?.textType === "checkbox" &&
        onGrossSingleColumn.value
      ) {
        applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[0], "ADT");
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[1], "CHD");
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToOnGross(singleFlightDetails.PriceBreakup[2], "INF");
        }
      }

      //on gross end

      // GST Start Here
      const applyServiceRateToGst = async (tax, type, supplierTypeFor) => {
        if (tax && Object.keys(tax).length !== 0) {
          // let getAgentConfig = await agentConfig.findOne({
          //   companyId: companyId,
          // });
          // console.log(getAgentConfig);
          // if (getAgentConfig) {
          //  tax.gst += getAgentConfig.discountPercentage
          // }
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "BookingFees"
          );
          if (existingBookingFeesIndex !== -1) {
            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              //const tdsCheckFromConfig = configDetails.IsSuccess ? (configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 || 0) : 0;
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) *
                tax.CommercialBreakup[existingBookingFeesIndex].Amount;
            } else {
              //const tdsCheckFromConfig = configDetails.IsSuccess ? (configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 || 0) : 0;
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount:
                  (parseFloat(18) / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount,
                SupplierType: supplierTypeFor,
              });
            }
          } else {
            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              //const tdsCheckFromConfig = configDetails.IsSuccess ? (configDetails.data.discountPercentage !== undefined ? configDetails.data.discountPercentage : 0 || 0) : 0;
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) * 0;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount: (parseFloat(18) / 100) * 0,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onGstSingleColumn = bookingFeeRateAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "GST" &&
          filter.AirCommertialColumnMasterId.commercialType === "rate" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onGstSingleColumn?.textType === "checkbox" &&
        onGstSingleColumn.value
      ) {
        applyServiceRateToGst(
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          supplierTypeFor
        );
        if (
          isExcludeChildChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyServiceRateToGst(
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }

        if (
          isExcludeInfantChecked != true &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyServiceRateToGst(
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // GST END
    }
  }

  // Booking Fee Rate(+) end here

  //Fixed Rate start here
  //Segment Kickback (-) start here
  const segmentKickbackAllColumn =
    commList.updateaircommercialmatrixes.data.filter(
      (filter) =>
        filter.AirCommertialRowMasterId.name === "Segment Kickback (-)" &&
        filter.AirCommertialRowMasterId.commercialType === "fixed" &&
        filter.AirCommertialRowMasterId.type === "row"
    );

  if (segmentKickbackAllColumn.length > 0) {
    const fixedAdultSingleColumn = segmentKickbackAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Adult" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedChildSingleColumn = segmentKickbackAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Child" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedInfantSingleColumn = segmentKickbackAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Infant" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      fixedAdultSingleColumn &&
      fixedChildSingleColumn &&
      fixedInfantSingleColumn &&
      (fixedAdultSingleColumn.value != 0 ||
        fixedChildSingleColumn.value != 0 ||
        fixedInfantSingleColumn.value != 0)
    ) {
      const fixedAdultRate =
        fixedAdultSingleColumn.textType === "number"
          ? parseFloat(fixedAdultSingleColumn.value)
          : 0;
      const fixedChildRate =
        fixedChildSingleColumn.textType === "number"
          ? parseFloat(fixedChildSingleColumn.value)
          : 0;

      const fixedInfantRate =
        fixedInfantSingleColumn.textType === "number"
          ? parseFloat(fixedInfantSingleColumn.value)
          : 0;

      // on word only start here
      const applySegmentKickbackToperairlineperpax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });
          //tax.ServiceFees += (parseFloat(serviceRate) / 100) * yqTax.Amount;
          // const countAirline = tax.CommercialBreakup.find(
          //   (commercial) => commercial.CommercialType === "SegmentKickback"
          // );
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "SegmentKickback" &&
              item.onCommercialApply === "Onward Only"
          );
          if (existingBookingFeesIndex !== -1) {
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );
            if (type === "ADT") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
            } else if (type === "CHD") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
            } else if (type === "INF") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
            }
          } else {
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );
            if (type === "ADT") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Onward Only",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "CHD") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Onward Only",
                Amount: totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "INF") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Onward Only",
                Amount: totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perairlineperpaxSingleColumn = segmentKickbackAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Airline Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perairlineperpaxSingleColumn?.textType === "checkbox" &&
        perairlineperpaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applySegmentKickbackToperairlineperpax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applySegmentKickbackToperairlineperpax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applySegmentKickbackToperairlineperpax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }

      // on word only start End

      //  Per Pax Per Sector Start Here
      const applySegmentKickbackToperpaxperSector = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          // const countAirline = tax.CommercialBreakup.find(
          //   (commercial) => commercial.CommercialType === "SegmentKickback"
          // );
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "SegmentKickback" &&
              item.onCommercialApply === "Per Pax Per Sector"
          );
          if (existingBookingFeesIndex !== -1) {
            if (type === "ADT") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else if (type === "CHD") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else if (type === "INF") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            }
          } else {
            if (type === "ADT") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "CHD") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "INF") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPAxperSectorSingleColumn = segmentKickbackAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pax Per Sector" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPAxperSectorSingleColumn?.textType === "checkbox" &&
        perPAxperSectorSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applySegmentKickbackToperpaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applySegmentKickbackToperpaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applySegmentKickbackToperpaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per Pax Per Sector End Here

      // Per Flight Per Pax Start HERE
      const applySegmentKickbackToperFlightPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          // const countAirline = tax.CommercialBreakup.find(
          //   (commercial) => commercial.CommercialType === "SegmentKickback"
          // );
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "SegmentKickback" &&
              item.onCommercialApply === "Per Flight Per Pax"
          );
          if (existingBookingFeesIndex !== -1) {
            const fltNumCount = {};
            const encounteredFltNums = new Set();
            singleFlightDetails.Sectors.forEach((sector) => {
              const AirlineCode = sector.AirlineCode;

              if (AirlineCode && !encounteredFltNums.has(AirlineCode)) {
                if (fltNumCount[AirlineCode] === undefined) {
                  fltNumCount[AirlineCode] = 1;
                } else {
                  fltNumCount[AirlineCode]++;
                }

                encounteredFltNums.add(AirlineCode);
              }
            });
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );

            if (type === "ADT") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
            } else if (type === "CHD") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
            } else if (type === "INF") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
            }
          } else {
            const fltNumCount = {};
            const encounteredFltNums = new Set();
            singleFlightDetails.Sectors.forEach((sector) => {
              const AirlineCode = sector.AirlineCode;

              if (AirlineCode && !encounteredFltNums.has(AirlineCode)) {
                if (fltNumCount[AirlineCode] === undefined) {
                  fltNumCount[AirlineCode] = 1;
                } else {
                  fltNumCount[AirlineCode]++;
                }

                encounteredFltNums.add(AirlineCode);
              }
            });
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );

            if (type === "ADT") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "CHD") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "INF") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perFlightPerPaxSingleColumn = segmentKickbackAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Flight Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perFlightPerPaxSingleColumn?.textType === "checkbox" &&
        perFlightPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applySegmentKickbackToperFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applySegmentKickbackToperFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applySegmentKickbackToperFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per Flight Per Pax END HERE

      // Per PNR Per Pax START HERE
      const applySegmentKickbackToperPNRPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          // const countAirline = tax.CommercialBreakup.find(
          //   (commercial) => commercial.CommercialType === "SegmentKickback"
          // );
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "SegmentKickback" &&
              item.onCommercialApply === "Per PNR Per Pax"
          );
          if (existingBookingFeesIndex !== -1) {
            if (type === "ADT") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else if (type === "CHD") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else if (type === "INF") {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            }
          } else {
            if (type === "ADT") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "CHD") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            } else if (type === "INF") {
              tax.CommercialBreakup.push({
                CommercialType: "SegmentKickback",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPNRPerPaxSingleColumn = segmentKickbackAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per PNR Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPNRPerPaxSingleColumn?.textType === "checkbox" &&
        perPNRPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applySegmentKickbackToperPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applySegmentKickbackToperPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applySegmentKickbackToperPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per PNR Per Pax END HERE

      // TDS START HERE
      const applySegmentKickbackToTDS = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax && tax.CommercialBreakup && tax.CommercialBreakup.length > 0) {
          // const countAirline = tax.CommercialBreakup.find(
          //   (commercial) => commercial.CommercialType === "SegmentKickback"
          // );
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "SegmentKickback"
          );
          if (existingBookingFeesIndex !== -1) {
            if (type === "ADT") {
              const tdsCheckFromConfig = configDetails.IsSuccess
                ? configDetails.data.tds || 5
                : 5;
              const existingTDSIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "TDS" &&
                  item.onCommercialApply === "SegmentKickback"
              );
              if (existingTDSIndex !== -1) {
                tax.CommercialBreakup[existingTDSIndex].Amount +=
                  (parseFloat(tdsCheckFromConfig) / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "TDS",
                  onCommercialApply: "SegmentKickback",
                  Amount:
                    (parseFloat(tdsCheckFromConfig) / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount,
                  SupplierType: supplierTypeFor,
                });
              }
            } else if (type === "CHD") {
              const tdsCheckFromConfig = configDetails.IsSuccess
                ? configDetails.data.tds || 5
                : 5;
              const existingTDSIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "TDS" &&
                  item.onCommercialApply === "SegmentKickback"
              );

              if (existingTDSIndex !== -1) {
                tax.CommercialBreakup[existingTDSIndex].Amount +=
                  (parseFloat(tdsCheckFromConfig) / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "TDS",
                  onCommercialApply: "SegmentKickback",
                  Amount:
                    (parseFloat(tdsCheckFromConfig) / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount,
                  SupplierType: supplierTypeFor,
                });
              }
            } else if (type === "INF") {
              const tdsCheckFromConfig = configDetails.IsSuccess
                ? configDetails.data.tds || 5
                : 5;
              const existingTDSIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "TDS" &&
                  item.onCommercialApply === "SegmentKickback"
              );
              if (existingTDSIndex !== -1) {
                tax.CommercialBreakup[existingTDSIndex].Amount +=
                  (parseFloat(tdsCheckFromConfig) / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "TDS",
                  onCommercialApply: "SegmentKickback",
                  Amount:
                    (parseFloat(tdsCheckFromConfig) / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          }
        }
      };

      const tdsSingleColumn = segmentKickbackAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Deduct TDS" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (tdsSingleColumn?.textType === "checkbox" && tdsSingleColumn.value) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applySegmentKickbackToTDS(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applySegmentKickbackToTDS(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applySegmentKickbackToTDS(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // TDS END HERE
    }
  }
  // Segment Kickback (-) End here

  // Fixed Booking Fee start Here
  const fixedBookingFeeAllColumn =
    commList.updateaircommercialmatrixes.data.filter(
      (filter) =>
        filter.AirCommertialRowMasterId.name === "Fixed Booking Fee" &&
        filter.AirCommertialRowMasterId.commercialType === "fixed" &&
        filter.AirCommertialRowMasterId.type === "row"
    );

  if (fixedBookingFeeAllColumn.length > 0) {
    const fixedAdultSingleColumn = fixedBookingFeeAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Adult" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedChildSingleColumn = fixedBookingFeeAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Child" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedInfantSingleColumn = fixedBookingFeeAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Infant" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      fixedAdultSingleColumn &&
      fixedChildSingleColumn &&
      fixedInfantSingleColumn &&
      (fixedAdultSingleColumn.value != 0 ||
        fixedChildSingleColumn.value != 0 ||
        fixedInfantSingleColumn.value != 0)
    ) {
      const fixedAdultRate =
        fixedAdultSingleColumn.textType === "number"
          ? parseFloat(fixedAdultSingleColumn.value)
          : 0;
      const fixedChildRate =
        fixedChildSingleColumn.textType === "number"
          ? parseFloat(fixedChildSingleColumn.value)
          : 0;

      const fixedInfantRate =
        fixedInfantSingleColumn.textType === "number"
          ? parseFloat(fixedInfantSingleColumn.value)
          : 0;

      // on word only start here
      const applyFixedBookingFeeToOnWardOnly = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Onward Only"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Onward Only",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Onward Only"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Onward Only",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Onward Only"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Onward Only",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const onWardOnlySingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Onward Only" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onWardOnlySingleColumn?.textType === "checkbox" &&
        onWardOnlySingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
        ) {
          applyFixedBookingFeeToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
        ) {
          applyFixedBookingFeeToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
        ) {
          applyFixedBookingFeeToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }

      // on word only start End

      // Non Zero Only Start Here
      const applyFixedBookingFeeToNonZeroOnly = (
        singleFlightDetails,
        tax,
        type
      ) => {
        if (tax) {
          // const countAirline = tax.CommercialBreakup.find((commercial) => commercial.CommercialType === "SegmentKickback");
          // if (countAirline) {
          //   const totalCount = Object.values(fltNumCount).reduce((sum, count) => sum + count, 0);
          //   if (type === "ADT") {
          //     countAirline.Amount = totalCount * fixedAdultRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedAdultRate);
          //   } else if (type === "CHD") {
          //     countAirline.Amount = totalCount * fixedChildRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedChildRate);
          //   } else if (type === "INF") {
          //     countAirline.Amount = totalCount * fixedInfantRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedInfantRate);
          //   }
          // }
        }
      };

      const nonZeroOnlySingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Non Zero Only" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        nonZeroOnlySingleColumn?.textType === "checkbox" &&
        nonZeroOnlySingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT"
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // Non Zero Only End Here

      // Per Airline Per Pax Start Here
      const applyFixedBookingFeeToPerAirlinePerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });

          const totalCount = Object.values(fltNumCount).reduce(
            (sum, count) => sum + count,
            0
          );
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perAirlinePerPaxSingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Airline Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perAirlinePerPaxSingleColumn?.textType === "checkbox" &&
        perAirlinePerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per Airline Per Pax End Here

      // Per PNR PER Ticket start Here
      const applyFixedBookingFeeToPerPnrPerTicket = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Pnr Per Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Pnr Per Ticket",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Pnr Per Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Pnr Per Ticket",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Pnr Per Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Pnr Per Ticket",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPntperTicketSingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pnr Per Ticket" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPntperTicketSingleColumn?.textType === "checkbox" &&
        perPntperTicketSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per PNR per Ticket End Here

      // Per Pax per sector start here
      const applyFixedBookingFeeToPerPaxperSector = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Pax Per Sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Pax Per Sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Pax Per Sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPaxPerSectorSingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pax Per Sector" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPaxPerSectorSingleColumn?.textType === "checkbox" &&
        perPaxPerSectorSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // per pax per sector end here

      // Per FLight Per Pax Start Here
      const applyFixedBookingFeeToPerFlightPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();
          singleFlightDetails.Sectors.forEach((sector) => {
            const AirlineCode = sector.AirlineCode;

            if (AirlineCode && !encounteredFltNums.has(AirlineCode)) {
              if (fltNumCount[AirlineCode] === undefined) {
                fltNumCount[AirlineCode] = 1;
              } else {
                fltNumCount[AirlineCode]++;
              }

              encounteredFltNums.add(AirlineCode);
            }
          });
          const totalCount = Object.values(fltNumCount).reduce(
            (sum, count) => sum + count,
            0
          );

          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perFlightPerPaxSingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Flight Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perFlightPerPaxSingleColumn?.textType === "checkbox" &&
        perFlightPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per flight per pax end here

      // Per PNR Per Pax Start Here
      const applyFixedBookingFeeToPerPNRPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per PNR Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per PNR Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedBookingFees" &&
                item.onCommercialApply === "Per PNR Per Pax"
            );

            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedBookingFees",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPNRPerPaxSingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per PNR Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPNRPerPaxSingleColumn?.textType === "checkbox" &&
        perPNRPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToPerPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToPerPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToPerPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per PNR Per Pax End Here

      // GST START HERE
      const applyFixedBookingFeeToGst = async (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax && Object.keys(tax).length !== 0) {
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "FixedBookingFees"
          );

          if (existingBookingFeesIndex !== -1) {
            // Calculate the total amount of FixedBookingFees
            const totalFixedBookingFees = tax.CommercialBreakup.reduce(
              (total, item) => {
                if (
                  item.CommercialType === "FixedBookingFees" &&
                  item.SupplierType === supplierTypeFor
                )
                  return total + item.Amount;
                return total;
              },
              0
            );

            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              // Update existing GST entry
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) * totalFixedBookingFees;
            } else {
              // Add new GST entry
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount: (parseFloat(18) / 100) * totalFixedBookingFees,
                SupplierType: supplierTypeFor,
              });
            }
          } else {
            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              // Update existing GST entry with 0 amount
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) * 0;
            } else {
              // Add new GST entry with 0 amount
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount: (parseFloat(18) / 100) * 0,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const gstSingleColumn = fixedBookingFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "GST" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (gstSingleColumn?.textType === "checkbox" && gstSingleColumn.value) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedBookingFeeToGst(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedBookingFeeToGst(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedBookingFeeToGst(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // GST END HERE
    }
  }

  // Fixed Booking Fee End here

  // FIXED SERVICE FEE (+) START HERE
  const fixedServiceFeeAllColumn =
    commList.updateaircommercialmatrixes.data.filter(
      (filter) =>
        filter.AirCommertialRowMasterId.name === "Fixed Service Fee(+)" &&
        filter.AirCommertialRowMasterId.commercialType === "fixed" &&
        filter.AirCommertialRowMasterId.type === "row"
    );

  if (fixedServiceFeeAllColumn.length > 0) {
    const fixedAdultSingleColumn = fixedServiceFeeAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Adult" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedChildSingleColumn = fixedServiceFeeAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Child" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    const fixedInfantSingleColumn = fixedServiceFeeAllColumn.find(
      (filter) =>
        filter.AirCommertialColumnMasterId.name === "Infant" &&
        filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
        filter.AirCommertialColumnMasterId.type === "coloumn"
    );

    if (
      fixedAdultSingleColumn &&
      fixedChildSingleColumn &&
      fixedInfantSingleColumn &&
      (fixedAdultSingleColumn.value != 0 ||
        fixedChildSingleColumn.value != 0 ||
        fixedInfantSingleColumn.value != 0)
    ) {
      const fixedAdultRate =
        fixedAdultSingleColumn.textType === "number"
          ? parseFloat(fixedAdultSingleColumn.value)
          : 0;
      const fixedChildRate =
        fixedChildSingleColumn.textType === "number"
          ? parseFloat(fixedChildSingleColumn.value)
          : 0;

      const fixedInfantRate =
        fixedInfantSingleColumn.textType === "number"
          ? parseFloat(fixedInfantSingleColumn.value)
          : 0;

      // on word only start here
      const applyFixedServiceFeeToOnWardOnly = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            if (
              singleFlightDetails.PriceBreakup[0] &&
              Object.keys(singleFlightDetails.PriceBreakup[0]).length !== 0
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "FixedServiceFees" &&
                  item.onCommercialApply === "Onward Only"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedAdultRate;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "FixedServiceFees",
                  onCommercialApply: "Onward Only",
                  Amount: fixedAdultRate,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          } else if (type === "CHD") {
            if (
              singleFlightDetails.PriceBreakup[1] &&
              Object.keys(singleFlightDetails.PriceBreakup[1]).length !== 0
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "FixedServiceFees" &&
                  item.onCommercialApply === "Onward Only"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedChildRate;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "FixedServiceFees",
                  onCommercialApply: "Onward Only",
                  Amount: fixedChildRate,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          } else if (type === "INF") {
            if (
              singleFlightDetails.PriceBreakup[2] &&
              Object.keys(singleFlightDetails.PriceBreakup[2]).length !== 0
            ) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "FixedServiceFees" &&
                  item.onCommercialApply === "Onward Only"
              );
              if (existingBookingFeesIndex !== -1) {
                tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                  fixedInfantRate;
              } else {
                tax.CommercialBreakup.push({
                  CommercialType: "FixedServiceFees",
                  onCommercialApply: "Onward Only",
                  Amount: fixedInfantRate,
                  SupplierType: supplierTypeFor,
                });
              }
            }
          }
        }
      };

      const onWardOnlySingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Onward Only" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        onWardOnlySingleColumn?.textType === "checkbox" &&
        onWardOnlySingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToOnWardOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }

      // on word only start End

      // Non Zero Only Start Here
      const applyFixedServiceFeeToNonZeroOnly = (
        singleFlightDetails,
        tax,
        type
      ) => {
        if (tax) {
          // const countAirline = tax.CommercialBreakup.find((commercial) => commercial.CommercialType === "SegmentKickback");
          // if (countAirline) {
          //   const totalCount = Object.values(fltNumCount).reduce((sum, count) => sum + count, 0);
          //   if (type === "ADT") {
          //     countAirline.Amount = totalCount * fixedAdultRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedAdultRate);
          //   } else if (type === "CHD") {
          //     countAirline.Amount = totalCount * fixedChildRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedChildRate);
          //   } else if (type === "INF") {
          //     countAirline.Amount = totalCount * fixedInfantRate;
          //     tax.TDS += (parseFloat(5) / 100) * (totalCount * fixedInfantRate);
          //   }
          // }
        }
      };

      const nonZeroOnlySingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Non Zero Only" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        nonZeroOnlySingleColumn?.textType === "checkbox" &&
        nonZeroOnlySingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT"
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD"
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToNonZeroOnly(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF"
          );
        }
      }
      // Non Zero Only End Here

      // Per Airline Per Pax Start Here
      const applyFixedServiceFeeToPerAirlinePerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });

          const totalCount = Object.values(fltNumCount).reduce(
            (sum, count) => sum + count,
            0
          );
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Airline Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Airline Per Pax",
                Amount: totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perAirlinePerPaxSingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Airline Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perAirlinePerPaxSingleColumn?.textType === "checkbox" &&
        perAirlinePerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToPerAirlinePerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per Airline Per Pax End Here

      // Per PNR PER Ticket start Here
      const applyFixedServiceFeeToPerPnrPerTicket = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Pnr Per Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Pnr Per Ticket",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Pnr Per Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Pnr Per Ticket",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Pnr Per Ticket"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Pnr Per Ticket",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPntperTicketSingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pnr Per Ticket" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPntperTicketSingleColumn?.textType === "checkbox" &&
        perPntperTicketSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToPerPnrPerTicket(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per PNR per Ticket End Here

      // Per Pax per sector start here
      const applyFixedServiceFeeToPerPaxperSector = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Pax Per Sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Pax Per Sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Pax Per Sector"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Pax Per Sector",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPaxPerSectorSingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Pax Per Sector" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPaxPerSectorSingleColumn?.textType === "checkbox" &&
        perPaxPerSectorSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToPerPaxperSector(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // per pax per sector end here

      // Per FLight Per Pax Start Here
      const applyFixedServiceFeeToPerFlightPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();
          singleFlightDetails.Sectors.forEach((sector) => {
            const AirlineCode = sector.AirlineCode;

            if (AirlineCode && !encounteredFltNums.has(AirlineCode)) {
              if (fltNumCount[AirlineCode] === undefined) {
                fltNumCount[AirlineCode] = 1;
              } else {
                fltNumCount[AirlineCode]++;
              }

              encounteredFltNums.add(AirlineCode);
            }
          });
          const totalCount = Object.values(fltNumCount).reduce(
            (sum, count) => sum + count,
            0
          );

          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per Flight Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                totalCount * fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per Flight Per Pax",
                Amount: totalCount * fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perFlightPerPaxSingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per Flight Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perFlightPerPaxSingleColumn?.textType === "checkbox" &&
        perFlightPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToPerFlightPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per flight per pax end here

      // Per PNR Per Pax Start Here
      const applyFixedServiceFeeToPerPNRPerPax = (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax) {
          if (type === "ADT") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per PNR Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedAdultRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedAdultRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "CHD") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per PNR Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedChildRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedChildRate,
                SupplierType: supplierTypeFor,
              });
            }
          } else if (type === "INF") {
            const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "FixedServiceFees" &&
                item.onCommercialApply === "Per PNR Per Pax"
            );
            if (existingBookingFeesIndex !== -1) {
              tax.CommercialBreakup[existingBookingFeesIndex].Amount +=
                fixedInfantRate;
            } else {
              tax.CommercialBreakup.push({
                CommercialType: "FixedServiceFees",
                onCommercialApply: "Per PNR Per Pax",
                Amount: fixedInfantRate,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const perPNRPerPaxSingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "Per PNR Per Pax" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (
        perPNRPerPaxSingleColumn?.textType === "checkbox" &&
        perPNRPerPaxSingleColumn.value
      ) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToPerPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToPerPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToPerPNRPerPax(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // Per PNR Per Pax End Here

      // GST START HERE
      const applyFixedServiceFeeToGst = async (
        singleFlightDetails,
        tax,
        type,
        supplierTypeFor
      ) => {
        if (tax && Object.keys(tax).length !== 0) {
          const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
            (item) =>
              item.SupplierType === supplierTypeFor &&
              item.CommercialType === "FixedServiceFees"
          );

          if (existingBookingFeesIndex !== -1) {
            // Calculate the total amount of FixedBookingFees
            const totalFixedBookingFees = tax.CommercialBreakup.reduce(
              (total, item) => {
                if (
                  item.CommercialType === "FixedServiceFees" &&
                  item.SupplierType === supplierTypeFor
                )
                  return total + item.Amount;
                return total;
              },
              0
            );

            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              // Update existing GST entry
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) * totalFixedBookingFees;
            } else {
              // Add new GST entry
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount: (parseFloat(18) / 100) * totalFixedBookingFees,
                SupplierType: supplierTypeFor,
              });
            }
          } else {
            const existingGSTIndex = tax.CommercialBreakup.findIndex(
              (item) =>
                item.SupplierType === supplierTypeFor &&
                item.CommercialType === "GST"
            );
            if (existingGSTIndex !== -1) {
              // Update existing GST entry with 0 amount
              tax.CommercialBreakup[existingGSTIndex].Amount +=
                (parseFloat(18) / 100) * 0;
            } else {
              // Add new GST entry with 0 amount
              tax.CommercialBreakup.push({
                CommercialType: "GST",
                Amount: (parseFloat(18) / 100) * 0,
                SupplierType: supplierTypeFor,
              });
            }
          }
        }
      };

      const gstSingleColumn = fixedServiceFeeAllColumn.find(
        (filter) =>
          filter.AirCommertialColumnMasterId.name === "GST" &&
          filter.AirCommertialColumnMasterId.commercialType === "fixed" &&
          filter.AirCommertialColumnMasterId.type === "coloumn"
      );

      if (gstSingleColumn?.textType === "checkbox" && gstSingleColumn.value) {
        if (
          singleFlightDetails.PriceBreakup[0] &&
          Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
        ) {
          applyFixedServiceFeeToGst(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[0],
            "ADT",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[1] &&
          Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
        ) {
          applyFixedServiceFeeToGst(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[1],
            "CHD",
            supplierTypeFor
          );
        }
        if (
          singleFlightDetails.PriceBreakup[2] &&
          Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
        ) {
          applyFixedServiceFeeToGst(
            singleFlightDetails,
            singleFlightDetails.PriceBreakup[2],
            "INF",
            supplierTypeFor
          );
        }
      }
      // GST END HERE
    }
  }
  // FIXED SERVICE FEE (+) END HERE

  // Fixed Rate End here
  if (
    typeof singleFlightDetails.PriceBreakup[0] === "object" &&
    Object.keys(singleFlightDetails.PriceBreakup[0]).length > 0
  ) {
    singleFlightDetails.PriceBreakup[0].BaseFare = oldBaseFareADT;
    singleFlightDetails.PriceBreakup[0].Tax = oldTaxFareADT;
    singleFlightDetails.PriceBreakup[0].TaxBreakup = oldTaxBreakupADT;
  }

  if (
    typeof singleFlightDetails.PriceBreakup[1] === "object" &&
    Object.keys(singleFlightDetails.PriceBreakup[1]).length > 0
  ) {
    singleFlightDetails.PriceBreakup[1].BaseFare = oldBaseFareCHD;
    singleFlightDetails.PriceBreakup[1].Tax = oldTaxFareCHD;
    singleFlightDetails.PriceBreakup[1].TaxBreakup = oldTaxBreakupCHD;
  }

  if (
    typeof singleFlightDetails.PriceBreakup[2] === "object" &&
    Object.keys(singleFlightDetails.PriceBreakup[2]).length > 0
  ) {
    singleFlightDetails.PriceBreakup[2].BaseFare = oldBaseFareInf;
    singleFlightDetails.PriceBreakup[2].Tax = oldTaxFareInf;
    singleFlightDetails.PriceBreakup[2].TaxBreakup = oldTaxBreakupInf;
  }
  return singleFlightDetails.PriceBreakup;
};

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
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === singleFlightDetails.FareFamily &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
    ) {
      //console.log(commercialPlanDetails.data[0])
      const groupKey = `${TravelType}-${commList.carrier}-${commList.source}-${commList.commercialCategory}-${singleFlightDetails.FareFamily}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === singleFlightDetails.ValCarrier &&
      commList.source === singleFlightDetails.Provider &&
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === null &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
      //!commList.fareFamily.includes(singleFlightDetails.FareFamily)
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
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === singleFlightDetails.FareFamily &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
    ) {
      const groupKey = `${TravelType}-${commList.source}-${commList.commercialCategory}-${singleFlightDetails.FareFamily}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === singleFlightDetails.ValCarrier &&
      commList.source === null &&
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === singleFlightDetails.FareFamily &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
    ) {
      const groupKey = `${TravelType}-${commList.carrier}-${commList.commercialCategory}-${singleFlightDetails.FareFamily}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === null &&
      commList.source === null &&
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === singleFlightDetails.FareFamily &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
    ) {
      const groupKey = `${TravelType}-${commList.commercialCategory}-${singleFlightDetails.FareFamily}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === singleFlightDetails.ValCarrier &&
      commList.source === null &&
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === null &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
      //!commList.fareFamily.includes(singleFlightDetails.FareFamily)
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
      commList.source === singleFlightDetails.Provider &&
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === null &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
      //!commList.fareFamily.includes(singleFlightDetails.FareFamily)
    ) {
      const groupKey = `FTF-${commList.carrier}-${TravelType}-${commList.commercialCategory}-${singleFlightDetails.FareFamily}`;

      if (!groupedMatches[groupKey]) {
        groupedMatches[groupKey] = [];
      }

      // Add the item to the group
      groupedMatches[groupKey].push(commList);
    } else if (
      TravelType === commList.travelType &&
      commList.carrier === null &&
      commList.source === null &&
      commList.commercialCategory === "Ticket" &&
      commList.fareFamily === null &&
      !["FD", "FF"].includes(singleFlightDetails.FareFamily)
      //!commList.fareFamily.includes(singleFlightDetails.FareFamily)
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

const checkMarkupValue = async (
  markupData,
  singleFlightDetails,
  companyId,
  configDetails,
  supplierTypeFor
) => {
  // first check Basic
  const checkBasic = markupData.markupData.find(
    (filter) => filter.markUpCategoryId.markUpCategoryName === "Basic"
  );

  if (checkBasic) {
    const applyBasicTo = (
      wise,
      markupRate,
      maxMarkup,
      paxVal,
      tax,
      type,
      checkBasic
    ) => {
      if (wise === "sectorWise") {
        if (tax && tax.AgentMarkupBreakup) {
          if (singleFlightDetails.Sectors[0].Group == 0) {
            const countAirline = tax.AgentMarkupBreakup;
            const maxAmount = paxVal;
            let totalMarkupAmount = 0;
            tax.CommercialBreakup.forEach((item) => {
              if (item.CommercialType === "Markup") {
                totalMarkupAmount += item.Amount;
              }
            });
            if (maxMarkup != 0 && maxMarkup != null) {
              if (type === "ADT" && checkBasic.adultFixed != 0) {
                countAirline.Basic += checkBasic.adultFixed;
              } else if (type === "CHD" && checkBasic.childFixed != 0) {
                countAirline.Basic += checkBasic.childFixed;
              } else if (type === "INF" && checkBasic.infantFixed != 0) {
                countAirline.Basic += checkBasic.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Basic +=
                  (markupRate / 100) * (tax.BaseFare + totalMarkupAmount);
              }
              if (countAirline.Basic >= maxMarkup) {
                countAirline.Basic = maxMarkup;
              }
            } else {
              if (type === "ADT" && checkBasic.adultFixed != 0) {
                countAirline.Basic += checkBasic.adultFixed;
              } else if (type === "CHD" && checkBasic.childFixed != 0) {
                countAirline.Basic += checkBasic.childFixed;
              } else if (type === "INF" && checkBasic.infantFixed != 0) {
                countAirline.Basic += checkBasic.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Basic +=
                  (markupRate / 100) * (tax.BaseFare + totalMarkupAmount);
              }
            }
          }
        }
      } else if (wise === "flightWise") {
        if (tax && tax.AgentMarkupBreakup) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });
          let totalMarkupAmount = 0;
          tax.CommercialBreakup.forEach((item) => {
            if (item.CommercialType === "Markup") {
              totalMarkupAmount += item.Amount;
            }
          });
          const countAirline = tax.AgentMarkupBreakup;
          if (countAirline) {
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );

            const maxAmount = totalCount * paxVal;
            if (maxMarkup != 0 && maxMarkup != null) {
              if (type === "ADT" && checkBasic.adultFixed != 0) {
                countAirline.Basic += checkBasic.adultFixed;
              } else if (type === "CHD" && checkBasic.childFixed != 0) {
                countAirline.Basic += checkBasic.childFixed;
              } else if (type === "INF" && checkBasic.infantFixed != 0) {
                countAirline.Basic += checkBasic.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Basic +=
                  (markupRate / 100) * (tax.BaseFare + totalMarkupAmount);
              }

              if (countAirline.Basic >= maxMarkup) {
                countAirline.Basic = maxMarkup;
              }
            } else {
              if (type === "ADT" && checkBasic.adultFixed != 0) {
                countAirline.Basic += checkBasic.adultFixed;
              } else if (type === "CHD" && checkBasic.childFixed != 0) {
                countAirline.Basic += checkBasic.childFixed;
              } else if (type === "INF" && checkBasic.infantFixed != 0) {
                countAirline.Basic += checkBasic.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Basic +=
                  (markupRate / 100) * (tax.BaseFare + totalMarkupAmount);
              }
            }
          }
        }
      } else {
        if (tax && tax.AgentMarkupBreakup) {
          const countAirline = tax.AgentMarkupBreakup;
          const maxAmount = paxVal;
          let totalMarkupAmount = 0;
          tax.CommercialBreakup.forEach((item) => {
            if (item.CommercialType === "Markup") {
              totalMarkupAmount += item.Amount;
            }
          });

          if (maxMarkup != 0 && maxMarkup != null) {
            if (type === "ADT" && checkBasic.adultFixed != 0) {
              countAirline.Basic += checkBasic.adultFixed;
            } else if (type === "CHD" && checkBasic.childFixed != 0) {
              countAirline.Basic += checkBasic.childFixed;
            } else if (type === "INF" && checkBasic.infantFixed != 0) {
              countAirline.Basic += checkBasic.infantFixed;
            }
            if (markupRate != 0 && markupRate != null) {
              countAirline.Basic +=
                (markupRate / 100) * (tax.BaseFare + totalMarkupAmount);
            }
            if (countAirline.Basic >= maxMarkup) {
              countAirline.Basic = maxMarkup;
            }
          } else {
            if (type === "ADT" && checkBasic.adultFixed != 0) {
              countAirline.Basic += checkBasic.adultFixed;
            } else if (type === "CHD" && checkBasic.childFixed != 0) {
              countAirline.Basic += checkBasic.childFixed;
            } else if (type === "INF" && checkBasic.infantFixed != 0) {
              countAirline.Basic += checkBasic.infantFixed;
            }
            if (markupRate != 0 && markupRate != null) {
              countAirline.Basic +=
                (markupRate / 100) * (tax.BaseFare + totalMarkupAmount);
            }
          }
        }
      }
    };
    if (checkBasic.sectorWise) {
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "sectorWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkBasic
        );
      } else if (checkBasic.adultFixed != 0) {
        applyBasicTo(
          "sectorWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkBasic
        );
      }
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "sectorWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkBasic
        );
      } else if (checkBasic.childFixed != 0) {
        applyBasicTo(
          "sectorWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkBasic
        );
      }
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "sectorWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkBasic
        );
      } else if (checkBasic.infantFixed != 0) {
        applyBasicTo(
          "sectorWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkBasic
        );
      }
    } else if (checkBasic.flightWise) {
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "flightWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkBasic
        );
      } else if (checkBasic.adultFixed != 0) {
        applyBasicTo(
          "flightWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkBasic
        );
      }
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "flightWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkBasic
        );
      } else if (checkBasic.childFixed != 0) {
        applyBasicTo(
          "flightWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkBasic
        );
      }
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "flightWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkBasic
        );
      } else if (checkBasic.infantFixed != 0) {
        applyBasicTo(
          "flightWise",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkBasic
        );
      }
    } else {
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkBasic
        );
      } else if (checkBasic.adultFixed != 0) {
        applyBasicTo(
          "",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkBasic
        );
      }

      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkBasic
        );
      } else if (checkBasic.childFixed != 0) {
        applyBasicTo(
          "",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkBasic
        );
      }
      if (checkBasic.markupRate != 0) {
        applyBasicTo(
          "",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.markupRate,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkBasic
        );
      } else if (checkBasic.infantFixed != 0) {
        applyBasicTo(
          "",
          checkBasic.markupRate,
          checkBasic.maxMarkup,
          checkBasic.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkBasic
        );
      }
    }
  }

  // first check BookingFee
  const checkBookingFee = markupData.markupData.find(
    (filter) => filter.markUpCategoryId.markUpCategoryName === "BookingFee"
  );

  if (checkBookingFee) {
    const applyBookingFeeTo = (
      wise,
      markupRate,
      maxMarkup,
      paxVal,
      tax,
      type
    ) => {
      if (wise === "sectorWise") {
        if (tax && tax.AgentMarkupBreakup) {
          if (singleFlightDetails.Sectors[0].Group == 0) {
            const countAirline = tax.AgentMarkupBreakup;
            const maxAmount = paxVal;

            if (maxMarkup != 0 && maxMarkup != null) {
              countAirline.BookingFee += maxAmount;
              if (markupRate != 0 && markupRate != null) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "BookingFees"
                  );
                if (existingBookingFeesIndex !== -1) {
                  countAirline.BookingFee +=
                    (markupRate / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount;
                } else {
                  countAirline.BookingFee += (markupRate / 100) * 0;
                }
              }
              if (countAirline.BookingFee >= maxMarkup) {
                countAirline.BookingFee = maxMarkup;
              }
            } else {
              countAirline.BookingFee += maxAmount;
              if (markupRate != 0 && markupRate != null) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "BookingFees"
                  );
                if (existingBookingFeesIndex !== -1) {
                  countAirline.BookingFee +=
                    (markupRate / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount;
                } else {
                  countAirline.BookingFee += (markupRate / 100) * 0;
                }
              }
            }
          }
        }
      } else if (wise === "flightWise") {
        if (tax && tax.AgentMarkupBreakup) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });
          const countAirline = tax.AgentMarkupBreakup;
          if (countAirline) {
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );

            const maxAmount = totalCount * paxVal;
            if (maxMarkup != 0 && maxMarkup != null) {
              countAirline.BookingFee += maxAmount;
              if (markupRate != 0 && markupRate != null) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "BookingFees"
                  );
                if (existingBookingFeesIndex !== -1) {
                  countAirline.BookingFee +=
                    (markupRate / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount;
                } else {
                  countAirline.BookingFee += (markupRate / 100) * 0;
                }
              }
              if (countAirline.BookingFee >= maxMarkup) {
                countAirline.BookingFee = maxMarkup;
              }
            } else {
              countAirline.BookingFee += maxAmount;
              if (markupRate != 0 && markupRate != null) {
                const existingBookingFeesIndex =
                  tax.CommercialBreakup.findIndex(
                    (item) =>
                      item.SupplierType === supplierTypeFor &&
                      item.CommercialType === "BookingFees"
                  );
                if (existingBookingFeesIndex !== -1) {
                  countAirline.BookingFee +=
                    (markupRate / 100) *
                    tax.CommercialBreakup[existingBookingFeesIndex].Amount;
                } else {
                  countAirline.BookingFee += (markupRate / 100) * 0;
                }
              }
            }
          }
        }
      } else {
        if (tax && tax.AgentMarkupBreakup) {
          const countAirline = tax.AgentMarkupBreakup;
          const maxAmount = paxVal;

          if (maxMarkup != 0 && maxMarkup != null) {
            countAirline.BookingFee += maxAmount;
            if (markupRate != 0 && markupRate != null) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "BookingFees"
              );
              if (existingBookingFeesIndex !== -1) {
                countAirline.BookingFee +=
                  (markupRate / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount;
              } else {
                countAirline.BookingFee += (markupRate / 100) * 0;
              }
            }
            if (countAirline.BookingFee >= maxMarkup) {
              countAirline.BookingFee = maxMarkup;
            }
          } else {
            countAirline.BookingFee += maxAmount;
            if (markupRate != 0 && markupRate != null) {
              const existingBookingFeesIndex = tax.CommercialBreakup.findIndex(
                (item) =>
                  item.SupplierType === supplierTypeFor &&
                  item.CommercialType === "BookingFees"
              );
              if (existingBookingFeesIndex !== -1) {
                countAirline.BookingFee +=
                  (markupRate / 100) *
                  tax.CommercialBreakup[existingBookingFeesIndex].Amount;
              } else {
                countAirline.BookingFee += (markupRate / 100) * 0;
              }
            }
          }
        }
      }
    };
    if (checkBookingFee.sectorWise) {
      if (checkBookingFee.adultFixed != 0) {
        applyBookingFeeTo(
          "sectorWise",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT"
        );
      }
      if (checkBookingFee.childFixed != 0) {
        applyBookingFeeTo(
          "sectorWise",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD"
        );
      }
      if (checkBookingFee.infantFixed != 0) {
        applyBookingFeeTo(
          "sectorWise",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF"
        );
      }
    } else if (checkBookingFee.flightWise) {
      if (checkBookingFee.adultFixed != 0) {
        applyBookingFeeTo(
          "flightWise",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT"
        );
      }
      if (checkBookingFee.childFixed != 0) {
        applyBookingFeeTo(
          "flightWise",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD"
        );
      }
      if (checkBookingFee.infantFixed != 0) {
        applyBookingFeeTo(
          "flightWise",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF"
        );
      }
    } else {
      if (checkBookingFee.adultFixed != 0) {
        applyBookingFeeTo(
          "",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT"
        );
      }
      if (checkBookingFee.childFixed != 0) {
        applyBookingFeeTo(
          "",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD"
        );
      }
      if (checkBookingFee.infantFixed != 0) {
        applyBookingFeeTo(
          "",
          checkBookingFee.markupRate,
          checkBookingFee.maxMarkup,
          checkBookingFee.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF"
        );
      }
    }
  }
  //   // first check Tax
  const checkTax = markupData.markupData.find(
    (filter) => filter.markUpCategoryId.markUpCategoryName === "Tax"
  );
  if (checkTax) {
    const applyTaxTo = (
      wise,
      markupRate,
      maxMarkup,
      paxVal,
      tax,
      type,
      checkTax
    ) => {
      if (wise === "sectorWise") {
        if (tax && tax.AgentMarkupBreakup) {
          if (singleFlightDetails.Sectors[0].Group == 0) {
            const countAirline = tax.AgentMarkupBreakup;
            const maxAmount = paxVal;
            let totalMarkupAmount = 0;
            tax.CommercialBreakup.forEach((item) => {
              if (item.CommercialType === "otherTax") {
                totalMarkupAmount += item.Amount;
              }
            });
            if (maxMarkup != 0 && maxMarkup != null) {
              if (type === "ADT" && checkTax.adultFixed != 0) {
                countAirline.Tax += checkTax.adultFixed;
              } else if (type === "CHD" && checkTax.childFixed != 0) {
                countAirline.Tax += checkTax.childFixed;
              } else if (type === "INF" && checkTax.infantFixed != 0) {
                countAirline.Tax += checkTax.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Tax +=
                  (markupRate / 100) * (tax.Tax + totalMarkupAmount);
              }
              if (countAirline.Tax >= maxMarkup) {
                countAirline.Tax = maxMarkup;
              }
            } else {
              if (type === "ADT" && checkTax.adultFixed != 0) {
                countAirline.Tax += checkTax.adultFixed;
              } else if (type === "CHD" && checkTax.childFixed != 0) {
                countAirline.Tax += checkTax.childFixed;
              } else if (type === "INF" && checkTax.infantFixed != 0) {
                countAirline.Tax += checkTax.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Tax +=
                  (markupRate / 100) * (tax.Tax + totalMarkupAmount);
              }
            }
          }
        }
      } else if (wise === "flightWise") {
        if (tax && tax.AgentMarkupBreakup) {
          const fltNumCount = {};
          const encounteredFltNums = new Set();

          singleFlightDetails.Sectors.forEach((sector) => {
            const fltNum = sector.FltNum;

            if (fltNum && !encounteredFltNums.has(fltNum)) {
              if (fltNumCount[fltNum] === undefined) {
                fltNumCount[fltNum] = 1;
              } else {
                fltNumCount[fltNum]++;
              }

              encounteredFltNums.add(fltNum);
            }
          });
          const countAirline = tax.AgentMarkupBreakup;
          if (countAirline) {
            const totalCount = Object.values(fltNumCount).reduce(
              (sum, count) => sum + count,
              0
            );

            const maxAmount = totalCount * paxVal;
            let totalMarkupAmount = 0;
            tax.CommercialBreakup.forEach((item) => {
              if (item.CommercialType === "otherTax") {
                totalMarkupAmount += item.Amount;
              }
            });
            if (maxMarkup != 0 && maxMarkup != null) {
              if (type === "ADT" && checkTax.adultFixed != 0) {
                countAirline.Tax += checkTax.adultFixed;
              } else if (type === "CHD" && checkTax.childFixed != 0) {
                countAirline.Tax += checkTax.childFixed;
              } else if (type === "INF" && checkTax.infantFixed != 0) {
                countAirline.Tax += checkTax.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Tax +=
                  (markupRate / 100) * (tax.Tax + totalMarkupAmount);
              }
              if (countAirline.Tax >= maxMarkup) {
                countAirline.Tax = maxMarkup;
              }
            } else {
              if (type === "ADT" && checkTax.adultFixed != 0) {
                countAirline.Tax += checkTax.adultFixed;
              } else if (type === "CHD" && checkTax.childFixed != 0) {
                countAirline.Tax += checkTax.childFixed;
              } else if (type === "INF" && checkTax.infantFixed != 0) {
                countAirline.Tax += checkTax.infantFixed;
              }
              if (markupRate != 0 && markupRate != null) {
                countAirline.Tax +=
                  (markupRate / 100) * (tax.Tax + totalMarkupAmount);
              }
            }
          }
        }
      } else {
        if (tax && tax.AgentMarkupBreakup) {
          const countAirline = tax.AgentMarkupBreakup;
          const maxAmount = paxVal;
          let totalMarkupAmount = 0;
          tax.CommercialBreakup.forEach((item) => {
            if (item.CommercialType === "otherTax") {
              totalMarkupAmount += item.Amount;
            }
          });
          if (maxMarkup != 0 && maxMarkup != null) {
            if (type === "ADT" && checkTax.adultFixed != 0) {
              countAirline.Tax += checkTax.adultFixed;
            } else if (type === "CHD" && checkTax.childFixed != 0) {
              countAirline.Tax += checkTax.childFixed;
            } else if (type === "INF" && checkTax.infantFixed != 0) {
              countAirline.Tax += checkTax.infantFixed;
            }
            if (markupRate != 0 && markupRate != null) {
              countAirline.Tax +=
                (markupRate / 100) * (tax.Tax + totalMarkupAmount);
            }
            if (countAirline.Tax >= maxMarkup) {
              countAirline.Tax = maxMarkup;
            }
          } else {
            if (type === "ADT" && checkTax.adultFixed != 0) {
              countAirline.Tax += checkTax.adultFixed;
            } else if (type === "CHD" && checkTax.childFixed != 0) {
              countAirline.Tax += checkTax.childFixed;
            } else if (type === "INF" && checkTax.infantFixed != 0) {
              countAirline.Tax += checkTax.infantFixed;
            }
            if (markupRate != 0 && markupRate != null) {
              countAirline.Tax +=
                (markupRate / 100) * (tax.Tax + totalMarkupAmount);
            }
          }
        }
      }
    };
    if (checkTax.sectorWise) {
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "sectorWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkTax
        );
      } else if (checkTax.adultFixed != 0) {
        applyTaxTo(
          "sectorWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkTax
        );
      }
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "sectorWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkTax
        );
      } else if (checkTax.childFixed != 0) {
        applyTaxTo(
          "sectorWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkTax
        );
      }
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "sectorWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkTax
        );
      } else if (checkTax.infantFixed != 0) {
        applyTaxTo(
          "sectorWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkTax
        );
      }
    } else if (checkTax.flightWise) {
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "flightWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkTax
        );
      } else if (checkTax.adultFixed != 0) {
        applyTaxTo(
          "flightWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkTax
        );
      }
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "flightWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkTax
        );
      } else if (checkTax.childFixed != 0) {
        applyTaxTo(
          "flightWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkTax
        );
      }

      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "flightWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkTax
        );
      } else if (checkTax.infantFixed != 0) {
        applyTaxTo(
          "flightWise",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkTax
        );
      }
    } else {
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkTax
        );
      } else if (checkTax.adultFixed != 0) {
        applyTaxTo(
          "",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.adultFixed,
          singleFlightDetails.PriceBreakup[0],
          "ADT",
          checkTax
        );
      }
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkTax
        );
      } else if (checkTax.childFixed != 0) {
        applyTaxTo(
          "",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.childFixed,
          singleFlightDetails.PriceBreakup[1],
          "CHD",
          checkTax
        );
      }
      if (checkTax.markupRate != 0) {
        applyTaxTo(
          "",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.markupRate,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkTax
        );
      } else if (checkTax.infantFixed != 0) {
        applyTaxTo(
          "",
          checkTax.markupRate,
          checkTax.maxMarkup,
          checkTax.infantFixed,
          singleFlightDetails.PriceBreakup[2],
          "INF",
          checkTax
        );
      }
    }
  }

  return singleFlightDetails;
};

async function calculateAfterCommertialPriceIncentive(
  priceBreakup,
  type,
  personType
) {
  // type:base,Tax , personType:ADT,CHD,INF

  if (type === "base" && personType === "ADT") {
    let totalMarkupAmount = 0;
    let totalOTAmount = 0;
    // let totalTDSAmount = 0;
    priceBreakup[0].CommercialBreakup.forEach((item) => {
      if (item.CommercialType === "Markup") {
        totalMarkupAmount += item.Amount;
      }
      if (
        item.CommercialType === "otherTax" &&
        item.onCommercialApply === "Base"
      ) {
        totalOTAmount += item.Amount;
      }
      // if (item.CommercialType === 'Discount') {
      //   totaldisCountAmount += item.Amount;
      // }
      // if (item.CommercialType === 'TDS' && item.onCommercialApply === 'Discount') {
      //   totalTDSAmount += item.Amount;
      // }
    });
    const basePrice =
      priceBreakup[0].BaseFare + totalMarkupAmount + totalOTAmount;

    return basePrice;
  } else if (type === "base" && personType === "CHD") {
    let totalMarkupAmount = 0;
    let totalOTAmount = 0;
    // let totalTDSAmount = 0;
    if (priceBreakup && priceBreakup[1]) {
      priceBreakup[1].CommercialBreakup.forEach((item) => {
        if (item.CommercialType === "Markup") {
          totalMarkupAmount += item.Amount;
        }

        if (
          item.CommercialType === "otherTax" &&
          item.onCommercialApply === "Base"
        ) {
          totalOTAmount += item.Amount;
        }
        // if (item.CommercialType === 'Discount') {
        //   totaldisCountAmount += item.Amount;
        // }
        // if (item.CommercialType === 'TDS') {
        //   totalTDSAmount += item.Amount;
        // }
      });
      const basePrice =
        priceBreakup[1].BaseFare + totalMarkupAmount + totalOTAmount;
      return basePrice;
    }
  } else if (type === "base" && personType === "INF") {
    let totalMarkupAmount = 0;
    let totalOTAmount = 0;
    // let totalTDSAmount = 0;
    if (priceBreakup && priceBreakup[2]) {
      priceBreakup[2].CommercialBreakup.forEach((item) => {
        if (item.CommercialType === "Markup") {
          totalMarkupAmount += item.Amount;
        }
        if (
          item.CommercialType === "otherTax" &&
          item.onCommercialApply === "Base"
        ) {
          totalOTAmount += item.Amount;
        }
        // if (item.CommercialType === 'Discount') {
        //   totaldisCountAmount += item.Amount;
        // }
        // if (item.CommercialType === 'TDS') {
        //   totalTDSAmount += item.Amount;
        // }
      });
      const basePrice =
        priceBreakup[2].BaseFare + totalMarkupAmount + totalOTAmount;

      return basePrice;
    }
  }
}
async function calculateAfterCommertialPricePLB(
  priceBreakup,
  type,
  personType
) {
  // type:base,Tax , personType:ADT,CHD,INF

  if (type === "base" && personType === "ADT") {
    let totalMarkupAmount = 0;
    let totalOTAmount = 0;
    //  let totalTDSAmount = 0;
    //let totalIncentiveAmount = 0;
    priceBreakup[0].CommercialBreakup.forEach((item) => {
      if (item.CommercialType === "Markup") {
        totalMarkupAmount += item.Amount;
      }
      if (
        item.CommercialType === "otherTax" &&
        item.onCommercialApply === "Base"
      ) {
        totalOTAmount += item.Amount;
      }
      //  if (item.CommercialType === 'Discount') {
      //    totaldisCountAmount += item.Amount;
      //  }
      //  if (item.CommercialType === 'TDS' && item.onCommercialApply === 'Discount') {
      //    totalTDSAmount += item.Amount;
      //  }
      //  if (item.CommercialType === 'Incentive') {
      //   totalIncentiveAmount += item.Amount;
      //  }
    });
    const basePrice =
      priceBreakup[0].BaseFare + totalMarkupAmount + totalOTAmount;

    return basePrice;
  } else if (type === "base" && personType === "CHD") {
    let totalMarkupAmount = 0;
    let totalOTAmount = 0;
    //  let totalTDSAmount = 0;
    //  let totalIncentiveAmount = 0;
    if (priceBreakup && priceBreakup[1]) {
      priceBreakup[1].CommercialBreakup.forEach((item) => {
        if (item.CommercialType === "Markup") {
          totalMarkupAmount += item.Amount;
        }
        if (
          item.CommercialType === "otherTax" &&
          item.onCommercialApply === "Base"
        ) {
          totalOTAmount += item.Amount;
        }
        //  if (item.CommercialType === 'Discount') {
        //    totaldisCountAmount += item.Amount;
        //  }
        //  if (item.CommercialType === 'TDS') {
        //    totalTDSAmount += item.Amount;
        //  }
        //  if (item.CommercialType === 'Incentive') {
        //   totalIncentiveAmount += item.Amount;
        //  }
      });
      const basePrice =
        priceBreakup[1].BaseFare + totalMarkupAmount + totalOTAmount;

      return basePrice;
    }
  } else if (type === "base" && personType === "INF") {
    let totalMarkupAmount = 0;
    let totalOTAmount = 0;
    //  let totalTDSAmount = 0;
    //  let totalIncentiveAmount = 0;
    if (priceBreakup && priceBreakup[2]) {
      priceBreakup[2].CommercialBreakup.forEach((item) => {
        if (item.CommercialType === "Markup") {
          totalMarkupAmount += item.Amount;
        }
        if (
          item.CommercialType === "otherTax" &&
          item.onCommercialApply === "Base"
        ) {
          totalOTAmount += item.Amount;
        }
        //  if (item.CommercialType === 'TDS') {
        //    totalTDSAmount += item.Amount;
        //  }
        //  if (item.CommercialType === 'Incentive') {
        //   totalIncentiveAmount += item.Amount;
        //  }
      });
      const basePrice =
        priceBreakup[2].BaseFare + totalMarkupAmount + totalOTAmount;

      return basePrice;
    }
  }
}
module.exports = {
  getApplyAllCommercial,
};

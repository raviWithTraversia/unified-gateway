module.exports.getVendorList = (credentialType) => {
  return credentialType === "LIVE" ? liveCredentials : testCredentials;
};

const testCredentials = [
  {
    vendorCode: "1A",
    credential: {
      userId: "WSK4HKAF",
      password: "3FZ@ZZVeRiS+",
      pseudoCityCode: "DELVS317Q",
      wSAP_TargetBranch: "1ASIWKAFK4H",
      // userId: "WSTCIEPT",
      // password: "AMADEUS100",
      // pseudoCityCode: "BOMTC2140",
      // wSAP_TargetBranch: "1ASIWEPTTCI",
    },
    fareTypes: [
      "RP",
      // "RF",
      "RU",
      "TAC",
      "ET",
      "MNR",
      "XND",
    ],
    dealCodes: [
      {
        airlineCode: "AI",
        dealCode: "015118",
        dealCodeType: "Corporate",
      },
    ],
    productClass: [],
    excludeAirlines: [],
  },
  {
    vendorCode: "1AN",
    credential: {
      userId: "WSK4HKAF",
      password: "3FZ@ZZVeRiS+",
      pseudoCityCode: "DELVS317Q",
      wSAP_TargetBranch: "1ASIWKAFK4H",
    },
    fareTypes: [
      "RP",
      // "RF",
      "RU",
      "MNR",
      // "TAC",
      // "ET",
      "IFS",
      // "XND"
    ],
    dealCodes: [
      // {
      //   airlineCode: "AI",
      //   dealCode: "015118",
      //   dealCodeType: "Corporate",
      // },
    ],
    productClass: [],
    //"includeAirlines": ["UK"], //"AI", "UK"
    excludeAirlines: [],
  },
  {
    vendorCode: "6E",
    credential: {
      userId: "IGN8547",
      password: "Indigo@558",
      pseudoCityCode: "WWW",
      wSAP_TargetBranch: "WWW",
    },
    fareTypes: [],
    dealCodes: [
      // {
      //   airlineCode: "6E",
      //   dealCode: "015118",
      //   dealCodeType: "Corporate",
      // },
    ],
    productClass: [],
    //"includeAirlines": [""], //"AI", "UK"
    excludeAirlines: [],
  },
];

const liveCredentials = [];

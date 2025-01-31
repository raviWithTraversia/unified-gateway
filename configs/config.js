module.exports.Config = {
  // Mode (LIVE or TEST)
  MODE: "TEST",
  TEST: {
    baseURL: "https://kafilaui.traversia.net", // frontend
    baseURLBackend: "https://kafila.traversia.net",
    additionalFlightsBaseURL: "http://kafilaapi.traversia.net:61102/api",
    baseURLBackend: "https://kafila.traversia.net",
    IRCTC_BASE_URL: "https://stagews.irctc.co.in",
    IRCTC_MASTER_ID: "WKAFL00000",
    IRCTC_AUTH: "Basic V0tBRkwwMDAwMDpUZXN0aW5nMQ==",
    Mode: "TEST",
  },
  LIVE: {
    baseURL: "https://agent.kafilaholidays.in", // frontend
    baseURLBackend: "https://agentapi.kafilaholidays.in",
    additionalFlightsBaseURL: "http://kflapi.kafilaholidays.in:61101/api",
    baseURLBackend: "https://agentapi.kafilaholidays.in",
    IRCTC_BASE_URL: "https://www.aps.irctc.co.in",
    IRCTC_MASTER_ID: "WKAFILA00000",
    IRCTC_AUTH: "Basic V0tBRklMQTAwMDAwOjBaZzFDMw==",
    Mode: "LIVE",
  },
  PORT: process.env.PORT || 3111,
  SECRET_JWT: process.env.SECRET_JWT || "kafilapanel",
  MONGODB_URL:
    process.env.MONGODB_URL ||
    "mongodb+srv://hsbhandari:fl1I9D8gtsbeHzdO@cluster0.xdzp3sk.mongodb.net/b2bportal",
  HOST: "smtp.hostinger.com",
  USER: "developer@traversia.tech",
  PASS: "Ttpl@2023",
  BASE_URL: "http://localhost:3111/api/",
  PAN_URL: "https://api.atlaskyc.com/v2/prod/verify/pan",
  GST_URL: "https://api.atlaskyc.com/v2/prod/verify/gstin",
  Adhar_URL: "https://api.atlaskyc.com/v2/prod/aadhaar/aadhaar_otp",
  AdharVerify_URl: "https://api.atlaskyc.com/v2/prod/aadhaar/aadhaar_kyc",
  HADDER_3RD_PAERT: {
    Accept: "application/json",
    Authorization:
      "Basic ay0zZmY0ZDYzNy0yY2UzLTQ2Y2UtYTAzMS0wZDEyMDAwOTM1MzE6cy1kNzlmOTk5MC1iYTBjLTRmNTctOTA5MS03NWYyZTQ1ZTA1Njk=",
  },
  GST_TOKEN: {
    Accept: "application/json",
    Authorization:
      "Basic ay0zZmY0ZDYzNy0yY2UzLTQ2Y2UtYTAzMS0wZDEyMDAwOTM1MzE6cy1kNzlmOTk5MC1iYTBjLTRmNTctOTA5MS03NWYyZTQ1ZTA1Njk=",
  },
  MAIL_CONFIG_ID: "6538c0364756928875840840",
  MONGODB_URL_2:
    "mongodb+srv://kafila:GeFi0weSeFN19FBv@cluster0.c7fohxg.mongodb.net/b2bportal",

  PAYMENT_CREDENTIALS_PAYU: {
    LIVE: {
      salt: "qg0bLpmz",
      key: "WgPtB8",
    },
    TEST: {
      salt: "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW",
      key: "gtKFFx",
    },
    Live: {
      salt: "DlSTL0cw",
      key: "HYDinl3tea",
    },
  },

  PAYMENT_CREDENTIALS_EASEBUSS: {
    LIVE: {
      salt: "qg0bLpmz",
      key: "WgPtB8",
    },
    TEST: {
      salt: "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW",
      key: "gtKFFx",
    },
  },

  EASEBUZZ_PG_URL: "https://testpay.easebuzz.in/payment/initiateLink",
  CancellationGSTRate: 5,
  apiTimeout: 40_000, // 40 s,
};

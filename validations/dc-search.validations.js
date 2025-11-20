const { check } = require("express-validator");
const { isValidDate } = require("./helpers/date");

module.exports.DCSearchValidations = [
  check("Authentication")
    .notEmpty()
    .isObject()
    .withMessage("Authentication field is missing"),
  check("Authentication.CredentialType")
    .notEmpty()
    .isString()
    .isIn(["TEST", "LIVE"])
    .withMessage("credentialType must be TEST or LIVE"),
  check("Authentication.TraceId")
    .notEmpty()
    .isString()
    .withMessage("Invalid TraceId"),
  check("Authentication.UserId")
    .notEmpty()
    .isString()
    .withMessage("Invalid UserId"),

  check("TypeOfTrip").notEmpty().isString().withMessage("Invalid TypeOfTrip"),
  check("TravelType")
    .notEmpty()
    .isIn(["Domestic", "International"])
    .withMessage("Invalid TravelType"),
  check("Airlines").optional().isArray().withMessage("Invalid Airlines"),
  check("PNR").notEmpty().isString().withMessage("Invalid Airlines"),
  check("ReissueDates")
    .notEmpty()
    .isObject()
    .withMessage("Invalid ReissueDates"),
  check("ReissueDates")
    .custom((value) => {
      if (!value.DepartureDate && !value.ReturnDate) {
        return false;
      }

      if (value.DepartureDate && !isValidDate(value.DepartureDate)) {
        return false;
      }

      if (value.ReturnDate && !isValidDate(value.ReturnDate)) {
        return false;
      }

      return true;
    })
    .withMessage("Invalid ReissueDates"),
  check("RefundableOnly")
    .optional()
    .isBoolean()
    .withMessage("Invalid RefundableOnly"),
  check("FareFamily").optional().isArray().withMessage("Invalid FareFamily"),

  //   check("travelType")
  //     .isIn(["DOM", "INT"])
  //     .withMessage("travelType must be DOM or INT"),
  //   check("uniqueKey").notEmpty().withMessage("uniqueKey is required"),
  //   check("sectors")
  //     .isArray({ min: 1 })
  //     .withMessage("sectors must be an array with at least one element"),
  //   check("sectors.*.origin")
  //     .notEmpty()
  //     .withMessage("origin is required for each sector"),
  //   check("sectors.*.destination")
  //     .notEmpty()
  //     .withMessage("destination is required for each sector"),
  //   check("sectors.*.departureDate")
  //     .custom(isValidDate)
  //     .withMessage(
  //       "Valid departureDate is required for each sector in DD-MM-YYYY format"
  //     ),
  //   check("sectors.*.departureTimeFrom")
  //     .notEmpty()
  //     .withMessage("departureTimeFrom is required for each sector"),
  //   check("sectors.*.departureTimeTo")
  //     .notEmpty()
  //     .withMessage("departureTimeTo is required for each sector"),
  //   check("sectors.*.cabinClass")
  //     .isIn(["Economy", "Business", "First", "PremiumEconomy"])
  //     .notEmpty()
  //     .withMessage("cabinClass is required for each sector"),
  //   check("paxDetail.adults")
  //     .isInt({ min: 0 })
  //     .withMessage("At least one adult is required"),
  //   check("paxDetail.children")
  //     .isInt({ min: 0 })
  //     .withMessage("children must be a non-negative integer"),
  //   check("paxDetail.infants")
  //     .isInt({ min: 0 })
  //     .withMessage("infants must be a non-negative integer"),
  //   check("paxDetail.student")
  //     .optional()
  //     .isInt({ min: 0 })
  //     .withMessage("student must be a non-negative integer"),
  //   check("paxDetail.senior")
  //     .optional()
  //     .isInt({ min: 0 })
  //     .withMessage("senior must be a non-negative integer"),
  //   check("paxDetail.youths")
  //     .isInt({ min: 0 })
  //     .withMessage("youths must be a non-negative integer"),
  //   check("maxStops")
  //     .isInt({ min: 0 })
  //     .withMessage("maxStops must be a non-negative integer"),
  //   //check('maxResult').isInt({ min: 100 }).withMessage('maxResult must be a non-negative integer'),
  //   check("vendorList")
  //     .isArray({ min: 1 })
  //     .withMessage("vendorList must be an array with at least one element"),
  //   check("vendorList.*.vendorCode")
  //     .notEmpty()
  //     .withMessage("vendorCode is required for each vendor"),
  //   check("vendorList.*.corporatedealCode")
  //     .isArray()
  //     .withMessage("corporatedealCode must be an array for each vendor"),
  //   check("vendorList.*.corporatedealCode.*.airlineCode")
  //     .notEmpty()
  //     .withMessage("airlineCode is required for each deal"),
  //   check("vendorList.*.corporatedealCode.*.dealCode")
  //     .notEmpty()
  //     .withMessage("dealCode is required for each deal"),
  //   check("vendorList.*.corporatedealCode.*.dealCodeType")
  //     .notEmpty()
  //     .withMessage("dealCodeType required"),
  //   // .isIn(['TMC', 'Corporate', 'Agent'])
  //   check("vendorList.*.fareTypes")
  //     .isArray()
  //     .withMessage("fareTypes must be an array for each vendor"),
  //   check("vendorList.*.includeAirlines")
  //     .isArray()
  //     .withMessage("includeAirlines must be an array for each vendor"),
  //   check("vendorList.*.excludeAirlines")
  //     .isArray()
  //     .withMessage("excludeAirlines must be an array for each vendor"),
  //check('returnSpecialFare').isBoolean().withMessage('returnSpecialFare must be a boolean'),
  //check('refundableOnly').isBoolean().withMessage('refundableOnly must be a boolean')
];

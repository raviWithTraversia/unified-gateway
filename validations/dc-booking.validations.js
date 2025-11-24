const { check } = require("express-validator");
const { isValidDate } = require("./helpers/date");

module.exports.DCBookingValidations = [
  check("SearchRQ").notEmpty().isObject().withMessage("SearchRQ is required"),
  check("SearchRQ.Authentication")
    .notEmpty()
    .isObject()
    .withMessage("Authentication field is missing"),
  check("SearchRQ.Authentication.CredentialType")
    .notEmpty()
    .isString()
    .isIn(["TEST", "LIVE"])
    .withMessage("credentialType must be TEST or LIVE"),
  check("SearchRQ.Authentication.TraceId")
    .notEmpty()
    .isString()
    .withMessage("Invalid TraceId"),
  check("SearchRQ.Authentication.UserId")
    .notEmpty()
    .isString()
    .withMessage("Invalid UserId"),

  check("SearchRQ.TypeOfTrip")
    .notEmpty()
    .isString()
    .withMessage("Invalid TypeOfTrip"),
  check("SearchRQ.TravelType")
    .notEmpty()
    .isIn(["Domestic", "International"])
    .withMessage("Invalid TravelType"),
  check("PNR").notEmpty().isString().withMessage("Invalid Airlines"),
  check("ItineraryPriceCheckResponses")
    .notEmpty()
    .isArray({ min: 1 })
    .withMessage("Invalid Airlines"),
  check("paymentMethodType")
    .notEmpty()
    .isString()
    .withMessage("Invalid Payment Method Type"),
];

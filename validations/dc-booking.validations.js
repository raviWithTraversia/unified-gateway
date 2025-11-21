const { check } = require("express-validator");
const { isValidDate } = require("./helpers/date");

module.exports.DCBookingValidations = [
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
  check("PNR").notEmpty().isString().withMessage("Invalid Airlines"),
  check("Itinerary")
    .notEmpty()
    .isArray({ min: 1 })
    .withMessage("Invalid Airlines"),
];

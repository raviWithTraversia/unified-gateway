const moment = require("moment");

module.exports.isValidDate = (value, format = "DD-MM-YYYY") => {
  return moment(value, format, true).isValid();
};

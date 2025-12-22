const { getAirPortDetails } = require("./airport.service");
const { getAirlineDetails } = require("./airline.service");

module.exports = async () => {
  getAirPortDetails();
  getAirlineDetails();
};

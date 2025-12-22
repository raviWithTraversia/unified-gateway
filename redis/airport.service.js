const { redisClient } = require("./redis.index");
const airport = require("../models/AirportDetail");
const { isRedisConnected } = require("./redis-connection");

const getAirPortDetails = async () => {
  let airports = [];
  try {
    let airportsCache = null;
    const isRedisActive = await isRedisConnected();
    if (isRedisActive)
      airportsCache = await redisClient.get(getCustomCode("airports"));

    if (!airportsCache) {
      console.log("fetching airports from DB");
      const airportDocs = await airport.find();
      if (isRedisActive && airportDocs?.length) {
        for (let airport of airportDocs)
          await redisClient.set(
            getCustomCode(airport.Airport_Code),
            JSON.stringify(airport)
          );

        redisClient.set(getCustomCode("airports"), "true");
        airports = airportDocs;
      }
    }
  } catch (error) {
    console.error("Error fetching airPort details:", error.message);
  }
  return airports;
};

getAirPortDetails();
const getAirportByCode = async (code) => {
  let _airport = {};
  let key = getCustomCode(code);

  try {
    let airportCache = null;
    const isRedisActive = await isRedisConnected();
    if (isRedisActive) airportCache = await redisClient.get(key);

    if (airportCache) _airport = JSON.parse(airportCache);
    else {
      const airportDoc = await airport.findOne({ Airport_Code: code });
      if (isRedisActive && airportDoc) {
        await redisClient.set(key, JSON.stringify(airportDoc));
      }
      if (airportDoc) _airport = airportDoc;
    }
  } catch (error) {
    console.log({
      errorReadingAirportFromCache: error.message,
      stack: error.stack,
    });
  }
  return _airport || {};
};

const getCustomCode = (code) => {
  return "KF_" + code;
};

module.exports = {
  getAirPortDetails,
  getAirportByCode,
  getCustomCode,
};

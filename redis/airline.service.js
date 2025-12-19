const Airline = require("../models/AirlineCode");
const { getCustomCode } = require("./airport.service");

const { redisClient } = require("./redis.index.js");
const { isRedisConnected } = require("./redis-connection");

const getAirlineDetails = async () => {
  let airlines = [];
  try {
    const isRedisActive = await isRedisConnected();
    let airlineCache = null;
    if (isRedisActive)
      airlineCache = await redisClient.get(getCustomCode("airlines"));

    if (!airlineCache) {
      console.log("fetching airlines from DB");
      const airlineDocs = await Airline.find();

      if (isRedisActive && airlineDocs?.length) {
        for (let airline of airlineDocs)
          await redisClient.set(
            getCustomCode(airline.airlineCode),
            JSON.stringify(airline)
          );

        redisClient.set(getCustomCode("airlines"), "true");
      }

      airlines = airlineDocs || [];
    }
  } catch (error) {
    console.error("Error fetching airline details:", error.message);
  }
  return airlines;
};

const getAirlineByCode = async (code) => {
  let airline = {};
  try {
    const isRedisActive = await isRedisConnected();
    let airlineCache = null;
    let key = getCustomCode(code);
    if (isRedisActive) airlineCache = await redisClient.get(key);

    if (airlineCache) airline = JSON.parse(airlineCache);
    else {
      const airlineDoc = await Airline.findOne({ airlineCode: code });
      if (isRedisActive && airlineDoc) {
        await redisClient.set(key, JSON.stringify(airlineDoc));
      }
      if (airlineDoc) airline = airlineDoc;
    }
  } catch (error) {
    console.log({
      errorReadingAirlineFromCache: error.message,
      stack: error.stack,
    });
  }
  return airline || {};
};

module.exports = {
  getAirlineDetails,
  getAirlineByCode,
};

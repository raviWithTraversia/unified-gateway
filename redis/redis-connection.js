const { redisClient } = require("./redis.index");

module.exports.isRedisConnected = async () => {
  try {
    await redisClient.ping();
    // logger.info("Redis server is connected and responsive.");
    return true;
  } catch (error) {
    // logger.info("FAILED TO PING REDIS SERVER");
    return false;
  }
};

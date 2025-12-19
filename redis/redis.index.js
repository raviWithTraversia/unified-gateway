const Redis = require("ioredis");
const { getAirPortDetails } = require("./airport.service");
const { getAirlineDetails } = require("./airline.service");

const sentinelAddressList = process.env.REDIS_SENTINELS?.split?.("|") ?? [];
const sentinels = [];

sentinelAddressList?.forEach((address) => {
  address = address?.trim();
  if (address?.includes?.(":")) {
    const [host, port] = address.split(":");
    if (host && port && !isNaN(parseInt(port))) {
      sentinels.push({ host, port: parseInt(port) });
    }
  }
});

const envRole = process.env?.REDIS_ROLE?.toLowerCase?.();
const role = envRole === "master" || envRole === "slave" ? envRole : "master";

const redisClient = process.env.SINGLE_REDIS_INSTANCE
  ? new Redis({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      port: Number(process.env.REDIS_PORT) || 6379,
    })
  : new Redis({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      sentinels,
      name: process.env.REDIS_NAME,
      role,
    });

redisClient.on("error", (err) => {
  console.error(`FAILED TO CONNECT REDIS SERVER - ${err.message}`);
  redisClient.disconnect();
});

redisClient.on("ready", () => {
  console.log("CONNECTED TO REDIS SERVER");
  getAirPortDetails();
  getAirlineDetails();
});

module.exports = {
  redisClient,
};

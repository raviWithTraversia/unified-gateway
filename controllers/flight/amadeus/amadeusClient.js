const config = require('../../../configs/config');
const soap = require('soap');
const fs = require('fs');
const path = require('path');

// Helper function to create SOAP client
async function createAmadeusClient() {
  const wsdlPath = path.resolve(__dirname, 'fwsap/stag', 'service.wsdl'); // Adjust as necessary

  let endpoint, clientId, clientSecret;

  if (config.MODE === 'TEST') {
    endpoint = config.WSAP_AMADEUS.TEST.WSAP_ENDPOINT;
    clientId = config.WSAP_AMADEUS.TEST.WSAP_CLIENT_ID;
    clientSecret = config.WSAP_AMADEUS.TEST.WSAP_CLIENT_SECRET;
  } else if (config.MODE === 'LIVE') {
    endpoint = config.WSAP_AMADEUS.LIVE.WSAP_ENDPOINT;
    clientId = config.WSAP_AMADEUS.LIVE.WSAP_CLIENT_ID;
    clientSecret = config.WSAP_AMADEUS.LIVE.WSAP_CLIENT_SECRET;
  } else {
    throw new Error('Invalid environment specified');
  }

  const options = {
    wsdl_headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    },
    endpoint: endpoint
  };

  return new Promise((resolve, reject) => {
    soap.createClient(wsdlPath, options, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

module.exports = {
  createAmadeusClient
};

const soap = require('soap');
const path = require('path');
// // Replace with your actual WSDL URL provided by Amadeus
// const AMADEUS_WSDL_URL = "https://nodeD1.test.webservices.amadeus.com/1ASIWMOTVX1";
// const AMADEUS_USER_ID = "WSVX1MOT";
// const AMADEUS_PASSWORD = "AMADEUS100";
// const AMADEUS_ORG_ID = "1ASIWMOTVX1";
// const AMADEUS_SYSTEM_ID = "DELWI2152";

const wsdlPath = path.join(__dirname, '1ASIWKAFK4H_PDT_20240620_082423/1ASIWKAFK4H_PDT_20240620_082423.wsdl');
// Function to create SOAP client and make request
const search = async () => {
  try {
    console.log(wsdlPath, 'pathInvalid');
    // Create SOAP client
    const client = await soap.createClientAsync(wsdlPath);

    // Define the request parameters
    const requestArgs = {
      // Example request arguments, modify these according to the Amadeus API specifications
      Fare_MasterPricerTravelBoardSearch: {
        numberOfUnit: {
          unitNumberDetail: {
            numberOfUnits: 1,
            typeOfUnit: 'PX'
          }
        },
        // Add other required parameters here
      }
    };
    console.log('clientASY');
    // Set the security headers (if required)
    client.setSecurity(new soap.BasicAuthSecurity('WSVX1MOT', 'AMADEUS100'));
    console.log('userpass');
    // Make the SOAP request
    const [result] = await client.Fare_MasterPricerTravelBoardSearchAsync(requestArgs);
    console.log('result');
    // Handle the response
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};





module.exports = {
  search
};


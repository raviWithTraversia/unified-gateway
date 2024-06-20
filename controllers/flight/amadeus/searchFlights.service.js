const soap = require('soap');

// Replace with your actual WSDL URL provided by Amadeus
const AMADEUS_WSDL_URL = "https://nodeD1.test.webservices.amadeus.com/1ASIWMOTVX1";
const AMADEUS_USER_ID = "WSVX1MOT";
const AMADEUS_PASSWORD = "AMADEUS100";
const AMADEUS_ORG_ID = "1ASIWMOTVX1";
const AMADEUS_SYSTEM_ID = "DELWI2152";

// Function to create the SOAP client
async function createClient(wsdlUrl) {
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlUrl, (err, client) => {
      if (err) {
        return reject(err);
      }
      resolve(client);
    });
  });
}

// Function to perform the Master Pricer Travelboard Search
async function searchFlights(client, params) {
  return new Promise((resolve, reject) => {
    client.Fare_MasterPricerTravelBoardSearch(params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

async function search() {
  try {
    const client = await createClient(AMADEUS_WSDL_URL);
    console.log(client);
    // Set the authentication headers
    client.addSoapHeader({
      'Session': {
        'SessionId': '',
        'SequenceNumber': '',
        'SecurityToken': ''
      },
      'AMA_SecurityHostedUser': {
        'UserID': {
          'RequestorType': {
            'Type': 'U',
            'ID': AMADEUS_USER_ID
          },
          'Company': {
            'ID': AMADEUS_ORG_ID,
            'Code': AMADEUS_SYSTEM_ID
          }
        },
        'Password': {
          'Value': AMADEUS_PASSWORD
        }
      }
    }, '', 'http://xml.amadeus.com/FMPTBR_23_1_1A');

    const params = {
      'Fare_MasterPricerTravelBoardSearch': {
        'numberOfUnit': {
          'unitNumberDetail': [
            {
              'numberOfUnits': 1,
              'typeOfUnit': 'PX'
            },
            {
              'numberOfUnits': 1,
              'typeOfUnit': 'RC'
            }
          ]
        },
        'paxReference': [
          {
            'ptc': 'ADT',
            'traveller': [
              {
                'ref': 1
              }
            ]
          }
        ],
        'itinerary': [
          {
            'requestedSegmentRef': {
              'segRef': 1
            },
            'departureLocalization': {
              'depMultiCity': {
                'locationId': 'NYC'
              }
            },
            'arrivalLocalization': {
              'arrivalMultiCity': {
                'locationId': 'LON'
              }
            },
            'timeDetails': {
              'firstDateTimeDetail': {
                'date': '20230701'
              }
            }
          }
        ],
        'travelFlightInfo': {
          'cabinId': {
            'cabin': 'C'
          }
        }
      }
    };

    const result = await searchFlights(client, params);
    console.log(result);
  } catch (error) {
    console.error('Error fetching flight offers:', error);
  }
}

module.exports = {
  search
};


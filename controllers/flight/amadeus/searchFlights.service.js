const soap = require('soap');
const path = require('path');
const builder = require('xmlbuilder');

//const rp = require('request-promise');
const wsdlUrl = path.join(__dirname, '1ASIWKAFK4H_PDT_20240624_105626/1ASIWKAFK4H_PDT_20240624_105626.wsdl');

const endpoint = 'https://nodeD1.test.webservices.amadeus.com/1ASIWKAFK4H'; // Replace with the actual endpoint URL

const wsap = '1ASIWKAFK4H';
const userId = 'WSK4HKAF';
const clearPassword = '3FZ@ZZVeRiS+';
const base64Password = 'M0ZaQFpaVmVSaVMr';
const officeId = 'DELVS317Q';
const dutyCode = 'SU';

const authData = {
    'userId': userId,
    'passwordData': base64Password,
    'officeId': officeId,
    'dutyCode': dutyCode
};

// Function to initiate a session
async function startSession() {
    const sessionClient = await soap.createClientAsync(wsdlUrl, { endpoint });
    const sessionHeader = {
        'Security': {
            'UserID': wsap,
            'Password': clearPassword,
            'OfficeID': officeId,
            'DutyCode': dutyCode
        }
    };

    sessionClient.addSoapHeader(sessionHeader);
    
    sessionClient.on('request', (xml) => {
        console.log('Request XML:', xml);
    });
    sessionClient.on('response', (xml) => {
        console.log('Response XML:', xml);
    });


    return sessionClient;
}

// Function to call Fare_MasterPricerTravelBoardSearch
async function searchFares(sessionClient) {
  const searchRequest = {
    Fare_MasterPricerTravelBoardSearch: {
        numberOfUnit: {
            unitNumberDetail: [
                {
                    numberOfUnits: 250,
                    typeOfUnit: 'RC'
                },
                {
                    numberOfUnits: 2,
                    typeOfUnit: 'PX'
                }
            ]
        },
        paxReference: [
            {
                ptc: ['IIT', 'ADT'],
                traveller: {
                    ref: 1
                }
            },
            {
                ptc: ['INN', 'CNN'],
                traveller: {
                    ref: 2
                }
            },
            {
                ptc: ['ITF', 'INF'],
                traveller: {
                    ref: 1,
                    infantIndicator: 1
                }
            }
        ],
        fareOptions: {
            pricingTickInfo: {
                pricingTicketing: {
                    priceType: ['RP', 'RU', 'TAC', 'ET']
                }
            }
        },
        itinerary: [
            {
                requestedSegmentRef: {
                    segRef: 1
                },
                departureLocalization: {
                    departurePoint: {
                        locationId: 'BEY'
                    }
                },
                arrivalLocalization: {
                    arrivalPointDetails: {
                        locationId: 'IST'
                    }
                },
                timeDetails: {
                    firstDateTimeDetail: {
                        date: '071024'
                    }
                }
            }
        ]
    }
};
    // const xml = builder.create(searchRequest).end({ pretty: true });
    // console.log(xml);
    return await sessionClient.Fare_MasterPricerTravelBoardSearchAsync(searchRequest);
}

// Function to close the session
async function closeSession(sessionClient) {
    const logoutRequest = {
        // Fill in with your actual logout request data
    };
    return await sessionClient.Security_AuthenticateAsync(logoutRequest);
}

// Main function to execute the steps
async function search() {
    try {
        const sessionClient = await startSession();
        //console.log('Session started', sessionClient);
        
        const searchResponse = await searchFares(sessionClient);
        //console.log('Search response:', searchResponse);
        return false;
        await closeSession(sessionClient);
        console.log('Session closed');
    } catch (error) {
        // console.error('Error:', error);
    }
}

module.exports = {
  search
};

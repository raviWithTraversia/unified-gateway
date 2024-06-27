const soap = require('soap');
const path = require('path');
const builder = require('xmlbuilder');

const wsdlUrl = path.join(__dirname, '1ASIWKAFK4H_PDT_20240624_105626/1ASIWKAFK4H_PDT_20240624_105626.wsdl');

const endpoint = 'https://nodeD1.test.webservices.amadeus.com/1ASIWKAFK4H'; // Replace with actual endpoint URL

const wsap = '1ASIWKAFK4H';
const userId = 'WSK4HKAF';
const clearPassword = '3FZ@ZZVeRiS+';
const base64Password = 'M0ZaQFpaVmVSaVMr';
const officeId = 'DELVS317Q';
const dutyCode = 'SU';

// Function to initiate a session
async function startSession() {
    const sessionClient = await soap.createClientAsync(wsdlUrl, { endpoint });

    const soapHeaders = {
        'Action': 'http://webservices.amadeus.com/FMPTBQ_18_1_1A',
        'MessageID': 'urn:uuid:8f9761ce-9b8c-44bb-8672-c80bb8202eb2',
        'ReplyTo': 'http://www.w3.org/2005/08/addressing/anonymous',
        'Security': {
            'UsernameToken': {
                'Username': userId,
                'Password': {
                    'Type': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
                    'Value': base64Password
                },
                'Nonce': {
                    'EncodingType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
                    'Value': 'flSmzAj+W2ND++ryKGG6qw=='
                },
                'Created': '2024-06-24T12:04:31Z'
            }
        },
        'AMA_SecurityHostedUser': {
            'UserID': {
                'POS_Type': '1',
                'PseudoCityCode': officeId,
                'AgentDutyCode': 'SU',
                'RequestorType': 'U',
                'RequestorID': {
                    'CompanyName': '1A'
                }
            }
        }
    };

    // Add the SOAP headers
    sessionClient.addSoapHeader(soapHeaders);

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
                        numberOfUnits: 1,
                        typeOfUnit: 'PX'
                    }
                ]
            },
            paxReference: {
                ptc: 'ADT',
                traveller: {
                    ref: 1
                }
            },
            fareOptions: {
                pricingTickInfo: {
                    pricingTicketing: {
                        priceType: ['RP', 'RU', 'TAC', 'ET', 'XND', 'IFS']
                    }
                },
                feeIdDescription: {
                    feeId: [
                        {
                            feeType: 'FFI',
                            feeIdNumber: 3
                        },
                        {
                            feeType: 'UPH',
                            feeIdNumber: 3
                        }
                    ]
                }
            },
            travelFlightInfo: {
                cabinId: {
                    cabin: 'M'
                },
                companyIdentity: {
                    carrierQualifier: 'X',
                    carrierId: ['HR', 'H1']
                }
            },
            itinerary: {
                requestedSegmentRef: {
                    segRef: 1
                },
                departureLocalization: {
                    departurePoint: {
                        locationId: 'DEL'
                    }
                },
                arrivalLocalization: {
                    arrivalPointDetails: {
                        locationId: 'LKO'
                    }
                },
                timeDetails: {
                    firstDateTimeDetail: {
                        timeQualifier: 'TD',
                        date: '300624',
                        time: '0001'
                    }
                }
            }
        }
    };

    return await sessionClient.Fare_MasterPricerTravelBoardSearchAsync(searchRequest);
}

// Function to close the session
async function closeSession(sessionClient) {
    const logoutRequest = {
        // Fill in with your actual logout request data if needed
    };
    return await sessionClient.Security_AuthenticateAsync(logoutRequest);
}

// Main function to execute the steps
async function search() {
    try {
        const sessionClient = await startSession();
        const searchResponse = await searchFares(sessionClient);
        console.log('Search response:', searchResponse); // Handle response as needed

        await closeSession(sessionClient);
        console.log('Session closed');
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    search
};

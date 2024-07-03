const soap = require('soap');
const path = require('path');

const wsdlUrl = path.join(__dirname, '1ASIWKAFK4H_PDT_20240702_100618/1ASIWKAFK4H_PDT_20240702_100618.wsdl');
const endpoint = 'https://nodeD1.test.webservices.amadeus.com/1ASIWKAFK4H';
const wsap = '1ASIWKAF';
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

async function searchFares(sessionClient) {
    const searchRequest = {
        Fare_MasterPricerTravelBoardSearch: {
            numberOfUnit: {
                unitNumberDetail: [
                    { numberOfUnits: 250, typeOfUnit: 'RC' },
                    { numberOfUnits: 1, typeOfUnit: 'PX' }
                ]
            },
            paxReference: {
                ptc: 'ADT',
                traveller: { ref: 1 }
            },
            fareOptions: {
                pricingTickInfo: {
                    pricingTicketing: {
                        priceType: ['RP', 'RU', 'TAC', 'ET', 'XND', 'IFS']
                    }
                },
                feeIdDescription: {
                    feeId: [
                        { feeType: 'FFI', feeIdNumber: 3 },
                        { feeType: 'UPH', feeIdNumber: 3 }
                    ]
                }
            },
            travelFlightInfo: {
                cabinId: { cabin: 'M' },
                companyIdentity: {
                    carrierQualifier: 'X',
                    carrierId: ['HR', 'H1']
                }
            },
            itinerary: {
                requestedSegmentRef: { segRef: 1 },
                departureLocalization: {
                    departurePoint: { locationId: 'DEL' }
                },
                arrivalLocalization: {
                    arrivalPointDetails: { locationId: 'LKO' }
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

async function closeSession(sessionClient) {
    const logoutRequest = {};
    return await sessionClient.Security_AuthenticateAsync(logoutRequest);
}

async function search() {
    try {
        const sessionClient = await startSession();
        const searchResponse = await searchFares(sessionClient);
        console.log('Search response:', searchResponse);
        await closeSession(sessionClient);
        console.log('Session closed');
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    search
};

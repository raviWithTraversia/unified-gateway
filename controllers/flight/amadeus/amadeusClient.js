const soap = require('soap');
const generateSoapHeader = require('./generateSoapHeader');

const WSDL_URL = 'https://noded5.test.webservices.amadeus.com/1ASIWKAFK4H?wsdl';

async function search() {
    const username = 'WSK4HKAF';
    const password = '3FZ@ZZVeRiS+';

    const soapHeader = generateSoapHeader(username, password);
    
    soap.createClient(WSDL_URL, (err, client) => {
        if (err) throw err;

        client.addSoapHeader(soapHeader);

        const requestArgs = {
            // Your request payload here
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
                    traveller: [
                        {
                            ref: 1
                        }
                    ]
                },
                fareOptions: {
                    pricingTickInfo: {
                        pricingTicketing: {
                            priceType: ['RP', 'RU', 'TAC', 'ET', 'XND']
                        }
                    }
                },
                travelFlightInfo: {
                    cabinId: {
                        cabin: 'M'
                    },
                    companyIdentity: {
                        carrierQualifier: 'M',
                        carrierId: ['AI', 'UK']
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
                            date: '300924',
                            time: '0001'
                        }
                    }
                }
            }
        };

        client.Fare_MasterPricerTravelBoardSearch(requestArgs, (err, result) => {
            if (err) throw err;
            console.log('Response:', result);
        });
    });
}

module.exports = {
    search
};

const axios = require('axios');
const createSOAPHeader = require('./amadeusHeader');

async function search() {
    const username = 'WSK4HKAF';
    const password = '3FZ@ZZVeRiS+';

    const soapHeader = createSOAPHeader(username, password);

    const soapBody = `
    <soap:Body>
        <Fare_MasterPricerTravelBoardSearch xmlns="http://xml.amadeus.com/FMPTBQ_24_1_1A">
            <numberOfUnit>
                <unitNumberDetail>
                    <numberOfUnits>250</numberOfUnits>
                    <typeOfUnit>RC</typeOfUnit>
                </unitNumberDetail>
                <unitNumberDetail>
                    <numberOfUnits>1</numberOfUnits>
                    <typeOfUnit>PX</typeOfUnit>
                </unitNumberDetail>
            </numberOfUnit>
            <paxReference>
                <ptc>ADT</ptc>
                <traveller>
                    <ref>1</ref>
                </traveller>
            </paxReference>
            <fareOptions>
                <pricingTickInfo>
                    <pricingTicketing>
                        <priceType>RP</priceType>
                        <priceType>RU</priceType>
                        <priceType>TAC</priceType>
                        <priceType>ET</priceType>
                        <priceType>XND</priceType>
                    </pricingTicketing>
                </pricingTickInfo>
            </fareOptions>
            <travelFlightInfo>
                <cabinId>
                    <cabin>M</cabin>
                </cabinId>
                <companyIdentity>
                    <carrierQualifier>M</carrierQualifier>
                    <carrierId>AI</carrierId>
                    <carrierId>UK</carrierId>
                </companyIdentity>
            </travelFlightInfo>
            <itinerary>
                <requestedSegmentRef>
                    <segRef>1</segRef>
                </requestedSegmentRef>
                <departureLocalization>
                    <departurePoint>
                        <locationId>DEL</locationId>
                    </departurePoint>
                </departureLocalization>
                <arrivalLocalization>
                    <arrivalPointDetails>
                        <locationId>LKO</locationId>
                    </arrivalPointDetails>
                </arrivalLocalization>
                <timeDetails>
                    <firstDateTimeDetail>
                        <timeQualifier>TD</timeQualifier>
                        <date>300924</date>
                        <time>0001</time>
                    </firstDateTimeDetail>
                </timeDetails>
            </itinerary>
        </Fare_MasterPricerTravelBoardSearch>
    </soap:Body>`;

    const soapEnvelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
        ${soapHeader}
        ${soapBody}
    </soap:Envelope>`;

    console.log('SOAP Request:', soapEnvelope);

    try {
        const response = await axios.post('https://noded5.test.webservices.amadeus.com/1ASIWKAFK4H', soapEnvelope, {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://webservices.amadeus.com/FMPTBQ_24_1_1A'
            }
        });
        console.log('SOAP Response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

module.exports = {
    search
};

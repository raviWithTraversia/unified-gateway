const axios = require('axios');
const crypto = require('crypto');

function generateNonce() {
    return crypto.randomBytes(16).toString('base64');
}

function generateCreated() {
    return new Date().toISOString();
}

async function search() {
    const url = 'https://noded5.test.webservices.amadeus.com/1ASIWKAFK4H';
    const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://webservices.amadeus.com/FMPTBQ_24_1_1A'
    };

    const nonce = generateNonce();
    const created = generateCreated();

    const xml = `
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
          <soap:Header>
            <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">2d9a3b03-637a-4f62-b4bc-02aa0add7ff9</add:MessageID>
            <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FMPTBQ_24_1_1A</add:Action>
            <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://noded5.test.webservices.amadeus.com/1ASIWKAFK4H</add:To>
            <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1" />
            <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
              <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">
                <oas:Username>WSK4HKAF</oas:Username>
                <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonce}</oas:Nonce>
                <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">M0ZaQFpaVmVSaVMr</oas:Password>
                <oas1:Created>${created}</oas1:Created>
              </oas:UsernameToken>
            </oas:Security>
            <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">
              <UserID AgentDutyCode="SU" POS_Type="1" PseudoCityCode="DELVS317Q" RequestorType="U" />
            </AMA_SecurityHostedUser>
            <awsse:Session TransactionStatusCode="Start" xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" />
          </soap:Header>
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
          </soap:Body>
        </soap:Envelope>`;

    try {
        const response = await axios.post(url, xml, { headers });
        console.log(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
    }
}

module.exports = {
    search
};

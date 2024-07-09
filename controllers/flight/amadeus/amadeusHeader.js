const crypto = require('crypto');

function generateNonce() {
    return crypto.randomBytes(16).toString('base64');
}

function generateCreated() {
    return new Date().toISOString();
}

function generateSHA1(input) {
    return crypto.createHash('sha1').update(input).digest();
}

function generatePasswordDigest(nonce, created, password) {
    const sha1Password = generateSHA1(password);
    const combined = Buffer.concat([Buffer.from(nonce, 'base64'), Buffer.from(created), sha1Password]);
    const sha1Combined = generateSHA1(combined);
    return sha1Combined.toString('base64');
}


function createSOAPHeader(username, password) {
    const nonce = generateNonce();
    const created = generateCreated();
    const passwordDigest = generatePasswordDigest(nonce, created, password);

    return `
    <soap:Header>    
        <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">2d9a3b03-637a-4f62-b4bc-02aa0add7ff9</add:MessageID>
        <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/FMPTBQ_24_1_1A</add:Action>    
        <add:To xmlns:add="http://www.w3.org/2005/08/addressing">https://noded5.test.webservices.amadeus.com/1ASIWKAFK4H</add:To>
        <oas:Security xmlns:oas="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <oas:UsernameToken xmlns:oas1="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" oas1:Id="UsernameToken-1">
                <oas:Username>${username}</oas:Username>
                <oas:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonce}</oas:Nonce>
                <oas:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${passwordDigest}</oas:Password>
                <oas1:Created>${created}</oas1:Created>
            </oas:UsernameToken>
        </oas:Security>
        <AMA_SecurityHostedUser xmlns="http://xml.amadeus.com/2010/06/Security_v1">
            <UserID AgentDutyCode="SU" POS_Type="1" PseudoCityCode="DELVS317Q" RequestorType="U" />
        </AMA_SecurityHostedUser>    
    </soap:Header>`;
}

module.exports = createSOAPHeader;

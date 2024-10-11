const accountSid = process.env.ACCOUNTSSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

function sendSMSNotification(phoneNumber, message) {
    client.messages.create({
        body: message,
        from: '+12513091686',
        to: phoneNumber
    })
    .then(message => console.log('SMS sent:', message.sid))
    .catch(error => console.error('Error sending SMS:', error));
}

module.exports = { sendSMSNotification };
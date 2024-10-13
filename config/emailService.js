const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORD
    }
});

function sendEmailNotification(email, message) {

    console.log(process.env.USEREMAIL, process.env.PASSWORD);

    const mailOption = {
        from: process.env.USEREMAIL,
        to: email,
        subject: 'CareOptimize Notification',
        text: message
    };

    transporter.sendMail(mailOption, (error, info) => {
        if(error) {
            console.error('Error sending email:', error);
        }else {
            console.log('Email sent:', info.response);
        }

    });
}

module.exports = { sendEmailNotification };
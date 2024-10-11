const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "h.t.n.11739@usci.ruh.ac.lk",
        pass: "993440370V"
    }
});

function sendEmailNotofication(email, message) {
    const mailOption = {
        from: 'h.t.n.11739@usci.ruh.ac.lk',
        to: email,
        subject: 'CareOptimize-Healthcare Notification',
        text: message
    };

    transporter.sendMail(mailOption, (error, info) => {
        if(error) {
            console.error('Error sending email:', error);
        }else {
            onsole.log('Email sent:', info.response);
        }

    });
}

module.exports = { sendEmailNotofication };
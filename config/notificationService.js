const cron = require('node-cron');
const moment = require('moment');
const Notification = require('../models/notificationModel');
const { sendSMSNotification } = require('./smsService');
const { sendEmailNotification } = require('./emailService');

//save nofications to database
async function saveNotification(userId, category, message) {
    const newNotification = new Notification({userId, category, message});
    try{
        await newNotification.save();
        console.log('Notification saved');
    } catch (error) {
        console.error('Error saving notification:', error);
    }
}

//function to send notification
function sendNotification(userId, phoneNumber, category, message) {
    sendSMSNotification(phoneNumber, message);
    //sendEmailNotification(email, message);
    saveNotification(userId, category, message);
}

//shedule a notification when add a new treatment
function scheduleTreatmentStartNotification(treatment) {
    const startDate = moment(treatment.startDate);
    const phoneNumber = `+94${treatment.phone.slice(1)}`;
    const category = "Genaral"

    const minute = startDate.minute();
    const hour = startDate.hour();
    const dayOfMonth = startDate.date();
    const month = startDate.month() + 1; // In moment.js, month is 0-indexed, so add 1
    const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;

    console.log("Cron Expression for Treatment Start:", cronExpression, phoneNumber);

    //cron.schedule('* * * * *', () => { console.log("Testing cron: notification when add a new treatment", startDate); })

    cron.schedule('* * * * *', () => {
        const createdDate = new Date(treatment.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
        console.log(`Cron job is running every minute.${createdDate}`);
        const message = `You got assigned a new on-going treatment plan on ${createdDate}, Go checkout.`;
        console.log('Scheduling Treatment Start Notification:', message);
        sendNotification(treatment.patientId, phoneNumber, category, message);
    });
}

//Schedule treatment end notification
function scheduleTreatmentEndNotification(treatment) {
    const endDate = moment(treatment.endDate);
    const reminderDate = endDate.subtract(3, 'days');

    //cron.schedule('* * * * *', () => { console.log("Testing cron:treatment end notification", reminderDate, endDate); })

    cron.schedule(reminderDate.format('m H D M *'), () => {
        const message = `Reminder: Your treatment(dignosis name: ${treatment.diagnosis}) ends on ${endDate.format('YYYY-MM-DD')}. Please make a new appointment.`;
        console.log('Scheduling Treatment Start Notification:', message);
        sendNotification(treatment.patientId, treatment.phone, treatment.email, message);
    });
}   

//Schedule checkup notifications
function scheduleCheckupNotifications(treatment) {
    const checkupDate = moment(treatment.createdAt); 

    treatment.checkups.forEach(checkup => {
        const evaluationDate = moment(checkup.evaluationDate);
        const reminderDate = evaluationDate.subtract(2, 'days');

       // cron.schedule('* * * * *', () => { console.log("Testing cron: checkup notifications", evaluationDate, reminderDate); })

        cron.schedule(checkupDate.format('m H D M *'), () => {
            const message = `Reminder: On ${checkupDate.format('YYYY-MM-DD')}, Your doctor request to get a "${checkup.testName}", Please make sure to get this done on or before ${evaluationDate.format('YYYY-MM-DD')}.`;
            console.log('Scheduling Treatment Start Notification:', message);
            sendNotification(treatment.patientId, treatment.phone, treatment.email, message);
        });

        cron.schedule(reminderDate.format('m H D M *'), () => {
            const message = `Reminder: You have to evaluate your ${checkup.testName} results on ${evaluationDate.format('YYYY-MM-DD')}. Please make an appointment.`;
            console.log('Scheduling Treatment Start Notification:', message);
            sendNotification(treatment.patientId, treatment.phone, treatment.email, message);
        });
    });
}

// Schedule treatment plan reminders
function scheduleTreatmentPlanNotifications(treatment) {
    const timeCorn = {
        'Morning': '0 8 * * *',
        'Noon': '0 12 * * *',
        'Evening': '0 18 * * *',
        'Night': '0 21 * * *',
        'Daily': '0 0 * * *' 
    }

    treatment.treatmentPlans.forEach(plan => {
        cron.schedule('* * * * *', () => { console.log("Testing cron:treatment plan reminders"); })

        plan.times.forEach(time => {
            const cornTime = timeCorn[time];
            const message = `Reminder: Take ${plan.drugName} (${plan.dosage}) ${time}, ${plan.mealInstruction}. note: Every ${plan.hourly} hourly.`;
            //cron.schedule('* * * * *', () => { console.log("Testing cron::treatment plan reminders", message); })
            cron.schedule(cornTime, () => {
                console.log('Scheduling Treatment Start Notification:', message);
                sendNotification(treatment.patientId, treatment.phone, treatment.email, message);
            })
        })
    })
}

module.exports = {
    scheduleTreatmentStartNotification,
    scheduleCheckupNotifications,
    scheduleTreatmentEndNotification,
    scheduleTreatmentPlanNotifications,
};
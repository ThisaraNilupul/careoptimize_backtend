const cron = require('node-cron');
const moment = require('moment');
const Notification = require('../models/notificationModel');

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
function sendNotification(userId, category, message) {
    saveNotification(userId, category, message);
}




//shedule a notification when add a new treatment
function scheduleTreatmentStartNotification(treatment) {
    const startDate = moment(treatment.createdAt);
    const phoneNumber = `+94${treatment.phone.slice(1)}`;
    const category = "Genaral"

    const cronExpressions = `${startDate.minute() + 1} ${startDate.hour()} ${startDate.date()} ${startDate.month() + 1} *`;
    console.log("Cron Expression for Treatment Start:", cronExpressions);

    const job = cron.schedule(cronExpressions, () => {
        const createdDate = new Date(treatment.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
        const message = `You got assigned a new on-going treatment plan on ${createdDate}, Go checkout.`;
        console.log('S-Cron job started.', message);
        sendNotification(treatment.patientId, category, message);

        job.stop();
        console.log('S-Cron job completed and stopped.');
    });
}

//Schedule treatment end notification
function scheduleTreatmentEndNotification(treatment) {
    const endDate = moment(treatment.endDate);
    const reminderDate = endDate.subtract(3, 'days');
    const phoneNumber = `+94${treatment.phone.slice(1)}`;
    const category = "Genaral"

    const cronExpressione = `${reminderDate.minute()} ${reminderDate.hour()} ${reminderDate.date()} ${reminderDate.month() + 1} *`;
    console.log("Cron Expression for Treatment Start:", cronExpressione);

    const job = cron.schedule(cronExpressione, () => {
        const endingDate = new Date(treatment.endDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
        const message = `Reminder: Your treatment(dignosis name: ${treatment.diagnosis}) ends on ${endingDate}. Please make a new appointment.`;
        sendNotification(treatment.patientId, category, message);

        job.stop();
        console.log('E-Cron job completed and stopped.');
    });
}   

//Schedule checkup notifications
function scheduleCheckupNotifications(treatment) {
    const startDate = moment(treatment.createdAt);
    const category = "Checkup";

    const cronExpressionone = `${startDate.minute() + 1} ${startDate.hour()} ${startDate.date()} ${startDate.month() + 1} *`;
    console.log("Cron Expression for Treatment Start:", cronExpressionone);

    treatment.checkups.forEach(checkup => {
        const evaluationDate = moment(checkup.evaluationDate);
        const reminderDate = evaluationDate.subtract(2, 'days');

        const cronExpressiontwo = `${reminderDate.minute()} ${reminderDate.hour()} ${reminderDate.date()} ${reminderDate.month() + 1} *`;
        console.log("Cron Expression for Treatment Start:", cronExpressiontwo);

        const jobone = cron.schedule(cronExpressionone, () => {
            const addedDate = new Date(treatment.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
            const evaluateDate = new Date(checkup.evaluationDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
            const message = `Reminder: On ${addedDate}, Your doctor assigned you to get a "${checkup.testName}" checkup, Please make sure to get this done on or before ${evaluateDate}.`;
            sendNotification(treatment.patientId, category, message);

            jobone.stop();
            console.log('C-one-Cron job completed and stopped.');
        });

        const jobtwo = cron.schedule(cronExpressiontwo, () => {
            const evaluateDate = new Date(treatment.evaluationDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
            const message = `Reminder: You have to evaluate your ${checkup.testName} results on ${evaluateDate}. Please make an appointment.`;
            sendNotification(treatment.patientId, category, message);

            jobtwo.stop();
            console.log('c-two-Cron job completed and stopped.');
        });
    });
}

// Schedule treatment plan reminders
function scheduleTreatmentPlanNotifications(treatment) {
    const timecron = {
        'Morning': '0 8 * * *',
        'Noon': '0 12 * * *',
        'Evening': '0 18 * * *',
        'Night': '0 22 * * *',
        'Daily': '0 0 * * *' 
    };
    const category = "Treatment";
    const startDate = moment(treatment.startDate);
    const endDate = moment(treatment.endDate);
    const today = moment();

    if(today.isBetween(startDate, endDate, null, '[]')) {
        treatment.treatmentPlans.forEach(plan => {
            plan.times.forEach(time => {
                const cronTime = timecron[time];
                console.log("cron Expression for Treatment Start:", cronTime);
                const message = `Reminder: Take ${plan.drugName} (${plan.dosage}), ${time}, ${plan.mealInstruction}. note: Every ${plan.hourly} hourly.`;

                const treatmentJob = cron.schedule(cronTime, () => {
                    const now = moment();
                    if(now.isBetween(startDate, endDate, null, '[]')){
                        sendNotification(treatment.patientId, category, message);
                    } else {
                        treatmentJob.stop();
                        console.log('T-Cron job completed and stopped.');
                    }
                });
            });
        });
    } else {
        console.log('Cron job not scheduled: Today is outside treatment start and end dates.');
    }
}

module.exports = {
    scheduleTreatmentStartNotification,
    scheduleCheckupNotifications,
    scheduleTreatmentEndNotification,
    scheduleTreatmentPlanNotifications,
};
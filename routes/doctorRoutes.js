const express = require('express');
const { check } = require('express-validator');
const { getDoctorProfile,
        editDoctorProfile,
        addDoctorInfo,
        getDoctorInfo,
        addDoctorWorkAt,
        editDoctorWorkAt,
        getDoctorWorkAt,
        deleteDoctorWorkAt,
        getAllPatients,
        addNewTreatment,
        getPatientTreatments,
        submitCheckupFeedback,
        closeTreatmentAndAddMedicalHistory
 } = require('../controllers/doctorControllers');
 const auth = require('../middleware/auth');
const { FeedbackInstance } = require('twilio/lib/rest/assistants/v1/assistant/feedback');

const router = express.Router();

//Get doctors's profile
router.get('/profile/:id', getDoctorProfile);

//edit doctor's profile
router.put('/profile/:id', editDoctorProfile);

//add doctor's doctorInfo
router.put('/profile/:id/doctor-info', addDoctorInfo);

//get doctor's doctorInfo
router.get('/profile/:id/doctor-info', getDoctorInfo);

//add doctor's work at info
router.post('/profile/:id/work-at', addDoctorWorkAt);

//edit doctor's work at info
router.put('/profile/:id/work-at/:wid', editDoctorWorkAt);

//get one doctor's work at info
router.get('/profile/:id/work-at/:wid', getDoctorWorkAt);

//delete one doctor's work at info
router.delete('/profile/:id/work-at/:wid', deleteDoctorWorkAt);

//get all patients
router.get('/add-teatment/all-patients', getAllPatients);



//add new treatment
router.post('/addTreatment', addNewTreatment);

//get patient's all treatments list
router.get('/treatments/:patientId', getPatientTreatments);

//close a treatment and add to the medical history
router.post('/closeTreatment', closeTreatmentAndAddMedicalHistory);


//add checkup FeedbackInstance
router.post('/checkup/feedback', submitCheckupFeedback);




module.exports = router;

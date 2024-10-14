const express = require('express');
const { check } = require('express-validator');
const {loginUser} = require('../controllers/userLoginController');
const {
        getPatientProfile, 
        addMedicalBioData, 
        getMedicalBio, 
        addrelative, 
        getOneRelative, 
        getRelatives, 
        deleteOneRelative, 
        updateOneRelative, 
        editPatientProfile,
        addHealthIssue,
        getAllHealthIssues,
        deleteHealthIssue,
        updateHealthIssue,
        getOneHealthIssue,
        getNotification,
        updateNotificationMarkAsRead,
        getAllTreatmetHistory
      } = require('../controllers/patientControllers');
const auth = require('../middleware/auth');

const router = express.Router();

//login patient
router.post('/login',
    [
        check('username').not().isEmpty().withMessage('Username is required'),
        check('password').exists().isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ], 
        loginUser
    );

// Get patient profile (Protected route)
// router.get('/profile', auth, getPatientProfile);


//Patient's Profile
//Get patient's profile
router.get('/profile/:id', getPatientProfile);

//edit patient's profile data
router.put('/Profile/:id', editPatientProfile)

//Add patient's Medical-Bio data
router.put('/profile/:id/medical-bio', addMedicalBioData);

//get patient's Medical-Bio data
router.get('/profile/:id/medical-bio', getMedicalBio);

//Add patient's relatives
router.post('/profile/:id/relative', addrelative);

//get a one patient's relative
router.get('/profile/:id/:rid', getOneRelative)

//get all patient's relatives
router.get('/profile/:id/relatives', getRelatives);

//delete a patient's relative
router.delete('/profile/:id/:rid', deleteOneRelative);

//update a patient's relative
router.put('/profile/:id/:rid', updateOneRelative);

//add patient health issues
router.post('/profile/:id/health-issues', addHealthIssue);

//get all patient's health issues
router.get('profile/:id/health-issues', getAllHealthIssues);

//get a one patient's health issue
router.get('/profile/:id/health-issues/:issueId', getOneHealthIssue);

//delete a health issue
router.delete('/profile/:id/health-issues/:issueId', deleteHealthIssue);

//update a health issue
router.put('/profile/:id/health-issues/:issueId', updateHealthIssue);

//notification route
router.get('/notifications/:userId', getNotification);

//update notification mark as read
router.patch('/notification/:id', updateNotificationMarkAsRead);

//get all medical treatments history
router.get('/medical-history/:patientId', getAllTreatmetHistory);


module.exports = router;
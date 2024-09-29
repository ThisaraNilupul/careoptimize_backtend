const express = require('express');
const { check } = require('express-validator');
const {registerPatient} = require('../controllers/patientRegisterController');
const {loginPatient} = require('../controllers/patientLoginController');
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
        getOneHealthIssue
      } = require('../controllers/patientControllers');
const auth = require('../middleware/auth');

const router = express.Router();

//Register patient
router.post('/register',
    [
        check('firstName').trim().isString().withMessage('Name can only be a string'),
        check('lastName').trim().isString().withMessage('Name can only be a string'),
        check('addressNo').trim().notEmpty().withMessage('Invalid addressNo Address'),
        check('street').trim().notEmpty().withMessage('Invalid street Address'),
        check('city').trim().isString().withMessage('Invalid City Name'),
        check('province').trim().isString().withMessage('Invalid Province'),
        check('nic').trim().notEmpty().withMessage('Add NIC number.'),
        check('phoneNumber').isString().trim().isLength({ min: 10, max: 10 }).withMessage('Invalid phone number'),
        check('email').trim().isEmail().withMessage('Invalid Email'),
        check('birthday').optional().isISO8601().toDate().withMessage('Invalid date of birth'),
        check('gender').optional().isIn(['M', 'F', 'O']).withMessage('Invalid gender'),
        check('username').not().isEmpty().withMessage('Username is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ], 
        registerPatient
    );

//login patient
router.post('/login',
    [
        check('username').not().isEmpty().withMessage('Username is required'),
        check('password').exists().isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ], 
        loginPatient
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


module.exports = router;
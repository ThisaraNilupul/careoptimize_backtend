const express = require('express');
const router = express.Router();
const registerPatient = require('../controllers/patientRegisterController');
const loginPatient = require('../controllers/patientLoginController');

//Register patient
router.post('/register', registerPatient);

//login patient
router.post('/login', loginPatient);

module.exports = router;
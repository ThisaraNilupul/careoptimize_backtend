const express = require('express');
const router = express.Router();
const registerPatient = require('../controllers/patientRegisterController');

//Register patient
router.post('/register', registerPatient);

module.exports = router;